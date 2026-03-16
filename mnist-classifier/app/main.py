from fastapi import FastAPI, File, UploadFile
import numpy as np
from PIL import Image
import io
import torch
import torch.nn as nn
import torch.nn.functional as F

app = FastAPI()


class CNN(nn.Module):
    def __init__(self):
        super().__init__()
        self.conv1 = nn.Conv2d(1, 32, 3)
        self.bn1 = nn.BatchNorm2d(32)
        self.pool1 = nn.MaxPool2d(2, 2)
        self.dropout1 = nn.Dropout(0.25)

        self.conv2 = nn.Conv2d(32, 32, 3)
        self.bn2 = nn.BatchNorm2d(32)
        self.pool2 = nn.MaxPool2d(2, 2)
        self.dropout2 = nn.Dropout(0.25)

        self.fc = nn.Linear(5 * 5 * 32, 10)

    def forward(self, x):
        x = self.pool1(nn.functional.relu(self.bn1(self.conv1(x))))
        x = self.dropout1(x)
        x = self.pool2(nn.functional.relu(self.bn2(self.conv2(x))))
        x = self.dropout2(x)

        x = torch.flatten(x, 1)
        x = self.fc(x)
        return x


model = CNN()
model_path = "../models/mnist_classifier_acc99.19.pt"
try:
    model.load_state_dict(torch.load(model_path, map_location=torch.device("cpu")))
except FileNotFoundError:
    raise FileNotFoundError(
        f"Model file not found at {model_path}. Please ensure the model file exists."
    )
except Exception as e:
    raise Exception(f"Error loading model: {str(e)}")
model.eval()


def preprocess_image(image_bytes: bytes) -> torch.Tensor:
    """Preprocess the input image for model prediction"""
    image = Image.open(io.BytesIO(image_bytes)).convert("L")

    image = image.resize((28, 28))

    image_array = np.array(image, dtype=np.float32)
    image_array = image_array / 255.0

    image_tensor = torch.from_numpy(image_array).unsqueeze(0).unsqueeze(0)

    return image_tensor


@app.post("/predict")
async def predict(file: UploadFile = File(...)):
    """
    Endpoint to predict digit from uploaded image
    """
    try:
        # Read image file
        contents = await file.read()

        # Preprocess image
        image_tensor = preprocess_image(contents)

        # Make prediction
        with torch.no_grad():
            output = model(image_tensor)
            predicted_digit = output.argmax(dim=1).item()

        # Get prediction probabilities
        probabilities = F.softmax(output, dim=1)[0]
        confidence = probabilities[predicted_digit].item()

        return {
            "predicted_digit": predicted_digit,
            "confidence": f"{confidence:.2%}",
            "probabilities": {
                str(i): f"{prob:.2%}" for i, prob in enumerate(probabilities.tolist())
            },
        }

    except Exception as e:
        return {"error": f"Error processing image: {str(e)}"}
