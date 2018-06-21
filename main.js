/*
A BLOCKCHAIN is a continuously growing list of records, called blocks, which are linked and secured using cryptography.Each block typically contains a cryptographic hash of the previous block, a timestamp, and transaction data. By design, a blockchain is resistant to modification of the data.
*/


const SHA256 = require("crypto-js/sha256");

// ! Create a BLOCK with all the fields, and calculate the HASH based on the data passed.
class Block {
  constructor(index, timestamp, data, previousHash = "") {
    this.index = index;
    this.timestamp = timestamp;
    this.data = data;
    this.previousHash = previousHash;

    this.hash = this.calculateHash();

    this.nonce = 0; // nonse is a random number that CAN BE CHANGED in the Blockchain building process
  }

  calculateHash() {
    return SHA256(
      this.index +
        this.previousHash +
        this.timestamp +
        JSON.stringify(this.data) +
        this.nonce
    ).toString();
  }

  //! PROOF OF WORK method to avoid quick creation of blocks, usually adding zeros
  // more zeros more difficulty
  mineBlock(difficulty) {
    while (this.hash.substring(0, difficulty) !== Array(difficulty + 1).join("0")) {
      this.nonce++;
      this.hash = this.calculateHash();
    }
    console.log("Block minded: " + this.hash);
  }

}

// ! Create a BLOCKCHAIN to initialize the chain starting from GENESIS(first block) Block
class Blockchain {
  constructor() {
    this.chain = [this.createGenesisBlock()];
    this.difficulty = 4;
  }

  createGenesisBlock() {
    return new Block(0, "15/06/2018", "Genesis Block", "0");
  }

  getLatestBlock() {
    return this.chain[this.chain.length - 1];
  }

  addBlock(newBlock) {
    //! Get last hash from previous block
    newBlock.previousHash = this.getLatestBlock().hash;

    //! Create the new hash for this block, adding proof of work/mining
    newBlock.mineBlock(this.difficulty);

    //! Push Block to the chain
    this.chain.push(newBlock);
  }

  //! Check if chain is Valid, starting from 1 since 0 is the Genesis
  isChainvalid() {
    for (let i = 1; i < this.chain.length; i++) {
      const currentBlock = this.chain[i];
      const previousBlock = this.chain[i -1];

      if(currentBlock.hash !== currentBlock.calculateHash()) {
        return false;
      }

      if (currentBlock.previousHash !== previousBlock.hash) {
        return false;
      } 
    }
    return true;
  }

}

let testCoin = new Blockchain();
testCoin.addBlock(new Block(1, '19/06/2018', {amount: 7}));
testCoin.addBlock(new Block(2, '06/08/2018', {amount: 4}));

//! Test if the Blockchain is Valid ---> it should be TRUE
//console.log('is Blockchain valid? ' + testCoin.isChainvalid());

//! is Valid trying to change data (temper blockchain) ---> it should be FALSE
// testCoin.chain[1].data = {amount: 100}
// console.log("is Blockchain valid? " + testCoin.isChainvalid());

//! is Valid trying to recalculate the hash ---> it should be FALSE
// testCoin.chain[1].hash = testCoin.chain[1].calculateHash();
// console.log("is Blockchain valid? " + testCoin.isChainvalid());

//! Test the Blockchain and the linked hash, 
//! Test if the Blockchain with Proof of Work / Mining, adding zeros at the beginning
console.log(JSON.stringify(testCoin, null, 4)) // 4 spaces formatting

