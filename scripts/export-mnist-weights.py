"""
Export MNIST MLP weights for browser inference.

Re-trains the DeepBatchMLPClassifier (784 → 256 → 256 → 256 → 10) on MNIST
and exports weights as a binary Float32Array file.

Binary format:
  - Header: 1 uint32 (number of tensors = 11)
  - Per tensor: 1 uint32 (ndims), shape as uint32s, then flat float32 data
  - Tensor order: W1, w1, b1, W2, w2, b2, W3, w3, b3, W4, w4
"""

import struct
import numpy as np
import torch
from torchvision import datasets, transforms
from pathlib import Path


# ─── Model ────────────────────────────────────────────────────────────────────

class DeepBatchMLPClassifier:
    def __init__(self, lr, input_dim=784, hidden_dims=[256, 256, 256], output_dim=10):
        self.lr = lr
        self.dims = [input_dim] + hidden_dims + [output_dim]

        x_min1 = -np.sqrt(6.0 / (self.dims[0] + self.dims[1]))
        x_max1 = np.sqrt(6.0 / (self.dims[0] + self.dims[1]))
        self.W1 = torch.tensor(np.random.uniform(x_min1, x_max1, (self.dims[1], self.dims[0])).astype(np.float32), requires_grad=True)
        self.w1 = torch.zeros(self.dims[1], requires_grad=True)
        self.b1 = torch.zeros(self.dims[1], requires_grad=True)

        x_min2 = -np.sqrt(6.0 / (self.dims[1] + self.dims[2]))
        x_max2 = np.sqrt(6.0 / (self.dims[1] + self.dims[2]))
        self.W2 = torch.tensor(np.random.uniform(x_min2, x_max2, (self.dims[2], self.dims[1])).astype(np.float32), requires_grad=True)
        self.w2 = torch.zeros(self.dims[2], requires_grad=True)
        self.b2 = torch.zeros(self.dims[2], requires_grad=True)

        x_min3 = -np.sqrt(6.0 / (self.dims[2] + self.dims[3]))
        x_max3 = np.sqrt(6.0 / (self.dims[2] + self.dims[3]))
        self.W3 = torch.tensor(np.random.uniform(x_min3, x_max3, (self.dims[3], self.dims[2])).astype(np.float32), requires_grad=True)
        self.w3 = torch.zeros(self.dims[3], requires_grad=True)
        self.b3 = torch.zeros(self.dims[3], requires_grad=True)

        x_min4 = -np.sqrt(6.0 / (self.dims[3] + self.dims[4]))
        x_max4 = np.sqrt(6.0 / (self.dims[3] + self.dims[4]))
        self.W4 = torch.tensor(np.random.uniform(x_min4, x_max4, (self.dims[4], self.dims[3])).astype(np.float32), requires_grad=True)
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


# ─── Loss ─────────────────────────────────────────────────────────────────────

def batch_cross_entropy(out, y):
    batch_size = len(y)
    y_ohe = torch.zeros_like(out)
    y_ohe[range(batch_size), y] = 1.0
    return float(-torch.sum(y_ohe * torch.log(out + 1e-10)) / batch_size)


# ─── Data ─────────────────────────────────────────────────────────────────────

def load_mnist():
    transform = transforms.Compose([
        transforms.ToTensor(),
        transforms.Normalize((0.1307,), (0.3081,))
    ])
    train_dataset = datasets.MNIST(root="./data", train=True, download=True, transform=transform)
    test_dataset = datasets.MNIST(root="./data", train=False, download=True, transform=transform)

    X_train = train_dataset.data.float().view(-1, 784) / 255.0
    X_train = (X_train - 0.1307) / 0.3081
    Y_train = train_dataset.targets

    X_test = test_dataset.data.float().view(-1, 784) / 255.0
    X_test = (X_test - 0.1307) / 0.3081
    Y_test = test_dataset.targets

    return X_train, Y_train, X_test, Y_test


# ─── Training ─────────────────────────────────────────────────────────────────

def train(model, X_train, Y_train, X_test, Y_test, num_epochs=5, batch_size=128):
    n_samples = len(Y_train)

    for epoch in range(num_epochs):
        # Shuffle
        perm = torch.randperm(n_samples)
        X_train = X_train[perm]
        Y_train = Y_train[perm]

        epoch_loss = 0.0
        n_batches = 0

        for i in range(0, n_samples, batch_size):
            X_batch = X_train[i : i + batch_size]
            Y_batch = Y_train[i : i + batch_size]

            out = model(X_batch)
            loss = batch_cross_entropy(out, Y_batch)
            model.backward(Y_batch)

            epoch_loss += loss
            n_batches += 1

        avg_loss = epoch_loss / n_batches
        lr = model.update_learning_rate(epoch + 1, num_epochs)

        # Evaluate on test set
        with torch.no_grad():
            test_out = model(X_test)
            preds = torch.argmax(test_out, dim=1)
            acc = (preds == Y_test).float().mean().item() * 100

        print(f"Epoch {epoch + 1}/{num_epochs} | Loss: {avg_loss:.4f} | Test Acc: {acc:.2f}% | LR: {lr:.6f}")

    return acc


# ─── Export ────────────────────────────────────────────────────────────────────

def export_weights(model, output_path):
    """
    Binary format:
      - 1 uint32: number of tensors (11)
      - Per tensor:
          - 1 uint32: ndims
          - ndims uint32s: shape
          - flat float32 data
    Tensor order: W1, w1, b1, W2, w2, b2, W3, w3, b3, W4, w4
    """
    tensors = [
        ("W1", model.W1), ("w1", model.w1), ("b1", model.b1),
        ("W2", model.W2), ("w2", model.w2), ("b2", model.b2),
        ("W3", model.W3), ("w3", model.w3), ("b3", model.b3),
        ("W4", model.W4), ("w4", model.w4),
    ]

    output_path = Path(output_path)
    output_path.parent.mkdir(parents=True, exist_ok=True)

    with open(output_path, "wb") as f:
        # Header: number of tensors
        f.write(struct.pack("<I", len(tensors)))

        for name, tensor in tensors:
            data = tensor.detach().float().numpy()
            shape = data.shape
            ndims = len(shape)

            # Write ndims
            f.write(struct.pack("<I", ndims))
            # Write shape
            for dim in shape:
                f.write(struct.pack("<I", dim))
            # Write flat float32 data
            f.write(data.astype(np.float32).tobytes())

            print(f"  {name:>3s}: shape={shape}, {data.size} floats, {data.size * 4} bytes")

    file_size = output_path.stat().st_size
    print(f"\nWrote {output_path} ({file_size:,} bytes, {file_size / 1024 / 1024:.2f} MB)")
    return file_size


# ─── Main ─────────────────────────────────────────────────────────────────────

if __name__ == "__main__":
    print("Loading MNIST...")
    X_train, Y_train, X_test, Y_test = load_mnist()
    print(f"Train: {X_train.shape}, Test: {X_test.shape}")

    print("\nInitializing model (784 → 256 → 256 → 256 → 10)...")
    model = DeepBatchMLPClassifier(lr=0.5)

    print("\nTraining for 5 epochs...")
    final_acc = train(model, X_train, Y_train, X_test, Y_test, num_epochs=5, batch_size=128)

    output_path = Path(__file__).resolve().parent.parent / "public" / "models" / "mnist-mlp-weights.bin"
    print(f"\nExporting weights to {output_path}...")
    file_size = export_weights(model, output_path)

    print(f"\nDone! Final test accuracy: {final_acc:.2f}%")
    if final_acc < 97.0:
        print("WARNING: Accuracy is below 97%. Consider re-running.")
