#!/usr/bin/env python3
"""
Export CNN weights (with fused BatchNorm), curated sample images,
and confusion matrices for both MLP and CNN models.
"""

import json
import struct
import numpy as np
import torch
import torch.nn as nn
from torchvision import datasets, transforms


# ─── CNN Model Definition (matches the repo's CNN class) ─────────────────────

class CNN(nn.Module):
    def __init__(self):
        super().__init__()
        self.conv1 = nn.Conv2d(1, 32, 3)
        self.bn1 = nn.BatchNorm2d(32)
        self.conv2 = nn.Conv2d(32, 32, 3)
        self.bn2 = nn.BatchNorm2d(32)
        self.fc = nn.Linear(800, 10)
        self.dropout = nn.Dropout(0.25)
        self.pool = nn.MaxPool2d(2, 2)

    def forward(self, x):
        x = self.pool(torch.relu(self.bn1(self.conv1(x))))
        x = self.dropout(x)
        x = self.pool(torch.relu(self.bn2(self.conv2(x))))
        x = self.dropout(x)
        x = x.view(x.size(0), -1)
        x = self.fc(x)
        return x


# ─── MLP Model Definition (matches the DeepBatchMLPClassifier) ───────────────

class DeepBatchMLPClassifier:
    def __init__(self, input_dim=784, hidden_dims=[256, 256, 256], output_dim=10):
        self.dims = [input_dim] + hidden_dims + [output_dim]

    def load_weights(self, path):
        """Load weights from our binary export format."""
        with open(path, 'rb') as f:
            num_tensors = struct.unpack('<I', f.read(4))[0]
            tensors = []
            for _ in range(num_tensors):
                ndims = struct.unpack('<I', f.read(4))[0]
                shape = []
                for _ in range(ndims):
                    shape.append(struct.unpack('<I', f.read(4))[0])
                count = 1
                for d in shape:
                    count *= d
                data = np.frombuffer(f.read(count * 4), dtype=np.float32).copy()
                tensors.append(torch.tensor(data.reshape(shape)))

        self.W1, self.w1, self.b1 = tensors[0], tensors[1], tensors[2]
        self.W2, self.w2, self.b2 = tensors[3], tensors[4], tensors[5]
        self.W3, self.w3, self.b3 = tensors[6], tensors[7], tensors[8]
        self.W4, self.w4 = tensors[9], tensors[10]

    def predict(self, x):
        """Single sample inference. x is (784,) tensor."""
        # Layer 1
        h1 = self.W1 @ x + self.w1
        y1 = torch.relu(h1) + self.b1
        # Layer 2
        h2 = self.W2 @ y1 + self.w2
        y2 = torch.relu(h2) + self.b2
        # Layer 3
        h3 = self.W3 @ y2 + self.w3
        y3 = torch.relu(h3) + self.b3
        # Output
        h4 = self.W4 @ y3 + self.w4
        return h4  # raw logits


# ─── Fuse BatchNorm into Conv ─────────────────────────────────────────────────

def fuse_bn_into_conv(conv_weight, conv_bias, bn_weight, bn_bias, bn_mean, bn_var, eps=1e-5):
    """
    Fuse BatchNorm parameters into Conv weight and bias.
    Returns new_weight, new_bias that combine both operations.
    """
    # Scale factor per output channel
    scale = bn_weight / torch.sqrt(bn_var + eps)

    # New weight: multiply each output channel by its scale
    # conv_weight shape: (outC, inC, kH, kW)
    new_weight = conv_weight * scale.view(-1, 1, 1, 1)

    # New bias: (conv_bias - bn_mean) * scale + bn_bias
    new_bias = (conv_bias - bn_mean) * scale + bn_bias

    return new_weight, new_bias


# ─── Export weights as binary ─────────────────────────────────────────────────

def export_binary(tensors, path):
    """Export list of (name, numpy_array) tuples as binary."""
    with open(path, 'wb') as f:
        f.write(struct.pack('<I', len(tensors)))
        for name, tensor in tensors:
            flat = tensor.flatten().astype(np.float32)
            f.write(struct.pack('<I', len(tensor.shape)))
            for dim in tensor.shape:
                f.write(struct.pack('<I', dim))
            f.write(flat.tobytes())
            print(f'  {name}: shape={tensor.shape}, {flat.nbytes} bytes')


