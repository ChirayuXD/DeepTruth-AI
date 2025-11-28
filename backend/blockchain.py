from web3 import Web3
import json
import os
from dotenv import load_dotenv

load_dotenv()

RPC_URL = os.getenv("RPC_URL")
PRIVATE_KEY = os.getenv("PRIVATE_KEY")
CONTRACT_ADDRESS = os.getenv("CONTRACT_ADDRESS")

web3 = Web3(Web3.HTTPProvider(RPC_URL))

with open("ContentAuthenticityABI.json", "r") as f:
    abi = json.load(f)

contract = web3.eth.contract(address=CONTRACT_ADDRESS, abi=abi)

def register_on_chain(content_hash, ipfs_hash, score, is_authentic):
    account = web3.eth.account.from_key(PRIVATE_KEY)
    nonce = web3.eth.get_transaction_count(account.address)

    tx = contract.functions.registerContent(
        Web3.to_bytes(hexstr=content_hash),
        ipfs_hash,
        int(score),
        bool(is_authentic)
    ).build_transaction({
        'from': account.address,
        'nonce': nonce,
        'gas': 300000,
        'gasPrice': web3.to_wei('20', 'gwei')
    })



    signed_tx = web3.eth.account.sign_transaction(tx, PRIVATE_KEY)
    tx_hash = web3.eth.send_raw_transaction(signed_tx.raw_transaction)

    return web3.to_hex(tx_hash)
