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

    //kathe name ASIGONIA_20221010 antistixoi se allo struct file
    mapping(string => File[]) public file; 

    constructor () public {
        addFile("ASIGONIA_1", "ASIGONIA", "2022/11/10", "2022/12/10", "fisrt_data");
        addFile("MENIDI_1", "MENIDI", "2021/11/10", "2021/12/10", "fisrt_data");
        addFile("ASIGONIA_1", "ASIGONIA", "2022/11/10", "2022/12/10", "second_data");
        addFile("ASIGONIA_1", "ASIGONIA", "2022/20/10", "2022/12/10", "third_data");
        addFile("MENIDI_2", "MENIDI", "2021/13/10", "2021/14/10", "first_data");
    }

    // new file simply name = [full name, first mesure, last mesure]
    // initial name = ASIGONIA
    // newFile = [ASIGONIA_20221010, 202202021030, 202210101030]
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

        file[fullName].push(curfile);
    }

    function getFile(
        string memory fullName
    )public view returns (string memory, string memory, string memory, string memory, string memory) {
        File memory cur = file[fullName][file[fullName].length - 1];
        return (cur._fullName, cur._name, cur._data, cur._firstMesure, cur._lastMesure);
    }

    function getFileHistory(
        string memory fullName
    )public view returns (File[] memory) {

        return file[fullName];
    }

}
