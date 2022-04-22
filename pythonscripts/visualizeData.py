# -*- coding: utf-8 -*-
import requests
import xmltodict 
import json
import sys
import postProcedure
import yaml

with open('../pythonscripts/external-data/config.yml', 'r') as file:
    data = yaml.safe_load(file)

service_url = data['istsos']['url']
cur_db = data['istsos']['db']

# Checking if the station exist in istSOS database
def retrieve_stations():
    url = service_url + cur_db + '?'\
        'request=getCapabilities&' \
        'sections=contents&' \
        'service=SOS&' \
        'version=1.0.0'
    r = requests.get(url)
    answer = json.dumps(xmltodict.parse(r.text))
    ans = json.loads(answer)

    try:
        ans["ExceptionReport"]
        return False, ans
    except KeyError:
        return True, ans

# def retrieve_sensors(service_url, cur_db, station):
#     url = service_url + cur_db + '?'\
#         'request=getCapabilities&' \
#         'sections=contents&' \
#         'service=SOS&' \
#         'version=1.0.0'
#     r = requests.get(url)
#     answer = json.dumps(xmltodict.parse(r.text))
#     ans = json.loads(answer)

#     try:
#         ans["ExceptionReport"]
#         return False
#     except KeyError:
#         return True

# def find_station_info(staionN, stations_list):
#     file = open(stations_list, "r")
#     for line in file:
#         cur = line.split()
#         curSt = ''.join(cur[2:-4]).upper()
#         if staionN == curSt:
#             file.close()
#             return { "stationName":curSt, "LGCode":cur[1], "Longtitude":cur[-4], "Latitude":cur[-3], "Altitude":cur[-2] }
#     file.close()
#     return { "stationName":"notfound" }
            
# def check_station_existence(stationNamePath, service_url, cur_db, stations_list, unread_data):
#     stationName = stationNamePath.split('/')[-1].split("_")[0]
#     stationInfo = find_station_info(stationName, stations_list)
#     stationInfo["stationPath"] = stationNamePath
#     if stationInfo["stationName"] == "notfound":
#         print("error")
#         print("Insert procedure success: False")
#         print("There is no station " + stationName + " in Meteo's Records.")
#         return False
#     else: 
#         # Station information was found and a get request will follow.
#         stationAlreadyInBase = check_existence(stationInfo["stationName"], service_url, cur_db)
#         if not stationAlreadyInBase:
#             # Station not exist on istSOS. 
#             # Call postStation for adding it.
#             postProcedure.post_station(stationInfo, service_url, cur_db, unread_data)
#             print("Insert procedure success: True")
#         else: 
#             print("Procedure already exist on istSOS")
#         return True

# If argv[1] is stations retrieve only the stations of the database
if (sys.argv[1] == 'stations'):
    check_station, answer = retrieve_stations()
    if (check_station):
        all_stations = []
        stations = answer['Capabilities']['Contents']['ObservationOfferingList']['ObservationOffering']['sos:procedure']
        for station in stations:
            cur_station = station['@xlink:href'].split(':')[-1]
            all_stations.append(cur_station)
            print(cur_station)
    else:
        print(check_station)
else:
    print("second")