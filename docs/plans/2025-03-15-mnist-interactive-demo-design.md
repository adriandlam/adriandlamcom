# MNIST Interactive Demo - Design Document

## Overview

An interactive component embedded in the MNIST project page where visitors draw a digit on a canvas and see:

1. A **28x28 pixel grid** updating in real-time as they draw
2. A **neural network visualization** showing activations flowing through the 784→256→256→256→10 Deep MLP
3. An **animated bar chart** showing confidence probabilities for all 10 digits

All inference runs client-side in pure JavaScript — no ONNX, no backend, zero new runtime dependencies.

## Model

**DeepBatchMLPClassifier** from the mnist-classifier repo:
- Architecture: 784 → 256 → 256 → 256 → 10
- Accuracy: 98.32% test
- Trained from scratch (no PyTorch nn.Module)
- Dual-bias per hidden layer: `w` (pre-activation) + `b` (post-activation, bypasses ReLU)
- Output layer: only `W4` + `w4` (no post-activation bias)
- Softmax with numerical stability (subtract max)

## Why Pure JS Instead of ONNX

- The model is ~397K float32 params = ~1.6MB raw weights
- Forward pass is just 3 matmuls + ReLUs + softmax (~330K multiply-adds)
- ONNX Runtime Web would add a 12MB WASM binary for this trivial computation
- Pure JS runs in <1ms, zero webpack config, zero SSR issues

## Architecture

```
MnistDemo (client component, dynamically imported)
├── DrawingCanvas        — 280×280 HTML canvas, freehand drawing
├── NetworkVisualizer    — SVG + Motion, 5-layer diagram with activations
├── PredictionBars       — Animated horizontal bar chart (10 digits)
└── inference.ts         — Pure TS forward pass + weight loading
```

## Component Details

### DrawingCanvas
- 280×280 HTML `<canvas>` (10x scale of 28×28)
- White stroke on black background (MNIST convention)
- Brush size ~20px for natural digit proportions
- On stroke end: downscale to 28×28, normalize to [0,1] Float32Array, trigger inference
- Center-crop the drawn content to match MNIST preprocessing
- "Clear" button to reset

### NetworkVisualizer (SVG + Motion)
- 5 visual layers in an `<svg>`:
  - **Input**: 28×28 grid of `<rect>` elements colored by pixel intensity
  - **Hidden 1-3**: ~16 representative `<motion.circle>` nodes each (of 256 real), with "256" label
  - **Output**: 10 `<motion.circle>` nodes, digit labels inside
- Connections: `<motion.line>` between layers, opacity based on activation flow
- Animation: layer-by-layer propagation using Motion's `useAnimate` with stagger
- Node colors: dark → accent-interactive (#99ffe4) based on activation magnitude
- Reduced motion support via `prefers-reduced-motion`

### PredictionBars
- 10 horizontal bars (digits 0-9) with softmax probability percentages
- `motion.div` width transitions
- Top prediction highlighted with accent-interactive (#99ffe4)
- Updates on every inference

### inference.ts
- Loads weights from `public/models/mnist-mlp-weights.bin` (Float32Array binary)
- Implements matmul + ReLU + softmax in ~50 lines of TypeScript
- Returns both final probabilities AND intermediate activations for visualization
- Handles the dual-bias architecture: `y = relu(W @ x + w) + b`
- Weight file lazy-loaded on first interaction, cached by browser

## File Structure

```
components/
  mnist-demo/
    mnist-demo.tsx          — Main wrapper, orchestrates state
    drawing-canvas.tsx      — Canvas drawing logic
    network-visualizer.tsx  — SVG neural network diagram
    prediction-bars.tsx     — Confidence bar chart
    inference.ts            — Forward pass + weight loading
public/
  models/
    mnist-mlp-weights.bin   — Exported weights (~1.6MB, ~600KB gzipped)
scripts/
  export-mnist-weights.py  — One-time: re-trains MLP, exports weights to binary
```

## Integration

1. Register `MnistDemo` in `lib/mdx.tsx` → `mdxComponents` (dynamically imported)
2. Add `<MnistDemo />` to `content/projects/mnist-digit-classifier.mdx`
3. Also expand the MDX content with a proper project writeup

## Styling

- Vesper dark theme: #101010 background, #ffffff foreground
- Grid cells: grayscale matching pixel intensity
- Active neurons: #99ffe4 (accent-interactive)
- Prediction bars: #99ffe4 for top prediction, #2a2a2a for others
- Canvas border: #2a2a2a (border color)
- Responsive: stacks vertically on mobile, horizontal on desktop

## Performance

- Canvas: native API, no React re-renders during drawing
- Inference: <1ms, debounced ~15fps during active drawing
- Network viz: ~300 Motion elements (well within SVG limits)
- Weights: lazy-loaded, browser-cached
- Component: `next/dynamic` import, zero cost for other pages
