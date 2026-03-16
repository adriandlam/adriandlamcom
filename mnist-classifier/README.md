# MNIST Classifier

A Convolutional Neural Network (CNN) implementation for classifying handwritten digits using the MNIST dataset. The model achieves 99.31% accuracy using PyTorch.

## Project Structure

```
mnist-classifier/
│
├── data/
│   └── MNIST/           # MNIST dataset (not included in repo due to size)
│
├── notebooks/
│   └── mnist_classifier.ipynb  # Main implementation notebook
│
├── requirements.txt     # Project dependencies
└── README.md           # Project documentation
```

## Overview

This project implements a CNN classifier for the MNIST dataset using PyTorch. The model architecture consists of two convolutional layers followed by a fully connected layer, incorporating batch normalization and dropout for improved training stability and regularization.

### Model Architecture

- Input Layer: 28x28 grayscale images
- First Convolutional Block: 32 filters (3x3 kernel), batch normalization, ReLU, max pooling, dropout
- Second Convolutional Block: 32 filters (3x3 kernel), batch normalization, ReLU, max pooling, dropout
- Output Layer: Fully connected layer with 10 outputs (one per digit)

## Results

- Test Set Accuracy: 99.31%
- Test Set Loss: 0.0214
- Correct Predictions: 9,931/10,000

## Requirements

The project requires the following main dependencies:

- Python 3.8+
- PyTorch
- torchvision
- numpy

Install all dependencies using:

```bash
pip install -r requirements.txt
```

## Getting Started

1. Clone the repository:

```bash
git clone https://github.com/yourusername/mnist-classifier.git
cd mnist-classifier
```

2. Install dependencies:

```bash
pip install -r requirements.txt
```

3. The MNIST dataset will be automatically downloaded when running the notebook for the first time.

4. Open and run the Jupyter notebook:

```bash
jupyter notebook notebooks/mnist_classifier.ipynb
```

## Training

The model is trained for 45 epochs using:

- Adam optimizer
- Learning rate: 0.001
- Batch size: 128
- Dropout rate: 0.25

## License

[MIT License](LICENSE)

## Acknowledgments

- The MNIST dataset is maintained by Yann LeCun and Corinna Cortes. It is a subset of a larger dataset available from NIST.
- This implementation was developed as part of learning deep learning fundamentals.
