/**
 * Pure TypeScript MNIST MLP inference engine.
 *
 * Loads weights from a binary file and runs forward-pass inference
 * for a DeepBatchMLPClassifier (784 → 256 → 256 → 256 → 10).
 *
 * Architecture per hidden layer:  y = relu(W @ x + w) + b
 * Output layer:                   softmax(W4 @ y3 + w4)
 *
 * Binary format (little-endian):
 *   - 1 uint32: number of tensors (11)
 *   - Per tensor: 1 uint32 (ndims), shape uint32s, flat float32 data
 *   - Tensor order: W1, w1, b1, W2, w2, b2, W3, w3, b3, W4, w4
 *
 * Zero dependencies.
 */

// ─── Interfaces ──────────────────────────────────────────────────────────────

export interface ModelWeights {
	/** Weight matrix (256, 784) */
	W1: Float32Array;
	/** Pre-activation bias (256,) */
	w1: Float32Array;
	/** Post-ReLU bias (256,) */
	b1: Float32Array;

	/** Weight matrix (256, 256) */
	W2: Float32Array;
	/** Pre-activation bias (256,) */
	w2: Float32Array;
	/** Post-ReLU bias (256,) */
	b2: Float32Array;

	/** Weight matrix (256, 256) */
	W3: Float32Array;
	/** Pre-activation bias (256,) */
	w3: Float32Array;
	/** Post-ReLU bias (256,) */
	b3: Float32Array;

	/** Weight matrix (10, 256) */
	W4: Float32Array;
	/** Pre-activation bias (10,) */
	w4: Float32Array;
}

export interface InferenceResult {
	/** Softmax probabilities for digits 0-9 */
	probabilities: Float32Array;
	/** Intermediate activations for visualization */
	activations: {
		/** Raw input pixels (784,) */
		input: Float32Array;
		/** Post-ReLU+bias hidden layer 1 (256,) */
		hidden1: Float32Array;
		/** Post-ReLU+bias hidden layer 2 (256,) */
		hidden2: Float32Array;
		/** Post-ReLU+bias hidden layer 3 (256,) */
		hidden3: Float32Array;
		/** Softmax output (10,) */
		output: Float32Array;
	};
}

// ─── Weight loading ──────────────────────────────────────────────────────────

const DEFAULT_WEIGHTS_URL = "/models/mnist-mlp-weights.bin";

let cachedWeights: ModelWeights | null = null;

/**
 * Parse a single tensor from the binary buffer.
 * Returns the tensor data and the new byte offset.
 */
function parseTensor(
	view: DataView,
	offset: number,
): { data: Float32Array; shape: number[]; offset: number } {
	const ndims = view.getUint32(offset, true);
	offset += 4;

	const shape: number[] = [];
	let numElements = 1;
	for (let i = 0; i < ndims; i++) {
		const dim = view.getUint32(offset, true);
		shape.push(dim);
		numElements *= dim;
		offset += 4;
	}

	// Read float32 data — copy into a new Float32Array to avoid alignment issues
	const data = new Float32Array(numElements);
	for (let i = 0; i < numElements; i++) {
		data[i] = view.getFloat32(offset + i * 4, true);
	}
	offset += numElements * 4;

	return { data, shape, offset };
}

/**
 * Load model weights from the binary file.
 * Caches the result after first successful load.
 */
export async function loadWeights(
	url: string = DEFAULT_WEIGHTS_URL,
): Promise<ModelWeights> {
	if (cachedWeights) return cachedWeights;

	const response = await fetch(url);
	if (!response.ok) {
		throw new Error(
			`Failed to load MNIST weights from ${url}: ${response.status} ${response.statusText}`,
		);
	}

	const buffer = await response.arrayBuffer();
	const view = new DataView(buffer);
	let offset = 0;

	// Header: number of tensors
	const numTensors = view.getUint32(offset, true);
	offset += 4;

	if (numTensors !== 11) {
		throw new Error(`Expected 11 tensors in weight file, got ${numTensors}`);
	}

	// Parse tensors in order: W1, w1, b1, W2, w2, b2, W3, w3, b3, W4, w4
	const tensors: Float32Array[] = [];
	for (let i = 0; i < numTensors; i++) {
		const result = parseTensor(view, offset);
		tensors.push(result.data);
		offset = result.offset;
	}

	const weights: ModelWeights = {
		W1: tensors[0],
		w1: tensors[1],
		b1: tensors[2],
		W2: tensors[3],
		w2: tensors[4],
		b2: tensors[5],
		W3: tensors[6],
		w3: tensors[7],
		b3: tensors[8],
		W4: tensors[9],
		w4: tensors[10],
	};

	cachedWeights = weights;
	return weights;
}

