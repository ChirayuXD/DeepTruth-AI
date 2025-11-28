# 🛡️ DeepTruth AI  
### *AI-Powered Deepfake Detection with Immutable Blockchain Verification*

---

## 📌 Overview

**DeepTruth AI** is an end-to-end system that detects deepfake images using a state-of-the-art Hugging Face model and secures the authenticity proof on the blockchain.  
It ensures that once an image is analyzed, its **IPFS hash**, **authenticity score**, and **verification metadata** are permanently stored and can be publicly validated.

This project bridges **AI**, **IPFS**, and **Web3** to provide a tamper-proof solution for content authenticity.

---

## 🚀 Features

### 🔍 Deepfake Detection (AI Model)
- Uses the **Hemg/Deepfake-Detection** model.
- Outputs:
  - `authenticityScore` (0–100 real probability)
  - `isAuthentic` (boolean)

### 🔗 Blockchain Verification (Ethereum Sepolia)
- Stores:
  - IPFS Hash  
  - Content SHA-256  
  - Authenticity Score  
  - isAuthentic  
  - Timestamp  
  - Verifier address  
- Public verification using `verifyContent(contentHash)`.

### 📦 IPFS Integration
- Uploads images to **local IPFS node** or Infura IPFS.
- Returns permanent CID.

### ⚙️ Backend API (Flask)
Provides `/analyze` endpoint that:
1. Accepts image upload  
2. Runs AI deepfake detection  
3. Uploads to IPFS  
4. Computes SHA-256  
5. Checks if the image exists on-chain  
6. Stores new verification  
7. Returns JSON

### 🌐 Frontend (React + Web3)
- UI for uploading images
- Displays:
  - AI result
  - IPFS link
  - Blockchain transaction hash
- Allows **re-verification** using content hash.

---

## 🧠 Architecture Diagram

```
       [ User Upload ]
              |
              v
      ┌──────────────────┐
      │     Frontend     │
      └──────────────────┘
              |
              v
      ┌──────────────────┐
      │      Flask       │
      │   (app.py)       │
      └──────────────────┘
 AI Model | IPFS | SHA256 | Web3
              |
              v
    ┌──────────────────────┐
    │  Smart Contract      │
    │ ContentAuthenticity  │
    └──────────────────────┘
              |
              v
        [ Verification ]
```

---

## 📁 Project Structure

```
DeepTruthAI/
│
├── backend/
│   ├── app.py
│   ├── blockchain.py
│   ├── model/
│   │   ├── detector.py
│   │   ├── compute_hash.py
│   │   └── ipfs_upload.py
│   ├── temp/
│   └── .env
│
├── contracts/
│   ├── ContentAuthenticity.sol
│   └── hardhat.config.js
│
├── frontend/
│   ├── src/
│   ├── package.json
│   └── tailwind.config.js
│
└── README.md
```

---

## 🔧 Backend Setup

### 1️⃣ Create & activate virtual environment
```bash
cd backend
python -m venv venv
venv\Scripts\activate
```

### 2️⃣ Install dependencies
```bash
pip install -r requirements.txt
```

### 3️⃣ Configure `.env`
```
RPC_URL=<Your_Sepolia_RPC>
PRIVATE_KEY=<Your_Private_Key>
CONTRACT_ADDRESS=<Deployed_Contract_Address>
IPFS_API=<IPFS gateway or local node>
```

### 4️⃣ Run Flask server
```bash
python app.py
```

---

## 🔨 Smart Contract

### Contract: `ContentAuthenticity.sol`

Supports:
- Registering new authenticity proofs
- Fetching previous verification
- Emitting blockchain events

### Compile & deploy
```bash
cd contracts
npx hardhat compile
npx hardhat run scripts/deploy.js --network sepolia
```

---

## 🧪 API Usage

### **POST /analyze**

Upload an image for deepfake detection + blockchain validation.

```bash
curl -X POST http://localhost:5000/analyze \
  -F "file=@sample.jpg"
```

### **Response Example**

```json
{
  "message": "Content analyzed successfully",
  "authenticityScore": 92.4,
  "isAuthentic": true,
  "ipfsHash": "QmXXX",
  "contentHash": "0xabc123...",
  "transactionHash": "0xdef456..."
}
```

---

## 🧑‍💻 Frontend Setup

### Install dependencies
```bash
cd frontend
npm install
```

### Start frontend
```bash
npm run dev
```

---

## 🔍 How Duplicate Verification Works

### ✔ When an image is uploaded:
- Backend computes SHA-256
- Calls `verifyContent(hash)`
- If the record exists → returns old result (no blockchain gas used)
- If not → performs detection + stores a new record

This prevents duplicate submissions and maintains integrity.

---

## 🎯 Future Improvements

- More advanced deepfake models (video-based)
- Multi-modal detection (metadata + pixels)
- Gasless meta-transactions via Biconomy
- User accounts + authentication
- Public image explorer UI
- IPFS pinning service integration

---

## 🤝 Contributors

| Member | Role | Contributions |
|--------|------|---------------|
| **Chirayu** | AI & Backend | detector.py, app.py, Flask pipeline |
| **Jayant** | Research | Model comparison & evaluation |
| **Kunal** | Frontend | React UI + Web3 integration |

---

## 📜 License

MIT License

---

## ⭐ Support

If this project helps you, please **star the repo**!
