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

def retrieve_measures(station, start, end, sensor):
    start = start + 'T00:00:00'
    end = end[:-2] + str(int(end[-2:]) + 1) + 'T00:00:00'
    url = service_url + cur_db + '?' \
        'procedure=' + station + '&' \
        'eventTime=' + start + '/' + end + '&' \
        'request=GetObservation&' \
        'offering=temporary&' \
        'observedProperty=' + sensor + '&' \
        'responseFormat=application/json&' \
        'service=SOS&' \
        'version=1.0.0'
    # request = requests.get(url)
    # ans = request.json()
    request = requests.get(url, headers={'content-type':'application/json'})
    ans = json.loads(request.text)
    try:
        ans["ExceptionReport"]
        return False, ans
    except KeyError:
        return True, ans

if (sys.argv[1] == 'stations'):
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
else:
    check_measures, full_measures = retrieve_measures(sys.argv[2], sys.argv[3], sys.argv[4], sys.argv[5])
    if (check_measures):
        geom = full_measures['ObservationCollection']['member'][0]['featureOfInterest']['geom']
        geom = geom.replace("'", '#')
        full_measures['ObservationCollection']['member'][0]['featureOfInterest']['geom'] = geom
        print(full_measures)