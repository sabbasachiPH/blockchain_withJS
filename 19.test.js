// import {Block, Transaction, Blockchain} from "./18.updatingBlockChain";

const {
  Block,
  Transaction,
  Blockchain,
} = require("./18.updatingBlockChain.js");
const EC = require("elliptic").ec;
var ec = new EC("secp256k1");

// Generate keys
const key = ec.genKeyPair();

const privateKey = key.getPrivate("hex");
const walletNumber = key.getPublic("hex");

const joscoin = new Blockchain();
const tx1 = new Transaction(walletNumber, "randomAddress", 100);
tx1.signTransaction(key);

joscoin.addTransaction(tx1);

joscoin.minePendingTransactions(walletNumber);
console.log(joscoin.getBalanceOfAddress(walletNumber));

joscoin.minePendingTransactions(walletNumber);
console.log(joscoin.getBalanceOfAddress(walletNumber));
