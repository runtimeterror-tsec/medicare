import datetime
import hashlib
import json
from flask import Flask, jsonify, request
import requests
from uuid import uuid4
from urllib.parse import urlparse

class Blockchain:
    
    grant = {}
    
    def __init__(self):
        self.chain = []
        self.transactions = []
        self.create_block(proof = 1, previous_hash = '0')
        self.nodes = set()
    
    def create_block(self, proof, previous_hash):
        block = {'index': len(self.chain) + 1,
                 'timestamp': str(datetime.datetime.now()),
                 'proof': proof,
                 'previous_hash': previous_hash,
                 'transactions': self.transactions}
        self.transactions = []
        self.chain.append(block)
        return block

    def get_previous_block(self):
        return self.chain[-1]

    def proof_of_work(self, previous_proof):
        new_proof = 1
        check_proof = False
        while check_proof is False:
            hash_operation = hashlib.sha256(str(new_proof**2 - previous_proof**2).encode()).hexdigest()
            if hash_operation[:4] == '0000':
                check_proof = True
            else:
                new_proof += 1
        return new_proof
    
    def hash(self, block):
        encoded_block = json.dumps(block, sort_keys = True).encode()
        return hashlib.sha256(encoded_block).hexdigest()
    
    def is_chain_valid(self, chain):
        previous_block = chain[0]
        block_index = 1
        while block_index < len(chain):
            block = chain[block_index]
            if block['previous_hash'] != self.hash(previous_block):
                return False
            previous_proof = previous_block['proof']
            proof = block['proof']
            hash_operation = hashlib.sha256(str(proof**2 - previous_proof**2).encode()).hexdigest()
            if hash_operation[:4] != '0000':
                return False
            previous_block = block
            block_index += 1
        return True
    
    def add_transaction(self, sender, version, data):
        self.transactions.append({'sender': sender,
                                  'version': version,
                                  'data': data})
        previous_block = self.get_previous_block()
        return previous_block['index'] + 1
    
    def add_node(self, address):
        parsed_url = urlparse(address)
        self.nodes.add(parsed_url.netloc)
    
    def replace_chain(self):
        network = self.nodes
        longest_chain = None
        max_length = len(self.chain)
        for node in network:
            response = requests.get(f'http://{node}/get_chain')
            if response.status_code == 200:
                length = response.json()['length']
                chain = response.json()['chain']
                if length > max_length and self.is_chain_valid(chain):
                    max_length = length
                    longest_chain = chain
        if longest_chain:
            self.chain = longest_chain
            return True
        return False
    
    def fetch(self, sender, doctor, version):
        #replace_chain()
        flag = 0
        if doctor in blockchain.grant[sender]:
            block_index = 1
            chain = blockchain.chain
            while block_index < len(chain):
                block = chain[block_index]
                #print(block)
                trans = block["transactions"]
                #print(trans)
                for t in trans:
                    if t['version']==version:
                        flag = 1
                        #print(t['data'])
                        return t['data']
                        break
                if flag == 1:
                    break
                
                block_index +=1
        else:
            return ""
		
    def fetchpatient(self, sender, version):
        #replace_chain()
        flag = 0
        if version>=1:
            block_index = 1
            chain = blockchain.chain
            while block_index <= len(chain):
                block = chain[block_index]
                #print(block)
                trans = block["transactions"]
                #print(trans)
                for t in trans:
                    if t['version']==version:
                        flag = 1
                        #print(t['data'])
                        return t['data']
                        break
                if flag == 1:
                    break
                
                block_index +=1
        else:
            return ""
        


app = Flask(__name__)

node_address = str(uuid4()).replace('-', '')

blockchain = Blockchain()

@app.route('/mine_block', methods = ['GET'])
def mine_block():
    previous_block = blockchain.get_previous_block()
    previous_proof = previous_block['proof']
    proof = blockchain.proof_of_work(previous_proof)
    previous_hash = blockchain.hash(previous_block)
    #blockchain.add_transaction(sender = node_address, receiver = 'Gautam', amount = 1)
    block = blockchain.create_block(proof, previous_hash)
    response = {'message': 'Congratulations, you just mined a block!',
                'index': block['index'],
                'timestamp': block['timestamp'],
                'proof': block['proof'],
                'previous_hash': block['previous_hash'],
                'transactions': block['transactions']}
    return jsonify(response), 200

