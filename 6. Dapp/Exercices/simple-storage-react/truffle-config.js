const path = require("path");

module.exports = {
  // See <http://truffleframework.com/docs/advanced/configuration>
  // to customize your Truffle configuration!
  contracts_build_directory: path.join(__dirname, "client/src/contracts"),
  networks: {
    development: {
      host: "127.0.0.1",     // Localhost (default: none)
      port: 8545,            // Standard Ethereum port (default: none)
      network_id: "*",       // Any network (default: none)
     },
    ropsten:{
      provider : function() {return new HDWalletProvider({mnemonic:{phrase:`${process.env.MNEMONIC}`},providerOrUrl:`https://ropsten.infura.io/v3/${process.env.INFURA_ID}`})},
      network_id:3,
    },
    kovan:{
      provider : function() {return new HDWalletProvider({mnemonic:{phrase:`${process.env.MNEMONIC}`},providerOrUrl:`https://kovan.infura.io/v3/${process.env.INFURA_ID}`})},
      network_id:42,
    },
    mumbai:{
      provider : function() {return new HDWalletProvider({mnemonic:{phrase:`${process.env.MNEMONIC}`},providerOrUrl:`https://polygon-mumbai.infura.io/v3/${process.env.INFURA_ID}`})},
      network_id:80001,
    },
    rinkeby:{
      provider : function() {return new HDWalletProvider({mnemonic:{phrase:`${process.env.MNEMONIC}`},providerOrUrl:`https://rinkeby.infura.io/v3/${process.env.INFURA_ID}`})},
      network_id:4,
    }
  }
};