def main():
    # ─── Load CNN ─────────────────────────────────────────────────────────
    print("Loading CNN model...")
    cnn = CNN()
    cnn.load_state_dict(torch.load(
        'mnist-classifier/models/mnist_classifier_acc99.19.pt',
        map_location='cpu',
        weights_only=True
    ))
    cnn.eval()

    # ─── Fuse BN into Conv layers ────────────────────────────────────────
    print("\nFusing BatchNorm into Conv layers...")
    conv1_w, conv1_b = fuse_bn_into_conv(
        cnn.conv1.weight.data, cnn.conv1.bias.data,
        cnn.bn1.weight.data, cnn.bn1.bias.data,
        cnn.bn1.running_mean, cnn.bn1.running_var
    )
    conv2_w, conv2_b = fuse_bn_into_conv(
        cnn.conv2.weight.data, cnn.conv2.bias.data,
        cnn.bn2.weight.data, cnn.bn2.bias.data,
        cnn.bn2.running_mean, cnn.bn2.running_var
    )

    # ─── Export CNN weights (BN fused) ───────────────────────────────────
    print("\nExporting CNN weights...")
    cnn_tensors = [
        ('conv1_weight', conv1_w.numpy()),   # (32, 1, 3, 3)
        ('conv1_bias', conv1_b.numpy()),     # (32,)
        ('conv2_weight', conv2_w.numpy()),   # (32, 32, 3, 3)
        ('conv2_bias', conv2_b.numpy()),     # (32,)
        ('fc_weight', cnn.fc.weight.data.numpy()),  # (10, 800)
        ('fc_bias', cnn.fc.bias.data.numpy()),      # (10,)
    ]
    export_binary(cnn_tensors, 'public/models/mnist-cnn-weights.bin')
    total = sum(t[1].nbytes for t in cnn_tensors)
    print(f'Total CNN weights: {total:,} bytes')

    # ─── Load test data ──────────────────────────────────────────────────
    print("\nLoading MNIST test data...")
    transform_cnn = transforms.Compose([
        transforms.ToTensor(),
        transforms.Normalize((0.1307,), (0.3081,))
    ])
    transform_raw = transforms.ToTensor()

    testset_cnn = datasets.MNIST(root='./data', train=False, download=True, transform=transform_cnn)
    testset_raw = datasets.MNIST(root='./data', train=False, download=True, transform=transform_raw)

    # ─── Load MLP ────────────────────────────────────────────────────────
    print("Loading MLP model...")
    mlp = DeepBatchMLPClassifier()
    mlp.load_weights('public/models/mnist-mlp-weights.bin')

    # ─── Run both models on full test set ────────────────────────────────
    print("\nRunning inference on test set...")
    cnn_preds = []
    mlp_preds = []
    labels = []

    with torch.no_grad():
        for i in range(len(testset_cnn)):
            img_cnn, label = testset_cnn[i]
            img_raw, _ = testset_raw[i]

            # CNN prediction (needs normalized 1x1x28x28)
            cnn_out = cnn(img_cnn.unsqueeze(0))
            cnn_pred = cnn_out.argmax(dim=1).item()

            # MLP prediction (needs normalized flat 784)
            img_flat = img_raw.view(-1).float()
            img_norm = (img_flat - 0.1307) / 0.3081
            mlp_out = mlp.predict(img_norm)
            mlp_pred = mlp_out.argmax().item()

            cnn_preds.append(cnn_pred)
            mlp_preds.append(mlp_pred)
            labels.append(label)

            if (i + 1) % 2000 == 0:
                print(f'  {i+1}/10000')

    cnn_preds = np.array(cnn_preds)
    mlp_preds = np.array(mlp_preds)
    labels = np.array(labels)

    cnn_acc = (cnn_preds == labels).mean() * 100
    mlp_acc = (mlp_preds == labels).mean() * 100
    print(f'\nCNN accuracy: {cnn_acc:.2f}%')
    print(f'MLP accuracy: {mlp_acc:.2f}%')

    # ─── Confusion matrices ──────────────────────────────────────────────
    print("\nComputing confusion matrices...")
    cnn_cm = np.zeros((10, 10), dtype=int)
    mlp_cm = np.zeros((10, 10), dtype=int)
    for true, cp, mp in zip(labels, cnn_preds, mlp_preds):
        cnn_cm[true][cp] += 1
        mlp_cm[true][mp] += 1

    confusion_data = {
        'cnn': {
            'matrix': cnn_cm.tolist(),
            'accuracy': round(cnn_acc, 2)
        },
        'mlp': {
            'matrix': mlp_cm.tolist(),
            'accuracy': round(mlp_acc, 2)
        }
    }

    with open('public/models/mnist-confusion.json', 'w') as f:
        json.dump(confusion_data, f)
    print(f'Saved confusion matrices to public/models/mnist-confusion.json')

    # ─── Curate sample images ────────────────────────────────────────────
    print("\nCurating sample images...")
    samples = []

    # Strategy: pick interesting cases
    # 1. Cases where CNN is right but MLP is wrong
    # 2. Cases where both are wrong
    # 3. Cases where both are right (a few per digit)
    # 4. Ambiguous-looking digits

    cnn_right_mlp_wrong = []
    both_wrong = []
    both_right_per_digit = {d: [] for d in range(10)}

    for i in range(len(labels)):
        cnn_correct = cnn_preds[i] == labels[i]
        mlp_correct = mlp_preds[i] == labels[i]

        if cnn_correct and not mlp_correct:
            cnn_right_mlp_wrong.append(i)
        elif not cnn_correct and not mlp_correct:
            both_wrong.append(i)
        elif cnn_correct and mlp_correct:
            both_right_per_digit[labels[i]].append(i)

    # Pick samples
    selected = []

    # Up to 8 where CNN beats MLP
    np.random.seed(42)
    if cnn_right_mlp_wrong:
        chosen = np.random.choice(cnn_right_mlp_wrong,
                                  min(8, len(cnn_right_mlp_wrong)), replace=False)
        selected.extend(chosen)

    # Up to 4 where both are wrong
    if both_wrong:
        chosen = np.random.choice(both_wrong,
                                  min(4, len(both_wrong)), replace=False)
        selected.extend(chosen)

    # 1-2 per digit where both are correct (fill up to ~25 total)
    remaining = 25 - len(selected)
    per_digit = max(1, remaining // 10)
    for d in range(10):
        if both_right_per_digit[d]:
            chosen = np.random.choice(both_right_per_digit[d],
                                      min(per_digit, len(both_right_per_digit[d])),
                                      replace=False)
            selected.extend(chosen)

    selected = selected[:30]  # cap at 30

    # Export selected samples
    for idx in selected:
        img_raw, label = testset_raw[int(idx)]
        pixels = img_raw.squeeze().numpy().flatten().tolist()
        # Quantize to uint8 to save space
        pixels_uint8 = [int(round(p * 255)) for p in pixels]

        samples.append({
            'pixels': pixels_uint8,
            'label': int(label),
            'cnn_pred': int(cnn_preds[idx]),
            'mlp_pred': int(mlp_preds[idx]),
        })

    sample_data = {
        'samples': samples,
        'cnn_accuracy': round(cnn_acc, 2),
        'mlp_accuracy': round(mlp_acc, 2),
    }

    with open('public/models/mnist-samples.json', 'w') as f:
        json.dump(sample_data, f)
    print(f'Saved {len(samples)} curated samples to public/models/mnist-samples.json')

    # ─── Summary ─────────────────────────────────────────────────────────
    print(f'\n=== Summary ===')
    print(f'CNN: {cnn_acc:.2f}% ({int(cnn_acc * 100)} / 10000)')
    print(f'MLP: {mlp_acc:.2f}% ({int(mlp_acc * 100)} / 10000)')
    print(f'CNN beats MLP on {len(cnn_right_mlp_wrong)} samples')
    print(f'Both wrong on {len(both_wrong)} samples')
    print(f'Exported {len(samples)} curated samples')
    print(f'Files:')
    print(f'  public/models/mnist-cnn-weights.bin')
    print(f'  public/models/mnist-confusion.json')
    print(f'  public/models/mnist-samples.json')


if __name__ == '__main__':
    main()
