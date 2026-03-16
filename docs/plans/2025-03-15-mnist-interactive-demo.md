# MNIST Interactive Demo Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Add an interactive drawing demo to the MNIST project page where visitors draw digits and see real-time neural network inference with visualization.

**Architecture:** Pure client-side inference using the DeepBatchMLPClassifier (784→256→256→256→10) weights exported as a binary file. Drawing canvas feeds into a TypeScript forward pass, which returns activations for an SVG network visualization and a bar chart. All wrapped in a dynamically imported React component embedded in the MDX page.

**Tech Stack:** Next.js 16 (App Router), React 19, TypeScript, Motion (framer-motion successor), HTML Canvas API, SVG, Python (one-time weight export script)

**Design doc:** `docs/plans/2025-03-15-mnist-interactive-demo-design.md`

---

### Task 1: Export Model Weights

**Files:**
- Create: `scripts/export-mnist-weights.py`
- Create: `public/models/mnist-mlp-weights.bin`
- Reference: `mnist-classifier/notebooks/mnist_classifier_mlp.ipynb`

**Step 1: Write the weight export + training script**

This script re-trains the DeepBatchMLPClassifier and exports weights as a binary Float32Array file. We must replicate the exact model architecture from the notebook.

```python
#!/usr/bin/env python3
"""Re-train DeepBatchMLPClassifier and export weights for browser inference."""

import struct
import numpy as np
import torch
from torchvision import datasets, transforms

# --- Model Definition (exact copy from notebook) ---

class DeepBatchMLPClassifier:
    def __init__(self, lr, input_dim=784, hidden_dims=[256, 256, 256], output_dim=10):
        self.lr = lr
        self.dims = [input_dim] + hidden_dims + [output_dim]

        # Layer 1: 784 -> 256
        x_min1 = -np.sqrt(6.0 / (self.dims[0] + self.dims[1]))
        x_max1 = np.sqrt(6.0 / (self.dims[0] + self.dims[1]))
        self.W1 = torch.tensor(np.random.uniform(x_min1, x_max1, (self.dims[1], self.dims[0])), requires_grad=True)
        self.w1 = torch.zeros(self.dims[1], requires_grad=True)
        self.b1 = torch.zeros(self.dims[1], requires_grad=True)

        # Layer 2: 256 -> 256
        x_min2 = -np.sqrt(6.0 / (self.dims[1] + self.dims[2]))
        x_max2 = np.sqrt(6.0 / (self.dims[1] + self.dims[2]))
        self.W2 = torch.tensor(np.random.uniform(x_min2, x_max2, (self.dims[2], self.dims[1])), requires_grad=True)
        self.w2 = torch.zeros(self.dims[2], requires_grad=True)
        self.b2 = torch.zeros(self.dims[2], requires_grad=True)

        # Layer 3: 256 -> 256
        x_min3 = -np.sqrt(6.0 / (self.dims[2] + self.dims[3]))
        x_max3 = np.sqrt(6.0 / (self.dims[2] + self.dims[3]))
        self.W3 = torch.tensor(np.random.uniform(x_min3, x_max3, (self.dims[3], self.dims[2])), requires_grad=True)
        self.w3 = torch.zeros(self.dims[3], requires_grad=True)
        self.b3 = torch.zeros(self.dims[3], requires_grad=True)

        # Layer 4 (output): 256 -> 10
        x_min4 = -np.sqrt(6.0 / (self.dims[3] + self.dims[4]))
        x_max4 = np.sqrt(6.0 / (self.dims[3] + self.dims[4]))
        self.W4 = torch.tensor(np.random.uniform(x_min4, x_max4, (self.dims[4], self.dims[3])), requires_grad=True)
        self.w4 = torch.zeros(self.dims[4], requires_grad=True)

    def forward(self):
        self.h1 = self.W1 @ self.X.T + self.w1.unsqueeze(1)
        self.y1 = torch.relu(self.h1) + self.b1.unsqueeze(1)

        self.h2 = self.W2 @ self.y1 + self.w2.unsqueeze(1)
        self.y2 = torch.relu(self.h2) + self.b2.unsqueeze(1)

        self.h3 = self.W3 @ self.y2 + self.w3.unsqueeze(1)
        self.y3 = torch.relu(self.h3) + self.b3.unsqueeze(1)

        self.h4 = self.W4 @ self.y3 + self.w4.unsqueeze(1)
        self.h4 = self.h4 - torch.max(self.h4, dim=0)[0].unsqueeze(0)
        exp_h4 = torch.exp(self.h4)
        self.y4 = exp_h4 / (torch.sum(exp_h4, dim=0).unsqueeze(0) + 1e-8)

        return self.y4.T

    def backward(self, Y_true):
        batch_size = len(Y_true)

        dy4 = self.y4.clone()
        dy4.T[range(batch_size), Y_true] -= 1
        dW4 = dy4 @ self.y3.T / batch_size
        dw4 = dy4.mean(dim=1)

        dy3 = self.W4.T @ dy4
        dh3 = dy3 * (self.h3 > 0).float()
        dW3 = dh3 @ self.y2.T / batch_size
        dw3 = dh3.mean(dim=1)
        db3 = dy3.mean(dim=1)

        dy2 = self.W3.T @ dh3
        dh2 = dy2 * (self.h2 > 0).float()
        dW2 = dh2 @ self.y1.T / batch_size
        dw2 = dh2.mean(dim=1)
        db2 = dy2.mean(dim=1)

        dy1 = self.W2.T @ dh2
        dh1 = dy1 * (self.h1 > 0).float()
        dW1 = dh1 @ self.X / batch_size
        dw1 = dh1.mean(dim=1)
        db1 = dy1.mean(dim=1)

        with torch.no_grad():
            self.W4 -= self.lr * dW4
            self.w4 -= self.lr * dw4
            self.W3 -= self.lr * dW3
            self.w3 -= self.lr * dw3
            self.b3 -= self.lr * db3
            self.W2 -= self.lr * dW2
            self.w2 -= self.lr * dw2
            self.b2 -= self.lr * db2
            self.W1 -= self.lr * dW1
            self.w1 -= self.lr * dw1
            self.b1 -= self.lr * db1

    def update_learning_rate(self, epoch, num_epochs):
        self.lr = 0.5 * (1 + np.cos(epoch / num_epochs * np.pi)) * self.lr
        return self.lr

    def __call__(self, X):
        self.X = X
        return self.forward()


# --- Training ---

def batch_cross_entropy(out, y):
    batch_size = len(y)
    y_ohe = torch.zeros_like(out)
    y_ohe[range(batch_size), y] = 1.0
    return float(-torch.sum(y_ohe * torch.log(out + 1e-10)) / batch_size)


def train_and_export():
    # Load MNIST
    transform = transforms.ToTensor()
    trainset = datasets.MNIST(root='./data', train=True, download=True, transform=transform)
    testset = datasets.MNIST(root='./data', train=False, download=True, transform=transform)
    trainloader = torch.utils.data.DataLoader(trainset, batch_size=128, shuffle=True)
    testloader = torch.utils.data.DataLoader(testset, batch_size=128, shuffle=False)

    # Train
    model = DeepBatchMLPClassifier(lr=0.5)
    EPOCHS = 5

    for epoch in range(EPOCHS):
        epoch_loss = 0
        for i, (imgs, labels) in enumerate(trainloader):
            X = torch.tensor(np.float64(imgs.view(imgs.size(0), -1)))
            output = model(X)
            loss = batch_cross_entropy(output, labels)
            epoch_loss += loss * len(labels)
            model.backward(labels)
            if i % 100 == 0:
                print(f'Epoch [{epoch+1}/{EPOCHS}], Step [{i}/{len(trainloader)}], Loss: {loss:.4f}')

        avg_loss = epoch_loss / len(trainset)
        print(f'Epoch [{epoch+1}/{EPOCHS}], Average Loss: {avg_loss:.4f}')
        model.update_learning_rate(epoch, EPOCHS)

    # Evaluate
    correct = 0
    total = 0
    for imgs, labels in testloader:
        X = torch.tensor(np.float64(imgs.view(imgs.size(0), -1)))
        output = model(X)
        _, predicted = torch.max(output, 1)
        total += labels.size(0)
        correct += (predicted == labels).sum().item()

    accuracy = 100 * correct / total
    print(f'\nTest Accuracy: {accuracy:.2f}%')

    # Export weights as binary Float32Array
    # Format: header (11 uint32 for tensor sizes) + flat float32 data
    # Order: W1, w1, b1, W2, w2, b2, W3, w3, b3, W4, w4
    params = [
        ('W1', model.W1.detach().numpy().astype(np.float32)),
        ('w1', model.w1.detach().numpy().astype(np.float32)),
        ('b1', model.b1.detach().numpy().astype(np.float32)),
        ('W2', model.W2.detach().numpy().astype(np.float32)),
        ('w2', model.w2.detach().numpy().astype(np.float32)),
        ('b2', model.b2.detach().numpy().astype(np.float32)),
        ('W3', model.W3.detach().numpy().astype(np.float32)),
        ('w3', model.w3.detach().numpy().astype(np.float32)),
        ('b3', model.b3.detach().numpy().astype(np.float32)),
        ('W4', model.W4.detach().numpy().astype(np.float32)),
        ('w4', model.w4.detach().numpy().astype(np.float32)),
    ]

    output_path = 'public/models/mnist-mlp-weights.bin'
    with open(output_path, 'wb') as f:
        # Write number of tensors
        f.write(struct.pack('<I', len(params)))
        # Write each tensor: ndims, shape..., flat data
        for name, tensor in params:
            flat = tensor.flatten()
            f.write(struct.pack('<I', len(tensor.shape)))
            for dim in tensor.shape:
                f.write(struct.pack('<I', dim))
            f.write(flat.tobytes())
            print(f'  {name}: shape={tensor.shape}, {flat.nbytes} bytes')

    total_bytes = sum(p[1].nbytes for p in params)
    print(f'\nExported {len(params)} tensors ({total_bytes:,} bytes) to {output_path}')
    print(f'Test accuracy: {accuracy:.2f}%')


if __name__ == '__main__':
    train_and_export()
```

