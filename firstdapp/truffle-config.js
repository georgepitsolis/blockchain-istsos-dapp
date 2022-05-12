module.exports = {
  rpc: {
    host: "127.0.0.1",
    port: 8501
	},
  networks: {
    development: {
      host: "127.0.0.1",     // Localhost (default: none)
      port: 8501,            // Standard Ethereum port (default: none)
      network_id: "1515"     // Any network (default: none)
    }
  },
  compilers: {
    solc: {
      version: "0.8.12",    // Fetch exact version from solc-bin (default: truffle's version)
      optimizer: {
        enabled: true,
        runs: 200
      }
    }
  }
};
