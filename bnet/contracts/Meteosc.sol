// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

contract Meteosc {

    struct File {
        string _fullname;
        string _name;
        string _firstMesure;
        string _lastMesure;
        string _data;
    }

    //kathe name ASIGONIA_20221010 antistixoi se allo struct file
    mapping(string => File) public file; 

    event FileAccess(
        string _name,
        string _fullname,
        string _firstMesure,
        string _lastMesure,
        string _data
    );

    // new file simply name = [full name, first mesure, last mesure]
    // initial name = ASIGONIA
    // newFile = [ASIGONIA_20221010, 202202021030, 202210101030]
    function addFile(string memory fullName, string memory name, string memory data, 
            string memory firstMesure, string memory lastMesure) public {
        file[fullName]._fullname = fullName;
        file[fullName]._name = name;
        file[fullName]._firstMesure = firstMesure;
        file[fullName]._lastMesure = lastMesure;
        file[fullName]._data = data;
        emit FileAccess(name, fullName, firstMesure, lastMesure, data);
    }



    // function getFile(string memory selectedName) public view returns (string memory) { 
    //     return curFile[selectedName].name;
    // }

}
