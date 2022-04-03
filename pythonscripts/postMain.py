# -*- coding: utf-8 -*-
import glob
import checkForStation
import convertData
import postData
import shutil
from colorama import Fore, Style
import yaml
import time

def postMain(primitiveD=None):
    start_time = time.time()

    with open("external_data/config.yml", "r") as ymlfile:
        cfg = yaml.safe_load(ymlfile)

    # For any changes you can go to config.yml
    url = cfg["istsos"]["url"]
    db = cfg["istsos"]["db"]

    unreadD = cfg["paths"]["unread"]
    readD = cfg["paths"]["read"]

    stations = cfg["meteo"]["stations"]

    if primitiveD == None:
        primitiveD = cfg["paths"]["primitive"]
        takePrimitiveD = primitiveD + "*.txt"
        convertData.convert_data_from_files(takePrimitiveD, unreadD, None)
    else: 
        convertData.convert_data_from_files(primitiveD, unreadD, True)

    csvData = glob.glob(unreadD + "*.txt")

    # Ready to input Station and Data to istSOS
    values = 0
    for file in csvData:
        stationName = file.split('\\')[1].split("_")[0]
        # Check for station existence in istSOS. 
        # If there is not any like station POST a new one
        print("\n--> Start " + stationName)
        if checkForStation.check_station_existence(file, url, db, stations, unreadD):
            insert, value = postData.post_data_on_station(url[:-1], db, unreadD[:-1], stationName)
            values += value
            if insert == True:
                shutil.move(file, readD + file.split('\\')[1])
        print("--> End " + stationName)

    print("\n--> Total time (sec): %s" % round(time.time() - start_time, 2))
    print("--> Total values:     %s" % values)

if __name__ == "__main__":
    postMain()