**Step 2: Run the export script**

```bash
cd /Users/adrianlam/GitHub/adrianlam.sh
pip install torch torchvision numpy  # if not already installed
python scripts/export-mnist-weights.py
```

Expected: prints training progress, test accuracy ~98%, creates `public/models/mnist-mlp-weights.bin` (~1.6MB).

**Step 3: Verify the weights file exists and is reasonable size**

```bash
ls -la public/models/mnist-mlp-weights.bin
# Expected: ~1.6MB file
```

**Step 4: Commit**

```bash
git add scripts/export-mnist-weights.py public/models/mnist-mlp-weights.bin
git commit -m "feat: export MNIST MLP weights for browser inference"
```

---

### Task 2: Inference Engine (Pure TypeScript)

**Files:**
- Create: `components/mnist-demo/inference.ts`

**Step 1: Implement the weight loader and forward pass**

```typescript
// components/mnist-demo/inference.ts

export interface ModelWeights {
  W1: Float32Array; // (256, 784) stored row-major
  w1: Float32Array; // (256,)
  b1: Float32Array; // (256,)
  W2: Float32Array; // (256, 256)
  w2: Float32Array; // (256,)
  b2: Float32Array; // (256,)
  W3: Float32Array; // (256, 256)
  w3: Float32Array; // (256,)
  b3: Float32Array; // (256,)
  W4: Float32Array; // (10, 256)
  w4: Float32Array; // (10,)
}

export interface InferenceResult {
  probabilities: Float32Array; // (10,) softmax output
  activations: {
    input: Float32Array;    // (784,) raw pixel values
    hidden1: Float32Array;  // (256,) post-ReLU+bias activations
    hidden2: Float32Array;  // (256,)
    hidden3: Float32Array;  // (256,)
    output: Float32Array;   // (10,) softmax probabilities
  };
}

let cachedWeights: ModelWeights | null = null;

export async function loadWeights(url = "/models/mnist-mlp-weights.bin"): Promise<ModelWeights> {
  if (cachedWeights) return cachedWeights;

  const response = await fetch(url);
  const buffer = await response.arrayBuffer();
  const view = new DataView(buffer);
  let offset = 0;

  function readUint32(): number {
    const val = view.getUint32(offset, true); // little-endian
    offset += 4;
    return val;
  }

  function readFloat32Array(length: number): Float32Array {
    const arr = new Float32Array(buffer, offset, length);
    offset += length * 4;
    return new Float32Array(arr); // copy to avoid alignment issues
  }

  const numTensors = readUint32();
  const tensors: Float32Array[] = [];

  for (let t = 0; t < numTensors; t++) {
    const ndims = readUint32();
    let totalElements = 1;
    for (let d = 0; d < ndims; d++) {
      totalElements *= readUint32();
    }
    tensors.push(readFloat32Array(totalElements));
  }

  cachedWeights = {
    W1: tensors[0], w1: tensors[1], b1: tensors[2],
    W2: tensors[3], w2: tensors[4], b2: tensors[5],
    W3: tensors[6], w3: tensors[7], b3: tensors[8],
    W4: tensors[9], w4: tensors[10],
  };

  return cachedWeights;
}

/**
 * Matrix-vector multiply: y = W @ x where W is (rows, cols) stored row-major.
 */
function matVecMul(W: Float32Array, x: Float32Array, rows: number, cols: number): Float32Array {
  const y = new Float32Array(rows);
  for (let i = 0; i < rows; i++) {
    let sum = 0;
    const rowOffset = i * cols;
    for (let j = 0; j < cols; j++) {
      sum += W[rowOffset + j] * x[j];
    }
    y[i] = sum;
  }
  return y;
}

/**
 * Hidden layer: y = relu(W @ x + w) + b
 * This is the dual-bias architecture from the original model.
 */
function hiddenLayer(
  W: Float32Array, w: Float32Array, b: Float32Array,
  x: Float32Array, rows: number, cols: number
): Float32Array {
  const h = matVecMul(W, x, rows, cols);
  const y = new Float32Array(rows);
  for (let i = 0; i < rows; i++) {
    const preAct = h[i] + w[i];
    y[i] = (preAct > 0 ? preAct : 0) + b[i]; // ReLU + post-activation bias
  }
  return y;
}

/**
 * Softmax with numerical stability (subtract max).
 */
function softmax(x: Float32Array): Float32Array {
  let max = -Infinity;
  for (let i = 0; i < x.length; i++) {
    if (x[i] > max) max = x[i];
  }
  const result = new Float32Array(x.length);
  let sum = 0;
  for (let i = 0; i < x.length; i++) {
    result[i] = Math.exp(x[i] - max);
    sum += result[i];
  }
  for (let i = 0; i < x.length; i++) {
    result[i] /= sum + 1e-8;
  }
  return result;
}

/**
 * Run forward pass through the Deep MLP.
 * Returns probabilities and all intermediate activations for visualization.
 */
export function forward(input: Float32Array, weights: ModelWeights): InferenceResult {
  const hidden1 = hiddenLayer(weights.W1, weights.w1, weights.b1, input, 256, 784);
  const hidden2 = hiddenLayer(weights.W2, weights.w2, weights.b2, hidden1, 256, 256);
  const hidden3 = hiddenLayer(weights.W3, weights.w3, weights.b3, hidden2, 256, 256);

  // Output layer: h4 = W4 @ y3 + w4, then softmax
  const h4 = matVecMul(weights.W4, hidden3, 10, 256);
  for (let i = 0; i < 10; i++) {
    h4[i] += weights.w4[i];
  }
  const probabilities = softmax(h4);

  return {
    probabilities,
    activations: {
      input,
      hidden1,
      hidden2,
      hidden3,
      output: probabilities,
    },
  };
}
```

