// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

contract Meteosc {

    struct File {
        string _fullName;
        string _name;
        string _firstMesure;
        string _lastMesure;
        string _data;
    }

    struct Station {
        File[] period;
    }

    //kathe name ASIGONIA_20221010 antistixoi se allo struct file
    mapping(string => mapping(string => File[])) public file;
    mapping(string => string[]) public info;
    string[] stationNames;

    constructor () {
        addFile("ASI_1", "ASI", "2022/11/10", "2022/12/10", "fisrt_data");
        addFile("ASI_1", "ASI", "2022/11/10", "2022/12/10", "second_data");
        addFile("ASI_1", "ASI", "2022/11/10", "2022/12/10", "third_data");
        addFile("ASI_2", "ASI", "2022/20/11", "2022/25/11", "first_data");
        addFile("ASI_2", "ASI", "2022/20/11", "2022/25/11", "second_data");
        addFile("ASI_3", "ASI", "2022/25/11", "2022/05/12", "first_data");
        addFile("ASI_4", "ASI", "2022/05/12", "2022/15/12", "first_data");
        addFile("ASI_5", "ASI", "2022/15/12", "2023/10/01", "first_data");
        addFile("MEN_1", "MEN", "2021/11/10", "2021/12/10", "fisrt_data");
        addFile("MEN_2", "MEN", "2021/12/10", "2021/14/10", "first_data");
        addFile("AXA_1", "AXA", "2021/12/10", "2021/14/10", "first_data");
        addFile("AXA_1", "AXA", "2021/12/10", "2021/14/10", "second_data");
        addFile("AXA_2", "AXA", "2021/14/10", "2022/14/01", "first_data");
        addFile("AXA_2", "AXA", "2021/14/10", "2022/14/01", "second_data");
        addFile("AXA_2", "AXA", "2021/14/10", "2022/14/01", "third_data");
    }

    function addFile(
        string memory fullName, 
        string memory name, 
        string memory data, 
        string memory firstMesure, 
        string memory lastMesure
    )public {
        File memory curfile;

        curfile._fullName = fullName;
        curfile._name = name;
        curfile._firstMesure = firstMesure;
        curfile._lastMesure = lastMesure;
        curfile._data = data;

        if (file[name][fullName].length == 0) {
            info[name].push(fullName);
        }

        if (name not in stationNames) {
            stationNames.push(name);
        }

        file[name][fullName].push(curfile);
    }

    function getFile(
        string memory name,
        string memory fullName
    )public view returns (File memory) {
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
    )public view returns (Station[] memory) {
        uint len = info[name].length;
        Station[] memory cur = new Station[](len);
        for (uint i=0; i<len; i++) {
            File[] memory curFile = getFileVertions(name, info[name][i]);

            cur[i].period = curFile;
        }
        return cur;
    }

    function getAllFiles(
    )public view returns (Station[] memory) {
        Station[] memory cur = new Station[](len);
        for (uint i=0; i<info.length; i++) {

        }
    }

}
