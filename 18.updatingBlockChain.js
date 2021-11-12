const sha256 = require("crypto-js/sha256");
const EC = require("elliptic").ec;
var ec = new EC("secp256k1");

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
      //   console.log(this.nonce++);
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

  /**updating Block */
  hasValidTransactions() {
    for (const tx in this.transactions) {
      if (!tx.isValid()) {
        return false;
      }
    }
    return true;
  }
}

class Transaction {
  constructor(fromAddress, toAddress, amount) {
    this.fromAddress = fromAddress;
    this.toAddress = toAddress;
    this.amount = amount;
  }

  calculateHash() {
    return sha256(this.fromAddress + this.toAddress + this.amount).toString();
  }

  signTransaction(key) {
    if (key.getPublic("hex") !== this.fromAddress) {
      throw new Error("You do not have access");
    }

    const hashTx = this.calculateHash();
    const signature = key.sign(hashTx, "base64");
    this.signature = signature.toDER();
  }

  isValid() {
    if (this.fromAddress == null) true;

    if (!this.signature || this.signature.length == 0) {
      throw new Error("NO signature found");
    }

    const publicKey = ec.keyFromPublic(this.fromAddress, "hex");
    return publicKey.verify(this.calculateHash(), this.signature);
  }
}

class Blockchain {
  constructor() {
    this.chain = [this.generateGenesisBlock()];
    this.difficulty = 2;
    this.pendingTransactions = [];
    this.miningReward = 10;
  }

  generateGenesisBlock() {
    return new Block("2021-11-12", "Genesis", "0000");
  }

  getLatestBlock() {
    return this.chain[this.chain.length - 1];
  }

  addTransaction(transaction) {
    /**Updating Blockchain start */
    if (!transaction.fromAddress || !transaction.toAddress) {
      throw new Error("Information Missing can't process transaction");
    }
    if (!transaction.isValid()) {
      throw new Error("Invalid Transaction");
    }
    if (transaction.amount < 0) {
      throw new Error("Invalid Amount");
    }
    // let currentBalance = this.getBalanceOfAddress(transaction.fromAddress);
    // if (transaction.amount > currentBalance) {
    //   throw new Error("Not Enough Balance");
    // }
    /**Updating Blockchain end */
    this.pendingTransactions.push(transaction);
  }

  minePendingTransactions(minerAddress) {
    let block = new Block(new Date(), this.pendingTransactions);
    block.mineBlock(this.difficulty);
    this.chain.push(block);

    this.pendingTransactions = [
      new Transaction(null, minerAddress, this.miningReward),
    ];
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

      if (!currentBlock.hasValidTransactions()) {
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

module.exports = {
  Block,
  Transaction,
  Blockchain,
};