@app.route('/get_chain', methods = ['GET'])
def get_chain():
    response = {'chain': blockchain.chain,
                'length': len(blockchain.chain)}
    return jsonify(response), 200

@app.route('/is_valid', methods = ['GET'])
def is_valid():
    is_valid = blockchain.is_chain_valid(blockchain.chain)
    if is_valid:
        response = {'message': 'All good. The Blockchain is valid.'}
    else:
        response = {'message': 'Houston, we have a problem. The Blockchain is not valid.'}
    return jsonify(response), 200

@app.route('/add_transaction', methods = ['POST'])
def add_transaction():
    json = request.get_json()
    transaction_keys = ['sender', 'data']
    if not all(key in json for key in transaction_keys):
        return 'Some elements of the transaction are missing', 400
    key = json['sender'] 
    print(list(blockchain.grant.keys()))
    if key in blockchain.grant.keys(): 
        blockchain.grant[key][0]+=1
        index = blockchain.add_transaction(json['sender'],blockchain.grant[key][0], json['data'])
    else:
        blockchain.grant[key]=[1]
        index = blockchain.add_transaction(json['sender'],blockchain.grant[key][0], json['data'])
        
    response = {'message': f'This transaction will be added to Block {index}'}
    return jsonify(response), 201


@app.route('/connect_node', methods = ['POST'])
def connect_node():
    json = request.get_json()
    nodes = json.get('nodes')
    if nodes is None:
        return "No node", 400
    for node in nodes:
        blockchain.add_node(node)
    response = {'message': 'All the nodes are now connected. The Medicare Blockchain now contains the following nodes:',
                'total_nodes': list(blockchain.nodes)}
    return jsonify(response), 201

@app.route('/replace_chain', methods = ['GET'])
def replace_chain():
    is_chain_replaced = blockchain.replace_chain()
    if is_chain_replaced:
        response = {'message': 'The nodes had different chains so the chain was replaced by the longest one.',
                    'new_chain': blockchain.chain}
    else:
        response = {'message': 'All good. The chain is the largest one.',
                    'actual_chain': blockchain.chain}
    return jsonify(response), 200

@app.route('/grant', methods = ['POST'])
def grant():
    json = request.get_json()
    sender = json['sender']
    doctor = json['doctor']
    if blockchain.grant[sender].append(doctor):
        response = {'message': f'Grant successfully processed'}
    else:
        response = {'message': f'Grant successfully processed'}
    print(blockchain.grant)
    
    return jsonify(response), 200

@app.route('/revoke', methods = ['POST'])
def revoke():
    json = request.get_json()
    sender = json['sender']
    doctor = json['doctor']
    if doctor in blockchain.grant[sender]:
        blockchain.grant[sender].remove(doctor)
    response = {'message': f'Grant successfully revoked'}
    print(blockchain.grant)
    return jsonify(response), 200

@app.route('/fetch', methods = ['POST'])
def fetch():
    json = request.get_json()
    sender = json['sender']
    doctor = json['doctor']
    version = blockchain.grant[sender][0]
    #print(version)
    data = blockchain.fetch(sender, doctor, version)
    if data =="":
        response = {'message': f'Check for Grant'}
    else:
        response = {'message': f'File fetched', 'fileUrl': data}
    return jsonify(response), 200

@app.route('/fetchpatient', methods = ['POST'])
def fetchpatient():
    json = request.get_json()
    sender = json['sender']
    #version = blockchain.grant[sender][0]
    version = blockchain.grant.get(sender)
    if version != None:
        data = blockchain.fetchpatient(sender, version[0])
    else:
        data=""
    
    if data =="":
        response = {'message': f'No file to fetch'}
    else:
        response = {'message': f'File fetched', 'fileUrl': data}
    print(data)
    return jsonify(response), 200

app.run(host = '0.0.0.0', port = 5001)
