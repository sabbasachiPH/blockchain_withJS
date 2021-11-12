const sha256 = require("crypto-js/sha256");

class Block {
  constructor(timestamp, transactions, previousHash = "") {
    this.timestamp = timestamp;
    this.transactions = transactions;
    this.previousHash = previousHash;
    this.hash = this.calculateHash();
    this.nonce = 0;
  }

  mineBlock(difficulty) {
    // console.log("Mining Started : " + this.hash);
    // console.log("Step 1 : " + this.hash.substring(0, difficulty));
    // console.log("Step 2 : " + Array(difficulty + 1).join("0"));
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
        JSON.stringify(this.transactions) +
        this.previousHash +
        this.nonce
    ).toString();
  }
}

class Transaction {
  constructor(fromAddress, toAddress, amount) {
    this.fromAddress = fromAddress;
    this.toAddress = toAddress;
    this.amount = amount;
  }
}

class Blockchain {
  constructor() {
    this.chain = [this.generateGenesisBlock()];
    this.difficulty = 2;
    this.pendingTransactions = [];
  }

  generateGenesisBlock() {
    return new Block("2021-11-12", "Genesis", "0000");
  }

  getLatestBlock() {
    return this.chain[this.chain.length - 1];
  }

  createTransaction(transaction) {
    this.pendingTransactions.push(transaction);
  }

  minePendingTransactions() {
    let block = new Block(new Date(), this.pendingTransactions);
    block.mineBlock(this.difficulty);
    this.chain.push(block);

    this.pendingTransactions = [];
  }
  /*we are adding block using the minePendingTransactions Function so addBlock is no necessary
  addBlock(newBlock) {
    console.log(this.difficulty);
    newBlock.previousHash = this.getLatestBlock().hash;
    // newBlock.hash = newBlock.calculateHash();
    newBlock.mineBlock(this.difficulty);
    this.chain.push(newBlock);
  }
*/
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

  /**Balance Calculation */
  getBalanceOfAddress(address) {
    let balance = 0;
    for (const block of this.chain) {
      for (const trans of block.transactions) {
        if (trans.fromAddress === address) {
          balance -= trans.amount;
        }
        if (trans.toAddress === address) {
          balance += trans.amount;
        }
      }
    }
    return balance;
  }
}

const joscoin = new Blockchain();

joscoin.createTransaction(new Transaction("address1", "address2", 100));
joscoin.createTransaction(new Transaction("address2", "address1", 5));
joscoin.createTransaction(new Transaction("address3", "address1", 45));

joscoin.minePendingTransactions();

console.log(joscoin);

console.log(
  "Balance of address 1 = " + joscoin.getBalanceOfAddress("address1")
);
console.log(
  "Balance of address 2 = " + joscoin.getBalanceOfAddress("address2")
);
console.log(
  "Balance of address 3 = " + joscoin.getBalanceOfAddress("address3")
);
