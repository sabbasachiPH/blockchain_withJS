const sha256 = require("crypto-js/sha256");

class Block {
  constructor(timestamp, data, previousHash = "") {
    this.timestamp = timestamp;
    this.data = data;
    this.previousHash = previousHash;
    this.hash = this.calculateHash();
    this.nonce = 0;
  }

  mineBlock(difficulty) {
    console.log("Mining Started : " + this.hash);
    console.log("Step 1 : " + this.hash.substring(0, difficulty));
    console.log("Step 2 : " + Array(difficulty + 1).join("0"));
    while (
      this.hash.substring(0, difficulty) !== Array(difficulty + 1).join("0")
    ) {
      this.nonce++;
      console.log(this.nonce++);
      this.hash = this.calculateHash();
    }
    console.log("Mining Done : " + this.hash);
  }

  calculateHash() {
    return sha256(
      this.timestamp +
        JSON.stringify(this.data) +
        this.previousHash +
        this.nonce
    ).toString();
  }
}

class Blockchain {
  constructor() {
    this.chain = [this.generateGenesisBlock()];
    this.difficulty = 2;
  }

  generateGenesisBlock() {
    return new Block("2021-11-12", "Genesis", "0000");
  }

  getLatestBlock() {
    return this.chain[this.chain.length - 1];
  }

  addBlock(newBlock) {
    console.log(this.difficulty);
    newBlock.previousHash = this.getLatestBlock().hash;
    // newBlock.hash = newBlock.calculateHash();
    newBlock.mineBlock(this.difficulty);
    this.chain.push(newBlock);
  }

  isBlockchainValid() {
    for (let i = 1; i < this.chain.length; i++) {
      const currentBlock = this.chain[i];
      const previousBlock = this.chain[i - 1];

      if (currentBlock.hash !== currentBlock.calculateHash()) {
        return false;
      }

      if (currentBlock.previousHash !== previousBlock.hash) {
        return false;
      }
    }
    return true;
  }
}

const joscoin = new Blockchain();
const block = new Block("2021-11-12", { amount: 5 });
joscoin.addBlock(block);
/********* Block chain validation chek ********/

// joscoin.addBlock(block);
// console.log(joscoin);
// console.log(joscoin.isBlockchainValid());

// joscoin.chain[0].data = "HACKDED";
// joscoin.chain[1].data = "HACKDED";
// console.log(joscoin.isBlockchainValid());
// console.log(joscoin);

/******** Mining Testing *******/
const block2 = new Block("2021-11-13", { amount: 15 });
joscoin.addBlock(block2);
const block3 = new Block("2021-11-14", { amount: 151 });
joscoin.addBlock(block3);
console.log(joscoin);
