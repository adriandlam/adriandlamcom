/**
 * Pure TypeScript CNN inference engine.
 *
 * Loads weights from a binary file and runs forward-pass inference
 * for a CNN with fused BatchNorm:
 *   Conv2d(1,32,3) + BN + ReLU + MaxPool(2)
 *   Conv2d(32,32,3) + BN + ReLU + MaxPool(2)
 *   Flatten(800) → Linear(800,10)
 *
 * BatchNorm is fused into Conv at export time, so inference is:
 *   Conv → ReLU → MaxPool → Conv → ReLU → MaxPool → Linear
 *
 * Binary format (little-endian):
 *   - 1 uint32: number of tensors (6)
 *   - Per tensor: 1 uint32 (ndims), shape uint32s, flat float32 data
 *   - Order: conv1_weight, conv1_bias, conv2_weight, conv2_bias, fc_weight, fc_bias
 *
 * Zero dependencies.
 */

// ─── Interfaces ──────────────────────────────────────────────────────────────

export interface CnnWeights {
	/** Conv1 weight (32, 1, 3, 3) — BN fused */
	conv1Weight: Float32Array;
	/** Conv1 bias (32,) — BN fused */
	conv1Bias: Float32Array;
	/** Conv2 weight (32, 32, 3, 3) — BN fused */
	conv2Weight: Float32Array;
	/** Conv2 bias (32,) — BN fused */
	conv2Bias: Float32Array;
	/** FC weight (10, 800) */
	fcWeight: Float32Array;
	/** FC bias (10,) */
	fcBias: Float32Array;
}

export interface CnnInferenceResult {
	/** Softmax probabilities for digits 0-9 */
	probabilities: Float32Array;
	/** Intermediate feature maps for visualization */
	featureMaps: {
		/** After conv1+relu: (32, 26, 26) */
		conv1: Float32Array;
		/** After maxpool1: (32, 13, 13) */
		pool1: Float32Array;
		/** After conv2+relu: (32, 11, 11) */
		conv2: Float32Array;
		/** After maxpool2: (32, 5, 5) */
		pool2: Float32Array;
	};
}

// ─── Weight loading ──────────────────────────────────────────────────────────

const DEFAULT_CNN_WEIGHTS_URL = "/models/mnist-cnn-weights.bin";

let cachedCnnWeights: CnnWeights | null = null;

export async function loadCnnWeights(
	url: string = DEFAULT_CNN_WEIGHTS_URL,
): Promise<CnnWeights> {
	if (cachedCnnWeights) return cachedCnnWeights;

	const response = await fetch(url);
	if (!response.ok) {
		throw new Error(
			`Failed to load CNN weights from ${url}: ${response.status}`,
		);
	}

	const buffer = await response.arrayBuffer();
	const view = new DataView(buffer);
	let offset = 0;

	const numTensors = view.getUint32(offset, true);
	offset += 4;

	if (numTensors !== 6) {
		throw new Error(`Expected 6 tensors in CNN weight file, got ${numTensors}`);
	}

	const tensors: Float32Array[] = [];
	for (let t = 0; t < numTensors; t++) {
		const ndims = view.getUint32(offset, true);
		offset += 4;
		let numElements = 1;
		for (let d = 0; d < ndims; d++) {
			numElements *= view.getUint32(offset, true);
			offset += 4;
		}
		const byteLength = numElements * 4;
		// Fast bulk copy — slice ensures proper alignment
		const data = new Float32Array(buffer.slice(offset, offset + byteLength));
		offset += byteLength;
		tensors.push(data);
	}

	cachedCnnWeights = {
		conv1Weight: tensors[0],
		conv1Bias: tensors[1],
		conv2Weight: tensors[2],
		conv2Bias: tensors[3],
		fcWeight: tensors[4],
		fcBias: tensors[5],
	};

	return cachedCnnWeights;
}

// ─── CNN primitives ──────────────────────────────────────────────────────────

/**
 * 2D convolution: output = conv(input, weight) + bias
 * Input:  (inC, H, W) flat
 * Weight: (outC, inC, kH, kW) flat
 * Output: (outC, outH, outW) flat where outH = H-kH+1, outW = W-kW+1
 */
function conv2d(
	input: Float32Array,
	weight: Float32Array,
	bias: Float32Array,
	inC: number,
	H: number,
	W: number,
	outC: number,
	kH: number,
	kW: number,
): Float32Array {
	const outH = H - kH + 1;
	const outW = W - kW + 1;
	const output = new Float32Array(outC * outH * outW);

	for (let oc = 0; oc < outC; oc++) {
		for (let oh = 0; oh < outH; oh++) {
			for (let ow = 0; ow < outW; ow++) {
				let sum = bias[oc];
				for (let ic = 0; ic < inC; ic++) {
					for (let kh = 0; kh < kH; kh++) {
						for (let kw = 0; kw < kW; kw++) {
							sum +=
								input[ic * H * W + (oh + kh) * W + (ow + kw)] *
								weight[oc * inC * kH * kW + ic * kH * kW + kh * kW + kw];
						}
					}
				}
				output[oc * outH * outW + oh * outW + ow] = sum;
			}
		}
	}
	return output;
}

