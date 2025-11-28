import torch
from transformers import AutoImageProcessor, AutoModelForImageClassification
from PIL import Image

processor = AutoImageProcessor.from_pretrained("Hemg/Deepfake-Detection")
model = AutoModelForImageClassification.from_pretrained("Hemg/Deepfake-Detection")

def predict(image_path):
    image = Image.open(image_path).convert("RGB")
    inputs = processor(images=image, return_tensors="pt")

    with torch.no_grad():
        outputs = model(**inputs)

    logits = outputs.logits
    probs = torch.softmax(logits, dim=1)[0]

    # ---------------------------------------------------
    # Correct label mapping for this model:
    # index 0 → FAKE
    # index 1 → REAL
    # ---------------------------------------------------
    fake_prob = float(probs[0]) * 100
    real_prob = float(probs[1]) * 100

    # REAL should have high authenticity score
    authenticityScore = real_prob

    # True if REAL probability is higher
    isAuthentic = real_prob >= fake_prob

    return authenticityScore, isAuthentic
