from flask import Flask, request, jsonify
import os

# Import modules
from model.detector import predict        # deepfake model predictor
from model.compute_hash import compute_sha256
from model.ipfs_upload import upload_to_ipfs
from blockchain import register_on_chain
from flask_cors import CORS

# Initialize Flask
app = Flask(__name__)
CORS(app)

# Folder for temp uploads
UPLOAD_FOLDER = "temp"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

# ------------------------------ #
#             ROUTES             #
# ------------------------------ #

@app.route("/", methods=["GET"])
def home():
    return "Deepfake Detection API is running!"


@app.route("/analyze", methods=["POST"])
def analyze():
    # Check file provided
    if "file" not in request.files:
        return jsonify({"error": "No file uploaded"}), 400

    file = request.files["file"]

    if file.filename == "":
        return jsonify({"error": "Empty filename"}), 400

    # Save file to temp/
    file_path = os.path.join(UPLOAD_FOLDER, file.filename)
    file.save(file_path)
    print("✔ File saved:", file_path)

    # 1️⃣ Deepfake detection
    authenticityScore, isAuthentic = predict(file_path)
    print("✔ Deepfake detection complete")
    print(" → authenticityScore:", authenticityScore)
    print(" → isAuthentic:", isAuthentic)

    # 2️⃣ Upload file to IPFS
    ipfs_hash = upload_to_ipfs(file_path)
    print("✔ Uploaded to IPFS:", ipfs_hash)

    # 3️⃣ Compute SHA-256 hash
    content_hash = compute_sha256(file_path)
    print("✔ SHA-256 hash computed:", content_hash)

    # 4️⃣ Log results on blockchain
    tx_hash = register_on_chain(
        content_hash=content_hash,
        ipfs_hash=ipfs_hash,
        score=authenticityScore,
        is_authentic=isAuthentic
    )
    print("✔ Stored on blockchain:", tx_hash)

    # Final JSON response
    return jsonify({
        "message": "Content analyzed successfully",
        "authenticityScore": float(authenticityScore),
        "isAuthentic": bool(isAuthentic),
        "ipfsHash": ipfs_hash,
        "contentHash": content_hash,
        "transactionHash": tx_hash
    })


# ------------------------------ #
#           MAIN ENTRY           #
# ------------------------------ #

if __name__ == "__main__":
    print("🚀 Starting Flask server...")
    app.run(host="0.0.0.0", port=5000, debug=True)
