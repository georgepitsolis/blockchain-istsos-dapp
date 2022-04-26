# -*- coding: utf-8 -*-
import requests
import xmltodict 
import json
import sys
import yaml

with open('../pythonscripts/external-data/config.yml', 'r') as file:
    data = yaml.safe_load(file)

service_url = data['istsos']['url']
cur_db = data['istsos']['db']

def retrieve_datetime():
    url = service_url + cur_db + '?' \
        'request=GetObservation&' \
        'offering=temporary&' \
        'observedProperty=meteo&' \
        'responseFormat=application/json&' \
        'service=SOS&' \
        'version=1.0.0'
    request = requests.get(url)
    ans = request.json()

    try:
        ans["ExceptionReport"]
        return False, ans
    except KeyError:
        return True, ans

check_datetime, answer = retrieve_datetime()
# print(answer)
# print("Hereeeee")
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