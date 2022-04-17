const Web3 = require('web3')
const rpcURL = "https://ropsten.infura.io/v3/5b50f5db4d6f414e8f44c9ac8333238f"
const web3 = new Web3(rpcURL)
 
web3.eth.getBalance("0x47f377690eFB070Ce9335EF62f54d5298DC053Ef", (err, wei) => { 
   balance = web3.utils.fromWei(wei, 'ether'); // convertir la valeur en ether
   console.log(balance);
});
