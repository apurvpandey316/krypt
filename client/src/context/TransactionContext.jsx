import React, { useState, useEffect } from "react";
import { ethers } from "ethers";

import { contractABI, contractAddress } from "./../utils/constants";

export const TransactionContext = React.createContext();

const { ethereum } = window;

const getEthereumContract = () => {
  const provider = new ethers.providers.Web3Provider(ethereum);
  const signer = provider.getSigner();
  const transactionContract = new ethers.Contract(
    contractAddress,
    contractABI,
    signer
  );
  // console.log(transactionContract);
  return transactionContract;
};

export const TransactionProvider = ({ children }) => {
  const [currentAccount, setCurrentAccount] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [transactions, setTransactions] = useState([]);
  const [transactionCount, setTransactionCount] = useState(
    localStorage.getItem("transactionCount")
  );
  const [formData, setFormData] = useState({
    addressTo: "",
    amount: "",
    keyword: "",
    message: "",
  });
  const handleChange = (e, name) => {
    setFormData((prev) => ({ ...prev, [name]: e.target.value }));
  };
  const getAllTransactions = async () => {
    try {
      if (!ethereum) return alert("Please install metamask");
      const transactionContract = getEthereumContract();
      const availabletransactions =
        await transactionContract.getAllTransactions();
      console.log(availabletransactions);
      const structuredTransactions = availabletransactions.map(
        (transaction, i) => ({
          index: i,
          addressTo: transaction.receiver,
          addressFrom: transaction.sender,
          message: transaction.message,
          keyword: transaction.keyword,
          timestamp: new Date(
            transaction.timestamp.toNumber() * 1000
          ).toLocaleString(),
          amount: parseInt(transaction.amount._hex) / 10 ** 18,
        })
      );
      setTransactions(structuredTransactions);
      console.log(structuredTransactions);
    } catch (error) {
      console.log(error);
    }
  };
  const checkIfWalletIsConnected = async () => {
    try {
      if (!ethereum) return alert("Please install metamask");
      const accounts = await ethereum.request({ method: "eth_accounts" });
      if (accounts.length) {
        setCurrentAccount(accounts[0]);
        getAllTransactions();
      } else {
        console.log("No Accounts Detected");
      }
      console.log(accounts);
    } catch (error) {
      console.log(error);
    }
  };
  const checkIfTransactionsExist = async () => {
    try {
      const transactionContract = getEthereumContract();
      const transactionsCount = await transactionContract.getTransactionCount();
      window.localStorage.setItem("transactionCount", transactionsCount);
    } catch (error) {
      console.log(error);
      throw new Error("No Ethereum Object found");
    }
  };
  const connectWallet = async () => {
    try {
      if (!ethereum) return alert("Please install metamask");
      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      });
      setCurrentAccount(accounts[0]);
    } catch (error) {
      console.log(error);
    }
  };
  const sendTransaction = async () => {
    try {
      if (!ethereum) return alert("Please install metamask");
      const { addressTo, amount, message, keyword } = formData;
      const transactionContract = getEthereumContract();
      const parsedAmount = ethers.utils.parseEther(amount);
      console.log(parsedAmount._hex);
      console.log(transactionContract);
      await ethereum.request({
        method: "eth_sendTransaction",
        params: [
          {
            from: currentAccount,
            to: addressTo,
            gas: "0x5208",
            value: parsedAmount._hex,
          },
        ],
      });
      const transactionHash = await transactionContract.addToBlockchain(
        addressTo,
        parsedAmount,
        message,
        keyword
      );
      setIsLoading(true);
      console.log(`Loading- ${transactionHash.hash}`);
      await transactionHash.wait();
      setIsLoading(false);
      console.log(`Success- ${transactionHash.hash}`);
      const transactionsCount = await transactionContract.getTransactionCount();
      setTransactionCount(transactionsCount.toNumber());
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    checkIfWalletIsConnected();
    checkIfTransactionsExist();
  }, []);

  return (
    <TransactionContext.Provider
      value={{
        connectWallet,
        currentAccount,
        sendTransaction,
        handleChange,
        formData,
        transactions,
        isLoading,
      }}
    >
      {children}
    </TransactionContext.Provider>
  );
};
