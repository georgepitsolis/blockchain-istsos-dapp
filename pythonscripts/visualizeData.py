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
    url = service_url + cur_db + '?' \
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

def retrieve_datetime():
    url = service_url + cur_db + '?' \
        'request=GetObservation&' \
        'offering=temporary&' \
        'observedProperty=meteo&' \
        'responseFormat=application/json&' \
        'service=SOS&' \
        'version=1.0.0'
    r = requests.get(url)
    ans = r.json()

    try:
        ans["ExceptionReport"]
        return False, ans
    except KeyError:
        return True, ans

# If argv[1] is stations retrieve only the stations of the database
# if (sys.argv[1] == 'stations'):
#     check_station, answer = retrieve_stations()
#     if (check_station):
#         all_stations = []
#         stations = answer['Capabilities']['Contents']['ObservationOfferingList']['ObservationOffering']['sos:procedure']
#         for station in stations:
#             cur_station = station['@xlink:href'].split(':')[-1]
#             all_stations.append(cur_station)
#             print(cur_station)
#     else:
#         print(check_station)
# if (sys.argv[1] == 'station'):
check_datetime, answer = retrieve_datetime()
if (check_datetime):
    all_datetimes = []
    datetimes = answer['ObservationCollection']['member']
    for datetime in datetimes:
        name = datetime['name']
        beginPos = datetime['samplingTime']['beginPosition']
        endPos = datetime['samplingTime']['endPosition']
        components = datetime['observedProperty']['component'][1:]
        i = 0
        new_components = []
        for comp in components:
            new_components.append(components[i].split('meteo:')[1])
            i += 1
        
        all_datetimes.append([name, beginPos, endPos, new_components])
        # print([name, beginPos, endPos, new_components])
    print(all_datetimes)
    # else:
    #     print(check_datetime)