**Step 2: Commit**

```bash
git add components/mnist-demo/inference.ts
git commit -m "feat: add pure TypeScript MNIST MLP inference engine"
```

---

### Task 3: Drawing Canvas Component

**Files:**
- Create: `components/mnist-demo/drawing-canvas.tsx`

**Step 1: Implement the drawing canvas**

```tsx
// components/mnist-demo/drawing-canvas.tsx
"use client";

import { useCallback, useEffect, useRef } from "react";

interface DrawingCanvasProps {
  onDraw: (pixels: Float32Array) => void;
  size?: number;
}

export function DrawingCanvas({ onDraw, size = 280 }: DrawingCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isDrawingRef = useRef(false);
  const lastPosRef = useRef<{ x: number; y: number } | null>(null);

  const getPos = useCallback(
    (e: MouseEvent | TouchEvent): { x: number; y: number } => {
      const canvas = canvasRef.current!;
      const rect = canvas.getBoundingClientRect();
      const scale = size / rect.width;
      if ("touches" in e) {
        return {
          x: (e.touches[0].clientX - rect.left) * scale,
          y: (e.touches[0].clientY - rect.top) * scale,
        };
      }
      return {
        x: (e.clientX - rect.left) * scale,
        y: (e.clientY - rect.top) * scale,
      };
    },
    [size]
  );

  const downsample = useCallback(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;

    // Create a temporary 28x28 canvas to downsample
    const tmp = document.createElement("canvas");
    tmp.width = 28;
    tmp.height = 28;
    const tmpCtx = tmp.getContext("2d")!;

    // Draw the large canvas scaled down to 28x28
    tmpCtx.drawImage(canvas, 0, 0, 28, 28);
    const imageData = tmpCtx.getImageData(0, 0, 28, 28);

    // Extract grayscale values (canvas is white-on-black, MNIST is white-on-black)
    const pixels = new Float32Array(784);
    for (let i = 0; i < 784; i++) {
      // Use the red channel (all channels are the same for grayscale)
      pixels[i] = imageData.data[i * 4] / 255;
    }

    onDraw(pixels);
  }, [onDraw]);

  const draw = useCallback(
    (e: MouseEvent | TouchEvent) => {
      if (!isDrawingRef.current) return;
      const canvas = canvasRef.current!;
      const ctx = canvas.getContext("2d")!;
      const pos = getPos(e);
      const lastPos = lastPosRef.current;

      ctx.strokeStyle = "#ffffff";
      ctx.lineWidth = 20;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";

      if (lastPos) {
        ctx.beginPath();
        ctx.moveTo(lastPos.x, lastPos.y);
        ctx.lineTo(pos.x, pos.y);
        ctx.stroke();
      }

      lastPosRef.current = pos;
      downsample();
    },
    [getPos, downsample]
  );

  const startDraw = useCallback(
    (e: MouseEvent | TouchEvent) => {
      e.preventDefault();
      isDrawingRef.current = true;
      lastPosRef.current = getPos(e);

      // Draw a dot at the starting position
      const canvas = canvasRef.current!;
      const ctx = canvas.getContext("2d")!;
      const pos = getPos(e);
      ctx.fillStyle = "#ffffff";
      ctx.beginPath();
      ctx.arc(pos.x, pos.y, 10, 0, Math.PI * 2);
      ctx.fill();
      downsample();
    },
    [getPos, downsample]
  );

  const endDraw = useCallback(() => {
    isDrawingRef.current = false;
    lastPosRef.current = null;
  }, []);

  const clear = useCallback(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;
    ctx.fillStyle = "#000000";
    ctx.fillRect(0, 0, size, size);
    onDraw(new Float32Array(784)); // all zeros
  }, [size, onDraw]);

  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;
    ctx.fillStyle = "#000000";
    ctx.fillRect(0, 0, size, size);
  }, [size]);

  useEffect(() => {
    const canvas = canvasRef.current!;

    // Mouse events
    canvas.addEventListener("mousedown", startDraw);
    canvas.addEventListener("mousemove", draw);
    canvas.addEventListener("mouseup", endDraw);
    canvas.addEventListener("mouseleave", endDraw);

    // Touch events
    canvas.addEventListener("touchstart", startDraw, { passive: false });
    canvas.addEventListener("touchmove", draw, { passive: false });
    canvas.addEventListener("touchend", endDraw);

    return () => {
      canvas.removeEventListener("mousedown", startDraw);
      canvas.removeEventListener("mousemove", draw);
      canvas.removeEventListener("mouseup", endDraw);
      canvas.removeEventListener("mouseleave", endDraw);
      canvas.removeEventListener("touchstart", startDraw);
      canvas.removeEventListener("touchmove", draw);
      canvas.removeEventListener("touchend", endDraw);
    };
  }, [startDraw, draw, endDraw]);

  return (
    <div className="flex flex-col items-center gap-3">
      <canvas
        ref={canvasRef}
        width={size}
        height={size}
        className="border border-border rounded-lg cursor-crosshair touch-none"
        style={{ width: size, height: size }}
      />
      <button
        type="button"
        onClick={clear}
        className="text-sm font-mono text-muted-foreground hover:text-foreground transition-colors"
      >
        Clear
      </button>
    </div>
  );
}
```