// ─── Linear algebra primitives ───────────────────────────────────────────────

/**
 * Matrix-vector multiply: y = W @ x
 * W is (outDim, inDim) stored row-major, x is (inDim,), y is (outDim,).
 */
function matvec(
	W: Float32Array,
	x: Float32Array,
	outDim: number,
	inDim: number,
): Float32Array {
	const y = new Float32Array(outDim);
	for (let i = 0; i < outDim; i++) {
		let sum = 0;
		const rowOffset = i * inDim;
		for (let j = 0; j < inDim; j++) {
			sum += W[rowOffset + j] * x[j];
		}
		y[i] = sum;
	}
	return y;
}

/**
 * Add bias in-place: y[i] += bias[i]
 */
function addBias(y: Float32Array, bias: Float32Array): void {
	for (let i = 0; i < y.length; i++) {
		y[i] += bias[i];
	}
}

/**
 * ReLU in-place: y[i] = max(0, y[i])
 */
function relu(y: Float32Array): void {
	for (let i = 0; i < y.length; i++) {
		if (y[i] < 0) y[i] = 0;
	}
}

/**
 * Numerically stable softmax: subtract max, exponentiate, normalize.
 */
function softmax(logits: Float32Array): Float32Array {
	const n = logits.length;
	const result = new Float32Array(n);

	// Find max for numerical stability
	let max = logits[0];
	for (let i = 1; i < n; i++) {
		if (logits[i] > max) max = logits[i];
	}

	// Exponentiate and sum
	let sum = 0;
	for (let i = 0; i < n; i++) {
		result[i] = Math.exp(logits[i] - max);
		sum += result[i];
	}

	// Normalize
	const invSum = 1 / (sum + 1e-8);
	for (let i = 0; i < n; i++) {
		result[i] *= invSum;
	}

	return result;
}

// ─── Forward pass ────────────────────────────────────────────────────────────

/**
 * Run forward-pass inference through the MLP.
 *
 * Hidden layers:  y = relu(W @ x + w) + b
 * Output layer:   softmax(W4 @ y3 + w4)
 *
 * @param input  Flat 784-element Float32Array (normalized pixel values)
 * @param weights  Loaded model weights
 * @returns  Probabilities and intermediate activations
 */
export function forward(
	input: Float32Array,
	weights: ModelWeights,
): InferenceResult {
	if (input.length !== 784) {
		throw new Error(`Expected input of length 784, got ${input.length}`);
	}

	// Layer 1: 784 → 256
	const h1 = matvec(weights.W1, input, 256, 784);
	addBias(h1, weights.w1); // pre-activation bias
	relu(h1);
	const y1 = new Float32Array(h1); // copy before adding post-ReLU bias
	addBias(y1, weights.b1); // post-ReLU bias

	// Layer 2: 256 → 256
	const h2 = matvec(weights.W2, y1, 256, 256);
	addBias(h2, weights.w2);
	relu(h2);
	const y2 = new Float32Array(h2);
	addBias(y2, weights.b2);

	// Layer 3: 256 → 256
	const h3 = matvec(weights.W3, y2, 256, 256);
	addBias(h3, weights.w3);
	relu(h3);
	const y3 = new Float32Array(h3);
	addBias(y3, weights.b3);

	// Output layer: 256 → 10
	const h4 = matvec(weights.W4, y3, 10, 256);
	addBias(h4, weights.w4);
	const probabilities = softmax(h4);

	return {
		probabilities,
		activations: {
			input: new Float32Array(input), // defensive copy
			hidden1: y1,
			hidden2: y2,
			hidden3: y3,
			output: probabilities,
		},
	};
}
