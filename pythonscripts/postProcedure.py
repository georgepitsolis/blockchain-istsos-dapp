# -*- coding: utf-8 -*-
import requests
import re
import json
from colorama import Fore, Style
import yaml

with open("../pythonscripts/external-data/units-cfg.yml", "r") as ymlfile:
    units = yaml.safe_load(ymlfile)

def rest_request(url, json_data):
    r = requests.post(url, data=json.dumps(json_data))
    if not r.json()['success']:
        print("Problem with ", json_data['system_id'])
        print(r.json())

def find_sensors(stInfo, path):
    file = open(stInfo["stationPath"], "r") 
    for line in file:
        sensors = line.split(',')
        break
    sen = []
    for sensor in sensors[1:]:
        sen.append(sensor[41:])
    file.close
    sen[-1] = sen[-1][:-1]

    # Sensors without counter numbers e.g soil:1:moist. => soil:moist.
    labels = []
    for x in sen:
        m = re.search(r"\d", x)
        if m: 
            if x[m.start()-1] != ':' and m.start()+1 < len(x): labels.append(x[:m.start()] + x[m.start()+1:])
            elif x[m.start()-1] != ':' and m.start()+1 >= len(x): labels.append(x[:m.start()])
            elif x[m.start()-1] == ':' and m.start()+1 < len(x): labels.append(x[:m.start()-1] + x[m.start()+1:])
            else: labels.append(x[:m.start()-1])
        else: labels.append(x)
    return sen, labels

def post_station(stInfo, service_url, cur_db, path):
    stationI = {
        "system_id":stInfo["stationName"],
        "system":stInfo["stationName"],
        "description":"weather station in " + stInfo["stationName"],
        "keywords": "weather, meteorological, meteo",
        "identification":[
            {
                "name":"uniqueID",
                "definition":"urn:ogc:def:identifier:OGC:uniqueID",
                "value":"urn:ogc:def:procedure:x-istsos:1.0:" + stInfo["stationName"]
            }
        ],
        "classification":[
            {
                "name":"System Type",
                "definition":"urn:ogc:def:classifier:x-istsos:1.0:systemType",
                "value":"insitu-fixed-point"
            },
            {
                "name":"Sensor Type",
                "definition":"urn:ogc:def:classifier:x-istsos:1.0:sensorType",
                "value":"Meteo weather station"
            }
        ],
        "characteristics":"",
        "contacts":[],
        "documentation":[],
        "capabilities":[],
        "location":{
            "type":"Feature",
            "geometry":{
                "type":"Point",
                "coordinates":[stInfo["Longtitude"],stInfo["Latitude"],stInfo["Altitude"]]
            },
            "crs":{
                "type":"name",
                "properties":{"name":"4326"}
            },
            "properties":{
                "name":stInfo["stationName"]
            }
        },
        "interfaces":"",
        "inputs":[],
        "history":[]
    }

    sensors, labels = find_sensors(stInfo, path)
    allSensors = [{
        "name":"Time",
        "definition":"urn:ogc:def:parameter:x-istsos:1.0:time:iso8601",
        "uom":"iso8601",
        "description":"",
        "constraint":{}
    }]
    for i, sens in enumerate(sensors):
        uom = units["meteo"][labels[i].replace(":","_")]
        if uom[0] == 'Β°C': uom[0] = '°C'

        sensor = {
            "name":sens,
            "definition":"urn:ogc:def:parameter:x-istsos:1.0:meteo:" + sens,
            "uom":uom[0],
            "description":""
        }

        if uom[1] == True:
            if uom[2] == True:
                sensor["constraint"] = {
                    "role":"urn:ogc:def:classifiers:x-istsos:1.0:qualityIndex:check:reasonable",
					"interval":[uom[3],uom[4]]
                }
            else:
                sensor["constraint"] = {
                    "role":"urn:ogc:def:classifiers:x-istsos:1.0:qualityIndex:check:reasonable",
					"min":uom[3]
                }
        else:
            if uom[2] == True:
                sensor["constraint"] = {
                    "role":"urn:ogc:def:classifiers:x-istsos:1.0:qualityIndex:check:reasonable",
					"max":uom[4]
                }
            else:
                sensor["constraint"] = {}

        allSensors.append(sensor)

    stationI["outputs"] = allSensors
    url = service_url + 'wa/istsos/services/' + cur_db + '/procedures'
    rest_request(url, stationI)




