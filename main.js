const ethers = require('ethers');
const fs = require('fs');
const provider = new ethers.providers.JsonRpcProvider('https://zksync-era.rpc.thirdweb.com');
const private_keys = ['private_key1', 'private_key2', 'private_key3']; // add all your private keys here

const eralend_contractAddress = "0x1181D7BE04D80A8aE096641Ee1A87f7D557c6aeb";
const eralend_poolAbi = [
    {
      "constant": false,
      "inputs": [
        {
          "name": "borrowAmount",
          "type": "uint256"
        }
      ],
      "name": "borrow",
      "outputs": [
        {
          "name": "",
          "type": "uint256"
        }
      ],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "constant": false,
      "inputs": [],
      "name": "mint",
      "outputs": [
          {
              "name": "",
              "type": "uint256"
          }
      ],
      "payable": true,
      "stateMutability": "payable",
      "type": "function"
    },
    {
      "constant": false,
      "inputs": [
          {
              "name": "redeemAmount",
              "type": "uint256"
          }
      ],
      "name": "redeemUnderlying",
      "outputs": [
          {
              "name": "",
              "type": "uint256"
          }
      ],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function"
  },
  {
    "constant": true,
    "inputs": [
      {
        "name": "owner",
        "type": "address"
      }
    ],
    "name": "balanceOf",
    "outputs": [
      {
        "name": "",
        "type": "uint256"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  }
];

async function eralend_borrow(private_key) {
    const wallet = new ethers.Wallet(private_key, provider);
    const contract = new ethers.Contract(eralend_contractAddress, eralend_poolAbi, wallet);
    const balanceResult = await contract.balanceOf(wallet.address);
    const balance = ethers.BigNumber.from(balanceResult).mul(200000000);
    const GasPrice = await provider.getGasPrice();
    const min = 1400000;
    const max = 1500000;
  
    const randomNumber = Math.floor(Math.random() * (max - min + 1)) + min;
    const randomNumberString = randomNumber.toString();
  
    let response;
    let retries = 20;
    while(retries-- > 0){
        try{
            response = await contract.estimateGas.redeemUnderlying(
              balance,
              {
                  gasLimit: ethers.BigNumber.from(randomNumberString),
                  gasPrice: GasPrice,
              }
            );
  
            response = await contract.redeemUnderlying(
              balance,
              {
                  gasLimit: ethers.BigNumber.from(randomNumberString),
                  gasPrice: GasPrice,
              }
            );
            await response.wait();
            break;
        } catch(error){
            if(retries == 0) {
                return false;
            } else {
                console.log("\x1b[33m[%s | %s] [RETRY] Error ..\x1b[0m", new Date().toLocaleString());
            }
        }
    }
}

const delay = ms => new Promise(res => setTimeout(res, ms));

async function run() {
    for(let i=0; i<private_keys.length; i++){
      while (true) {
        try {
          await eralend_borrow(private_keys[i]);
        } catch(e) {
          console.error(e);
          await delay(5000); 
        }
      }
    }
  }
  
  run();
