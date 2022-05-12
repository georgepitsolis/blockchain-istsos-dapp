// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

contract Meteosc {

    struct File {
        string _fullName;
        string _name;
        string _hash;
        string _firstMesure;
        string _lastMesure;
        address _address;
    }

    struct Days {
        string _fullName;
        File[] _days;
    }

    struct Global {
        string _name;
        Days[] _stations;
    }

    //kathe name ASIGONIA_20221010 antistixoi se allo struct file
    mapping(string => mapping(string => File[])) public file;
    mapping(string => string[]) public info;
    mapping(string => address) public station_address;
    string[] public stationNames;

    // constructor () {
    //     addFile("ASI_1", "ASI", "fisrt_hash", "2022/11/10", "2022/12/10");
    //     addFile("ASI_1", "ASI", "second_hash", "2022/11/10", "2022/12/10");
    //     addFile("ASI_1", "ASI", "third_hash", "2022/11/10", "2022/12/10");
    //     addFile("ASI_2", "ASI", "fisrt_hash", "2022/20/11", "2022/25/11");
    //     addFile("ASI_2", "ASI", "second_hash", "2022/20/11", "2022/25/11");
    //     addFile("ASI_3", "ASI", "fisrt_hash", "2022/25/11", "2022/05/12");
    //     addFile("ASI_4", "ASI", "fisrt_hash", "2022/05/12", "2022/15/12");
    //     addFile("ASI_5", "ASI", "fisrt_hash", "2022/15/12", "2023/10/01");
    //     addFile("MEN_1", "MEN", "fisrt_hash", "2021/11/10", "2021/12/10");
    //     addFile("MEN_2", "MEN", "fisrt_hash", "2021/12/10", "2021/14/10");
    //     addFile("AXA_1", "AXA", "fisrt_hash", "2021/12/10", "2021/14/10");
    //     addFile("AXA_1", "AXA", "second_hash", "2021/12/10", "2021/14/10");
    //     addFile("AXA_2", "AXA", "fisrt_hash", "2021/14/10", "2022/14/01");
    // }

    function addFile(
        string memory fullName, 
        string memory name, 
        string memory hashV, 
        string memory firstMesure, 
        string memory lastMesure
    )public {
        File memory curfile;

        if (verifyRegion(name)) {
            curfile._fullName = fullName;
            curfile._name = name;
            curfile._firstMesure = firstMesure;
            curfile._lastMesure = lastMesure;
            curfile._hash = hashV;
            curfile._address = msg.sender;
            station_address[name] = msg.sender;

            if (info[name].length == 0) {
                stationNames.push(name);
            }
            
            if (file[name][fullName].length == 0) {
                info[name].push(fullName);
            }

            file[name][fullName].push(curfile);   
        }
    }

    function getFile(
        string memory name,
        string memory fullName
    )public view returns (File memory) {
        if (file[name][fullName].length != 0) 
            return file[name][fullName][file[name][fullName].length - 1];
    }

    function getFileVertions(
        string memory name,
        string memory fullName
    )public view returns (File[] memory) {
        return file[name][fullName];
    }

    function getFileHistory(
        string memory name
    )public view returns (Days[] memory) {
        uint lenInfo = info[name].length;
        Days[] memory curD = new Days[](lenInfo);
        for (uint i=0; i<lenInfo; i++) {
            File[] memory curFile = getFileVertions(name, info[name][i]);
            curD[i]._days = curFile;
            curD[i]._fullName = info[name][i];
        }
        return curD;
    }

    function getAllFiles(
    )public view returns (Global[] memory) {
        uint lenSt = stationNames.length;
        Global[] memory curS = new Global[](lenSt);
        for (uint i=0; i<lenSt; i++) {
            Days[] memory curFile = getFileHistory(stationNames[i]);
            curS[i]._stations = curFile;
            curS[i]._name = stationNames[i];
        }
        return curS;
    }

    function verifyHash(
        string memory name,
        string memory fullName,
        string memory hashV
    )public view returns (bool) {
        File memory selectedFile = getFile(name, fullName);
        if (keccak256(abi.encodePacked(selectedFile._hash)) == keccak256(abi.encodePacked(hashV))) {
            return true;
        }else {
            return false;
        }
    }

    function verifyRegion(
        string memory name
    )public view returns (bool) {
        if (info[name].length != 0) {
            if (station_address[name] == msg.sender) {
                return true;
            }
            else {
                return false;
            }
        }else {
            return true;
        }        
    }

}
