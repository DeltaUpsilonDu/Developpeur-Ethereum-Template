async function main(){
	// With the HDWallet
	const Web3 = require('web3')
	//const rpcURL = "https://ropsten.infura.io/v3/5b50f5db4d6f414e8f44c9ac8333238f"
	//const web3 = new Web3(rpcURL)

	require('dotenv').config();
	const HDWalletProvider = require('@truffle/hdwallet-provider');

	provider = new HDWalletProvider(`${process.env.MNEMONIC}`, `https://ropsten.infura.io/v3/${process.env.INFURA_ID}`)
	web3 = new Web3(provider);

	const ABI = [
		{
			"inputs": [],
			"name": "get",
			"outputs": [
				{
					"internalType": "uint256",
					"name": "",
					"type": "uint256"
				}
			],
			"stateMutability": "view",
			"type": "function"
		},
		{
			"inputs": [
				{
					"internalType": "uint256",
					"name": "x",
					"type": "uint256"
				}
			],
			"name": "set",
			"outputs": [],
			"stateMutability": "nonpayable",
			"type": "function"
		}
	];

	const SSaddress = "0xCbd43b4CF42101693689a1f9C201471d8f505E8f";
	const simpleStorage = new web3.eth.Contract(ABI, SSaddress);

	simpleStorage.methods.get().call().then(console.log);

	await simpleStorage.methods.set(10).send({ from:'0x47f377690eFB070Ce9335EF62f54d5298DC053Ef' });

	simpleStorage.methods.get().call().then(console.log);

	//await Contract.methods.set(10).send({ from:'0x13bc18faeC7f39Fb5eE428545dBba611267AEAa4' });

	//Contract.methods.get().call().then(console.log);
	/*
	simpleStorage.methods.get().call((err, data) => {
	console.log(data);
	}); */
}
main();