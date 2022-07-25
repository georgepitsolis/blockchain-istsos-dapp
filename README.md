# Blockchain implementation for data security using IstSOS and DApp

This project is a development of a model that guarantees the assurance of spatially referenced time series of metric data using decentralized application.

## Details

- Data are separated to txt files according to meteo stations and stations are organized to regions.
- The user can upload new metric primitive meteo data using the DApp. Data are uploaded both IstSOS platform and blockchain network simultaneously. To make it happen data are transformed according to SOS api standard and are posted to IstSOS platform with a post request. The same time, data are stored to a private Ethereum blockchain.
- Also, user is able to visualize data on graphs for specific station, datetime and sensor or can download these data to a JSON file format.
- Furthermore, user has access to blockchain history table for every single transaction ever happened on blockhain.
- Lastly, the user have the ability to verify his local data files with the original ones on blockchain network.

## Languages and Tools

- EJS/JavaScript
- Python (for converting txt primitive data files to JSON object)
- Solidity (for smart contract)

## Smart Contract

A smart contract need to be written for the blockchain to be operational. The smart contract organizes its contect in Files, Days and Global structs and matches every meteo uploaded file with a File struct by:
- fullname 
- name of station
- hash value of its data
- first and last measurement from this file and
- address of node of blockchain which make this transaction.

The smart contract also include function for input, output and verification:
- addFile: Add file to blockchain with the above specifications.
- getFile: Export the last valid file that the user has requested.
- getFileVertions: Export all the different vertions for a specific day of the file that the user has requested.
- getFileHistory: Export all the files for a specific station per day according to the user request.
- getAllFiles: Export the complet blockchain network with every file ever added.
- verifyHash: Verify if a file exist in blockchain network.
- verifyRegion: Verify that the region of the station of the uploading file matches the region tha the user is connected.

## Thesis Information

Implementation of a private permissioned blockchain for geospatial data.

- Diploma thesis by Pitsolis Giorgos
- Supervisor Prof. Vassilios Vescoukis

### Abstract 

The objective of this thesis is the development of a model that guarantees the assurance of spatially referenced time series of metric data using standard web services. This model foundations is the implementation of a blockchain network that cooperates with the standard service of istSOS platform, aiming optimal data management and maximum data security. This model was developed based on real data provided by the organization of the National Observatory of Athens using the technology of a private Ethereum blockchain. Initially, data were processed according to istSOS standard to ensure compatibility and identify and correct possible errors. Data uploading took place simultaneously at istSOS platform and the blockchain network. In parallel, a user-friendly decentralized web application was created to facilitate the smooth coexistence of both technologies. The decentralized application’s main features were the simultaneously data uploading at istSOS platform and blockchain network, certification of the user's files with authenticated network records, visualization of the blockchain network, measurements display in a graph with specific standards and finally the ability to download these observations in JSON format file. From the results, it is concluded that such a model will ensure data protection and can be used in a wide range of applications in the future.

## GUI

![dapp-login](https://user-images.githubusercontent.com/51331627/180774396-bf1965fc-36f2-4b04-be56-4a3af1cd9eb9.png)

![dapp-main](https://user-images.githubusercontent.com/51331627/180774639-1d272acc-a230-496e-a507-dbb8c316dc4d.png)

![dapp-add-results-2](https://user-images.githubusercontent.com/51331627/180774681-2e11cfd0-10bb-4541-ad8d-ca1552d20be4.png)

![dapp-chart](https://user-images.githubusercontent.com/51331627/180774715-1ed3af3d-52fd-4052-86a5-10133ffb1be4.png)

![dapp-timeline-verification-wrong](https://user-images.githubusercontent.com/51331627/180774741-4ba07f10-6347-4654-b2ea-258f4f0e6c4e.png)

![dapp-timeline-verification](https://user-images.githubusercontent.com/51331627/180774900-55533f41-b46f-4e28-8407-91f324de2b7a.png)