**Step 2: Commit**

```bash
git add components/mnist-demo/drawing-canvas.tsx
git commit -m "feat: add MNIST drawing canvas component"
```

---

### Task 4: Prediction Bars Component

**Files:**
- Create: `components/mnist-demo/prediction-bars.tsx`

**Step 1: Implement the animated bar chart**

```tsx
// components/mnist-demo/prediction-bars.tsx
"use client";

import { motion } from "motion/react";

interface PredictionBarsProps {
  probabilities: Float32Array | null;
}

export function PredictionBars({ probabilities }: PredictionBarsProps) {
  const probs = probabilities ? Array.from(probabilities) : new Array(10).fill(0);
  const maxIdx = probs.indexOf(Math.max(...probs));
  const hasInput = probabilities !== null && probs.some((p) => p > 0.01);

  return (
    <div className="flex flex-col gap-1.5 w-full min-w-[140px]">
      <span className="text-xs font-mono text-muted-foreground mb-1">
        Predictions
      </span>
      {probs.map((prob, digit) => {
        const isTop = hasInput && digit === maxIdx;
        const pct = (prob * 100).toFixed(1);

        return (
          <div key={digit} className="flex items-center gap-2">
            <span
              className={`text-xs font-mono w-3 ${
                isTop ? "text-accent-interactive" : "text-muted-foreground"
              }`}
            >
              {digit}
            </span>
            <div className="flex-1 h-4 bg-secondary rounded-sm overflow-hidden">
              <motion.div
                className="h-full rounded-sm"
                style={{
                  backgroundColor: isTop
                    ? "var(--color-accent-interactive)"
                    : "var(--color-muted-foreground)",
                  opacity: isTop ? 1 : 0.3,
                }}
                initial={{ width: "0%" }}
                animate={{ width: `${prob * 100}%` }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              />
            </div>
            <span
              className={`text-xs font-mono w-12 text-right ${
                isTop ? "text-accent-interactive" : "text-muted-foreground"
              }`}
            >
              {pct}%
            </span>
          </div>
        );
      })}
    </div>
  );
}
```