/**
 * ReLU in-place.
 */
function reluInPlace(x: Float32Array): void {
	for (let i = 0; i < x.length; i++) {
		if (x[i] < 0) x[i] = 0;
	}
}

/**
 * 2D max pooling with kernel size and stride both = poolSize.
 * Input:  (C, H, W) flat
 * Output: (C, H/poolSize, W/poolSize) flat
 */
function maxPool2d(
	input: Float32Array,
	C: number,
	H: number,
	W: number,
	poolSize: number,
): Float32Array {
	const outH = Math.floor(H / poolSize);
	const outW = Math.floor(W / poolSize);
	const output = new Float32Array(C * outH * outW);

	for (let c = 0; c < C; c++) {
		for (let oh = 0; oh < outH; oh++) {
			for (let ow = 0; ow < outW; ow++) {
				let maxVal = -Infinity;
				for (let ph = 0; ph < poolSize; ph++) {
					for (let pw = 0; pw < poolSize; pw++) {
						const idx =
							c * H * W + (oh * poolSize + ph) * W + (ow * poolSize + pw);
						if (input[idx] > maxVal) maxVal = input[idx];
					}
				}
				output[c * outH * outW + oh * outW + ow] = maxVal;
			}
		}
	}
	return output;
}

/**
 * Fully connected layer: y = W @ x + bias
 * W is (outDim, inDim) row-major.
 */
function linear(
	input: Float32Array,
	weight: Float32Array,
	bias: Float32Array,
	inDim: number,
	outDim: number,
): Float32Array {
	const output = new Float32Array(outDim);
	for (let i = 0; i < outDim; i++) {
		let sum = bias[i];
		const rowOffset = i * inDim;
		for (let j = 0; j < inDim; j++) {
			sum += weight[rowOffset + j] * input[j];
		}
		output[i] = sum;
	}
	return output;
}

/**
 * Numerically stable softmax.
 */
function softmax(logits: Float32Array): Float32Array {
	const n = logits.length;
	const result = new Float32Array(n);
	let max = logits[0];
	for (let i = 1; i < n; i++) {
		if (logits[i] > max) max = logits[i];
	}
	let sum = 0;
	for (let i = 0; i < n; i++) {
		result[i] = Math.exp(logits[i] - max);
		sum += result[i];
	}
	const invSum = 1 / (sum + 1e-8);
	for (let i = 0; i < n; i++) {
		result[i] *= invSum;
	}
	return result;
}

// ─── Forward pass ────────────────────────────────────────────────────────────

/**
 * Run CNN forward pass.
 *
 * @param input  Flat 784-element Float32Array (raw pixel values 0-1, will be normalized)
 * @param weights  Loaded CNN weights (BN already fused)
 * @returns  Probabilities and intermediate feature maps
 */
export function cnnForward(
	input: Float32Array,
	weights: CnnWeights,
): CnnInferenceResult {
	if (input.length !== 784) {
		throw new Error(`Expected input of length 784, got ${input.length}`);
	}

	// Normalize to match training distribution
	const normalized = new Float32Array(784);
	for (let i = 0; i < 784; i++) {
		normalized[i] = (input[i] - 0.1307) / 0.3081;
	}

	// Input is (1, 28, 28) — already in the right layout

	// Conv1: (1,28,28) → (32,26,26)
	const conv1Out = conv2d(
		normalized,
		weights.conv1Weight,
		weights.conv1Bias,
		1,
		28,
		28,
		32,
		3,
		3,
	);
	reluInPlace(conv1Out);
	const conv1Copy = new Float32Array(conv1Out); // save for visualization

	// MaxPool1: (32,26,26) → (32,13,13)
	const pool1Out = maxPool2d(conv1Out, 32, 26, 26, 2);
	const pool1Copy = new Float32Array(pool1Out);

	// Conv2: (32,13,13) → (32,11,11)
	const conv2Out = conv2d(
		pool1Out,
		weights.conv2Weight,
		weights.conv2Bias,
		32,
		13,
		13,
		32,
		3,
		3,
	);
	reluInPlace(conv2Out);
	const conv2Copy = new Float32Array(conv2Out);

	// MaxPool2: (32,11,11) → (32,5,5)
	const pool2Out = maxPool2d(conv2Out, 32, 11, 11, 2);
	const pool2Copy = new Float32Array(pool2Out);

	// Flatten: pool2Out is already flat (32*5*5 = 800)

	// FC: 800 → 10
	const logits = linear(pool2Out, weights.fcWeight, weights.fcBias, 800, 10);
	const probabilities = softmax(logits);

	return {
		probabilities,
		featureMaps: {
			conv1: conv1Copy,
			pool1: pool1Copy,
			conv2: conv2Copy,
			pool2: pool2Copy,
		},
	};
}
