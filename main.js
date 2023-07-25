const ethers = require('ethers');
const fs = require('fs');
const provider = new ethers.providers.JsonRpcProvider('https://zksync-era.rpc.thirdweb.com');
const wallet = new ethers.Wallet("private_key",provider);

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

async function eralend_borrow() {
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
                console.log("\x1b[33m[%s | %s] [RETRY] Error ..\x1b[0m", new Date().toLocaleString(), shortAddress);
            }
        }
    }
}

eralend_borrow();