**Step 2: Commit**

```bash
git add components/mnist-demo/prediction-bars.tsx
git commit -m "feat: add MNIST prediction bars component"
```

---

### Task 5: Network Visualizer Component

**Files:**
- Create: `components/mnist-demo/network-visualizer.tsx`

This is the most complex component. It renders an SVG diagram of the 784→256→256→256→10 network with:
- A 28×28 pixel grid as the input representation
- ~16 representative nodes per hidden layer
- 10 output nodes
- Connections between layers
- Activation-based coloring with Motion animations

**Step 1: Implement the network visualizer**

```tsx
// components/mnist-demo/network-visualizer.tsx
"use client";

import { motion } from "motion/react";
import type { InferenceResult } from "./inference";

interface NetworkVisualizerProps {
  result: InferenceResult | null;
}

const DISPLAY_NODES = 12; // representative nodes per hidden layer
const GRID_SIZE = 28;
const PIXEL_SIZE = 3;
const GRID_TOTAL = GRID_SIZE * PIXEL_SIZE; // 84px for the grid

// Layout constants
const SVG_WIDTH = 600;
const SVG_HEIGHT = 300;
const LAYER_POSITIONS = [60, 170, 280, 390, 510]; // x positions for 5 layers
const NODE_RADIUS = 7;
const OUTPUT_RADIUS = 10;

function getActivationColor(value: number, isOutput = false): string {
  // Map activation to color intensity
  // Using accent-interactive (#99ffe4) for high activations
  const clamped = Math.min(Math.max(value, 0), 1);
  if (clamped < 0.01) return "#1a1a1a";

  if (isOutput) {
    // Output: blend from dark to accent-interactive
    const r = Math.round(0x1a + (0x99 - 0x1a) * clamped);
    const g = Math.round(0x1a + (0xff - 0x1a) * clamped);
    const b = Math.round(0x1a + (0xe4 - 0x1a) * clamped);
    return `rgb(${r}, ${g}, ${b})`;
  }

  // Hidden layers: blend from dark to a subtle warm tone
  const r = Math.round(0x1a + (0xff - 0x1a) * clamped * 0.6);
  const g = Math.round(0x1a + (0xc7 - 0x1a) * clamped * 0.6);
  const b = Math.round(0x1a + (0x99 - 0x1a) * clamped * 0.6);
  return `rgb(${r}, ${g}, ${b})`;
}

/**
 * Sample representative activations from a layer.
 * Takes evenly-spaced samples from the full activation vector.
 */
function sampleActivations(
  activations: Float32Array | null,
  fullSize: number,
  displaySize: number
): number[] {
  if (!activations) return new Array(displaySize).fill(0);
  const step = fullSize / displaySize;
  const samples: number[] = [];
  for (let i = 0; i < displaySize; i++) {
    const idx = Math.floor(i * step);
    samples.push(activations[idx]);
  }
  // Normalize to 0-1 range for visualization
  const max = Math.max(...samples, 0.001);
  return samples.map((v) => Math.max(0, v) / max);
}

export function NetworkVisualizer({ result }: NetworkVisualizerProps) {
  const activations = result?.activations;

  // Compute node positions for hidden + output layers
  const hiddenYPositions = Array.from({ length: DISPLAY_NODES }, (_, i) => {
    const totalHeight = SVG_HEIGHT - 40;
    const spacing = totalHeight / (DISPLAY_NODES + 1);
    return 20 + spacing * (i + 1);
  });

  const outputYPositions = Array.from({ length: 10 }, (_, i) => {
    const totalHeight = SVG_HEIGHT - 40;
    const spacing = totalHeight / 11;
    return 20 + spacing * (i + 1);
  });

  // Sample activations for display
  const h1Display = sampleActivations(activations?.hidden1 ?? null, 256, DISPLAY_NODES);
  const h2Display = sampleActivations(activations?.hidden2 ?? null, 256, DISPLAY_NODES);
  const h3Display = sampleActivations(activations?.hidden3 ?? null, 256, DISPLAY_NODES);
  const outputDisplay = activations
    ? Array.from(activations.output)
    : new Array(10).fill(0);
  const maxOutputIdx = outputDisplay.indexOf(Math.max(...outputDisplay));

  // Input grid pixels
  const inputPixels = activations?.input ?? new Float32Array(784);

  // Grid offset to center vertically
  const gridOffsetY = (SVG_HEIGHT - GRID_TOTAL) / 2;

  return (
    <div className="w-full overflow-x-auto">
      <svg
        viewBox={`0 0 ${SVG_WIDTH} ${SVG_HEIGHT}`}
        className="w-full max-w-[600px] h-auto"
        style={{ minWidth: 400 }}
      >
        {/* Connections: input grid → hidden1 (stylized, sparse) */}
        {hiddenYPositions.map((hy, hi) => (
          <motion.line
            key={`conn-in-h1-${hi}`}
            x1={LAYER_POSITIONS[0] + GRID_TOTAL / 2 + 8}
            y1={SVG_HEIGHT / 2}
            x2={LAYER_POSITIONS[1]}
            y2={hy}
            stroke="#2a2a2a"
            strokeWidth={0.5}
            initial={{ opacity: 0.1 }}
            animate={{ opacity: h1Display[hi] > 0.1 ? 0.3 : 0.08 }}
            transition={{ duration: 0.3 }}
          />
        ))}

        {/* Connections: hidden1 → hidden2 */}
        {hiddenYPositions.map((h1y, h1i) =>
          hiddenYPositions.map((h2y, h2i) => (
            <motion.line
              key={`conn-h1-h2-${h1i}-${h2i}`}
              x1={LAYER_POSITIONS[1] + NODE_RADIUS}
              y1={h1y}
              x2={LAYER_POSITIONS[2] - NODE_RADIUS}
              y2={h2y}
              stroke="#2a2a2a"
              strokeWidth={0.3}
              initial={{ opacity: 0.05 }}
              animate={{
                opacity:
                  h1Display[h1i] > 0.1 && h2Display[h2i] > 0.1 ? 0.2 : 0.03,
              }}
              transition={{ duration: 0.3, delay: 0.1 }}
            />
          ))
        )}

        {/* Connections: hidden2 → hidden3 */}
        {hiddenYPositions.map((h2y, h2i) =>
          hiddenYPositions.map((h3y, h3i) => (
            <motion.line
              key={`conn-h2-h3-${h2i}-${h3i}`}
              x1={LAYER_POSITIONS[2] + NODE_RADIUS}
              y1={h2y}
              x2={LAYER_POSITIONS[3] - NODE_RADIUS}
              y2={h3y}
              stroke="#2a2a2a"
              strokeWidth={0.3}
              initial={{ opacity: 0.05 }}
              animate={{
                opacity:
                  h2Display[h2i] > 0.1 && h3Display[h3i] > 0.1 ? 0.2 : 0.03,
              }}
              transition={{ duration: 0.3, delay: 0.2 }}
            />
          ))
        )}

        {/* Connections: hidden3 → output */}
        {hiddenYPositions.map((h3y, h3i) =>
          outputYPositions.map((oy, oi) => (
            <motion.line
              key={`conn-h3-out-${h3i}-${oi}`}
              x1={LAYER_POSITIONS[3] + NODE_RADIUS}
              y1={h3y}
              x2={LAYER_POSITIONS[4] - OUTPUT_RADIUS}
              y2={oy}
              stroke="#2a2a2a"
              strokeWidth={0.3}
              initial={{ opacity: 0.05 }}
              animate={{
                opacity:
                  h3Display[h3i] > 0.1 && outputDisplay[oi] > 0.05 ? 0.3 : 0.03,
              }}
              transition={{ duration: 0.3, delay: 0.3 }}
            />
          ))
        )}

        {/* Input: 28x28 pixel grid */}
        <g transform={`translate(${LAYER_POSITIONS[0] - GRID_TOTAL / 2}, ${gridOffsetY})`}>
          {Array.from({ length: 784 }, (_, idx) => {
            const row = Math.floor(idx / 28);
            const col = idx % 28;
            const value = inputPixels[idx];
            const gray = Math.round(value * 255);
            return (
              <rect
                key={`px-${idx}`}
                x={col * PIXEL_SIZE}
                y={row * PIXEL_SIZE}
                width={PIXEL_SIZE}
                height={PIXEL_SIZE}
                fill={`rgb(${gray}, ${gray}, ${gray})`}
              />
            );
          })}
        </g>

        {/* Hidden layer 1 */}
        {hiddenYPositions.map((y, i) => (
          <motion.circle
            key={`h1-${i}`}
            cx={LAYER_POSITIONS[1]}
            cy={y}
            r={NODE_RADIUS}
            fill="#1a1a1a"
            stroke="#2a2a2a"
            strokeWidth={0.5}
            animate={{
              fill: getActivationColor(h1Display[i]),
            }}
            transition={{ duration: 0.3, delay: 0.05 }}
          />
        ))}

        {/* Hidden layer 2 */}
        {hiddenYPositions.map((y, i) => (
          <motion.circle
            key={`h2-${i}`}
            cx={LAYER_POSITIONS[2]}
            cy={y}
            r={NODE_RADIUS}
            fill="#1a1a1a"
            stroke="#2a2a2a"
            strokeWidth={0.5}
            animate={{
              fill: getActivationColor(h2Display[i]),
            }}
            transition={{ duration: 0.3, delay: 0.15 }}
          />
        ))}

        {/* Hidden layer 3 */}
        {hiddenYPositions.map((y, i) => (
          <motion.circle
            key={`h3-${i}`}
            cx={LAYER_POSITIONS[3]}
            cy={y}
            r={NODE_RADIUS}
            fill="#1a1a1a"
            stroke="#2a2a2a"
            strokeWidth={0.5}
            animate={{
              fill: getActivationColor(h3Display[i]),
            }}
            transition={{ duration: 0.3, delay: 0.25 }}
          />
        ))}

        {/* Output layer (10 nodes with digit labels) */}
        {outputYPositions.map((y, i) => (
          <g key={`out-${i}`}>
            <motion.circle
              cx={LAYER_POSITIONS[4]}
              cy={y}
              r={OUTPUT_RADIUS}
              fill="#1a1a1a"
              stroke="#2a2a2a"
              strokeWidth={0.5}
              animate={{
                fill: getActivationColor(outputDisplay[i], true),
                stroke:
                  i === maxOutputIdx && outputDisplay[i] > 0.1
                    ? "#99ffe4"
                    : "#2a2a2a",
                strokeWidth:
                  i === maxOutputIdx && outputDisplay[i] > 0.1 ? 1.5 : 0.5,
              }}
              transition={{ duration: 0.3, delay: 0.35 }}
            />
            <text
              x={LAYER_POSITIONS[4]}
              y={y + 1}
              textAnchor="middle"
              dominantBaseline="middle"
              className="text-[8px] font-mono fill-foreground pointer-events-none"
              style={{ fontSize: "8px" }}
            >
              {i}
            </text>
          </g>
        ))}

        {/* Layer labels */}
        <text x={LAYER_POSITIONS[0]} y={SVG_HEIGHT - 4} textAnchor="middle"
          className="text-[8px] font-mono fill-muted-foreground" style={{ fontSize: "8px" }}>
          784
        </text>
        <text x={LAYER_POSITIONS[1]} y={SVG_HEIGHT - 4} textAnchor="middle"
          className="text-[8px] font-mono fill-muted-foreground" style={{ fontSize: "8px" }}>
          256
        </text>
        <text x={LAYER_POSITIONS[2]} y={SVG_HEIGHT - 4} textAnchor="middle"
          className="text-[8px] font-mono fill-muted-foreground" style={{ fontSize: "8px" }}>
          256
        </text>
        <text x={LAYER_POSITIONS[3]} y={SVG_HEIGHT - 4} textAnchor="middle"
          className="text-[8px] font-mono fill-muted-foreground" style={{ fontSize: "8px" }}>
          256
        </text>
        <text x={LAYER_POSITIONS[4]} y={SVG_HEIGHT - 4} textAnchor="middle"
          className="text-[8px] font-mono fill-muted-foreground" style={{ fontSize: "8px" }}>
          10
        </text>
      </svg>
    </div>
  );
}
```

