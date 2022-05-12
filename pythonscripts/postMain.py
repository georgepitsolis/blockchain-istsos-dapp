# -*- coding: utf-8 -*-
import glob
import os
import sys
import checkForStation
import convertData
import postData
import shutil
import time
import yaml
from dotenv import load_dotenv
load_dotenv("../firstdapp/.env")

def postMain(uploadsD=None):
    with open('../pythonscripts/external-data/config.yml', 'r') as file:
        data = yaml.safe_load(file)

    # start_time = time.time()

    # For any changes you can go to config.yml
    url = data['istsos']['url']
    db = data['istsos']['db']

    unreadD = os.getenv("PATH_UNREAD")
    readD = os.getenv("PATH_READ")

    stations = os.getenv("METEO_STATIONS")

    if uploadsD == None:
        uploadsD = os.getenv("PATH_UPLOADS")
        takePrimitiveD = uploadsD + "*.txt"
        convertData.convert_data_from_files(takePrimitiveD, unreadD, None)
    else: 
        convertData.convert_data_from_files(uploadsD, unreadD, True)
    
    csvData = glob.glob(unreadD + "*.txt")

    # Ready to input Station and Data to istSOS
    values = 0
    for file in csvData:
        stationNameFull = file.split('/')[-1].split(".")[0]
        stationName = file.split('/')[-1].split("_")[0]
        # Check for station existence in istSOS. 
        # If there is not any like station POST a new one
        print(stationNameFull)
        if checkForStation.check_station_existence(file, url, db, stations, unreadD):
            insert, value = postData.post_data_on_station(url[:-1], db, unreadD[:-1], stationName)
            values += value
            shutil.move(file, readD + file.split('/')[-1])

    # print("Total time (sec): %s" % round(time.time() - start_time, 2))
    # print("Total values:     %s" % values)

if __name__ == "__main__":
    postMain()