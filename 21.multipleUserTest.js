// import {Block, Transaction, Blockchain} from "./18.updatingBlockChain";

const {
  Block,
  Transaction,
  Blockchain,
} = require("./18.updatingBlockChain.js");
const EC = require("elliptic").ec;
var ec = new EC("secp256k1");

// Generate keys
const key1 = ec.genKeyPair();
const privateKey1 = key1.getPrivate("hex");
const walletNumber1 = key1.getPublic("hex");

const key2 = ec.genKeyPair();
const privateKey2 = key2.getPrivate("hex");
const walletNumber2 = key2.getPublic("hex");

const joscoin = new Blockchain();
const tx1 = new Transaction(walletNumber1, walletNumber2, 100);
tx1.signTransaction(key1);

joscoin.addTransaction(tx1);

joscoin.minePendingTransactions(walletNumber1);
console.log("wallet 1 = " + joscoin.getBalanceOfAddress(walletNumber1));
console.log("wallet 2 = " + joscoin.getBalanceOfAddress(walletNumber2));

joscoin.minePendingTransactions(walletNumber1);
console.log("wallet 1 = " + joscoin.getBalanceOfAddress(walletNumber1));