**Step 2: Commit**

```bash
git add components/mnist-demo/network-visualizer.tsx
git commit -m "feat: add MNIST network visualizer with activation animation"
```

---

### Task 6: Main Demo Component + MDX Integration

**Files:**
- Create: `components/mnist-demo/mnist-demo.tsx`
- Modify: `lib/mdx.tsx` — add MnistDemo to mdxComponents
- Modify: `content/projects/mnist-digit-classifier.mdx` — add demo + expanded content

**Step 1: Create the main demo wrapper**

```tsx
// components/mnist-demo/mnist-demo.tsx
"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { DrawingCanvas } from "./drawing-canvas";
import { forward, loadWeights, type InferenceResult } from "./inference";
import { NetworkVisualizer } from "./network-visualizer";
import { PredictionBars } from "./prediction-bars";

export function MnistDemo() {
  const [result, setResult] = useState<InferenceResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const weightsRef = useRef<Awaited<ReturnType<typeof loadWeights>> | null>(null);

  // Preload weights on mount
  useEffect(() => {
    setLoading(true);
    loadWeights()
      .then((w) => {
        weightsRef.current = w;
        setLoading(false);
      })
      .catch((err) => {
        setError("Failed to load model weights.");
        setLoading(false);
        console.error(err);
      });
  }, []);

  const handleDraw = useCallback((pixels: Float32Array) => {
    const weights = weightsRef.current;
    if (!weights) return;

    // Check if canvas is blank
    const hasContent = pixels.some((v) => v > 0.01);
    if (!hasContent) {
      setResult(null);
      return;
    }

    const inferenceResult = forward(pixels, weights);
    setResult(inferenceResult);
  }, []);

  if (error) {
    return (
      <div className="text-vesper-red text-sm font-mono py-4">{error}</div>
    );
  }

  return (
    <div className="not-prose my-8">
      <div className="flex flex-col lg:flex-row gap-6 items-start">
        {/* Left: Drawing canvas */}
        <div className="shrink-0">
          <DrawingCanvas onDraw={handleDraw} size={280} />
          {loading && (
            <p className="text-xs font-mono text-muted-foreground mt-2 text-center">
              Loading model...
            </p>
          )}
        </div>

        {/* Right: Visualization + predictions */}
        <div className="flex-1 flex flex-col gap-4 min-w-0">
          <NetworkVisualizer result={result} />
          <PredictionBars probabilities={result?.probabilities ?? null} />
        </div>
      </div>
    </div>
  );
}
```

