import hashlib

def compute_sha256(file_path):
    with open(file_path, "rb") as f:
        file_bytes = f.read()
        hash_hex = hashlib.sha256(file_bytes).hexdigest()
    return hash_hex
