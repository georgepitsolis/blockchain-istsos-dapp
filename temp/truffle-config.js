module.exports = {
	rpc: {
		host: "127.0.0.1",
		port: 8501
	},
	networks: {
		development: {
			host: "127.0.0.1",     // Localhost
			port: 8501,            // Standard Ethereum port
			network_id: "1515",    // Any network
			from: "0xa6ab36c7A87E1a89E3f08245800e20538D236d78"
		}
	},
	// Set default mocha options here, use special reporters etc.
 	mocha: {
    	// timeout: 100000
  	},
  	// Configure your compilers
	compilers: {
		solc: {
			version: "0.8.12",    // Fetch exact version from solc-bin (default: truffle's version)
		}
	}
};