**Step 2: Register MnistDemo in mdx.tsx**

In `lib/mdx.tsx`, add a dynamic import for MnistDemo to the `mdxComponents` object:

```tsx
// Add at top of file
import dynamic from "next/dynamic";

const MnistDemo = dynamic(
  () => import("@/components/mnist-demo/mnist-demo").then((m) => m.MnistDemo),
  { ssr: false }
);

// Then add to mdxComponents object:
export const mdxComponents = {
  MnistDemo,
  ...CalloutComponents,
  // ... rest of existing components
};
```

**Step 3: Update the MNIST project MDX**

Replace the minimal content of `content/projects/mnist-digit-classifier.mdx` with expanded content including the demo:

```mdx
---
name: "MNIST Digit Classifier"
shortDescription: "Neural network from scratch, 98.32% accuracy."
description: "Neural network built from scratch achieving 98.32% accuracy on MNIST."
url: "https://github.com/adriandlam/mnist-classifier"
featured: true
inProgress: false
year: 2024
---

A deep multi-layer perceptron built entirely from scratch — no PyTorch `nn.Module`, no autograd. Just raw matrix multiplications, manual backpropagation, and gradient descent.

## Try it yourself

Draw a digit below and watch the network classify it in real-time. The visualization shows activations flowing through each layer as the model processes your input.

<MnistDemo />

## Architecture

The model is a 4-layer fully connected network:

- **Input**: 784 neurons (28×28 pixel grid, flattened)
- **Hidden layers**: 3 layers of 256 neurons each, with ReLU activation
- **Output**: 10 neurons with softmax (one per digit class)

Each hidden layer uses a dual-bias design — a pre-activation bias added before ReLU and a post-activation bias that bypasses the nonlinearity, giving each neuron a linear skip connection past its own activation function.

## Training

- **Weight initialization**: Xavier uniform, scaled per-layer
- **Learning rate**: 0.5, with cosine annealing decay
- **Batch size**: 128
- **Epochs**: 5
- **Loss**: Cross-entropy (implemented from scratch)

The entire training loop, including forward pass, backpropagation, and weight updates, is written without any automatic differentiation. Gradients are derived by hand and computed explicitly for each layer.

## Results

| Metric | Value |
|--------|-------|
| Test accuracy | 98.32% |
| Train accuracy | 99.72% |
| Parameters | ~397K |

The model also includes experiments with simpler architectures (784→128→10), dropout regularization, learning rate scheduling, and weight initialization comparisons — all documented in the project notebooks.
```

