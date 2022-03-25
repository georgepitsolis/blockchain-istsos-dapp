require('dotenv').config();

module.exports = {
	rpc: {
		host: process.env.SERVER_IP,
		port: process.env.LOCAL_NODE_PORT
	},
	networks: {
		development: {
			host: process.env.SERVER_IP,
			port: process.env.LOCAL_NODE_PORT,
			network_id: process.env.NETWORK_ID,
			from: process.env.LOCAL_NODE_ADDR,
			gas: process.env.GAS
		},
	},
	compilers: {
		solc: {
			version: "0.8.12"
		}
	}
}