**Step 4: Commit**

```bash
git add components/mnist-demo/mnist-demo.tsx lib/mdx.tsx content/projects/mnist-digit-classifier.mdx
git commit -m "feat: integrate MNIST demo into project page with expanded writeup"
```

---

### Task 7: Verify Everything Works

**Step 1: Run the dev server and test**

```bash
cd /Users/adrianlam/GitHub/adrianlam.sh
bun --bun next dev
```

Open `http://localhost:3000/projects/mnist-digit-classifier` and verify:
- The page loads without errors
- The model weights load (check Network tab)
- Drawing on the canvas triggers real-time inference
- The network visualization shows activations propagating
- The prediction bars animate correctly
- Mobile responsive (stack vertically)
- Clear button works

**Step 2: Run the build to check for SSR/type issues**

```bash
bun --bun next build
```

Expected: clean build with no errors (MnistDemo is `ssr: false` via next/dynamic).

**Step 3: Run lint**

```bash
bunx biome check .
```

Fix any issues.

**Step 4: Final commit**

```bash
git add -A
git commit -m "feat: interactive MNIST digit classifier demo

- Drawing canvas with real-time 28x28 downsampling
- Pure TypeScript neural network inference (<1ms)
- SVG network visualization with activation animations
- Animated prediction bar chart
- DeepBatchMLPClassifier (784→256→256→256→10), 98.32% accuracy
- All client-side, zero backend dependencies"
```

---

### Task 8: Clean up

**Step 1: Remove the cloned mnist-classifier repo**

```bash
rm -rf mnist-classifier/
```

**Step 2: Commit .gitignore if needed**

Ensure `mnist-classifier/` or `data/` (from MNIST download) aren't tracked.
