# -*- coding: utf-8 -*-
import sys
import os
from os import path
import traceback
import json
import glob
from datetime import datetime
from datetime import timedelta
import copy
import urllib3
from colorama import Fore, Style
urllib3.disable_warnings()

sys.path.insert(0, path.abspath("."))
try:
    import argparse as argparse
    import requests
    from requests.auth import HTTPBasicAuth
    import isodate as iso
    from pytz import timezone
except ImportError as e:
    print(f"""{Fore.RED}
Error loading internal libs:
 >> did you run the script from the istSOS root folder?\n\n{Style.RESET_ALL}""")
    raise e

datacache = None
isourn = 'urn:ogc:def:parameter:x-istsos:1.0:time:iso8601'

def post_data_on_station(url, service, wd, proc, conf=None):

    def log(message):
        print(message)

    try:
        # Quality index
        quality = '100'

        # Offerings
        off = 'temporary'

        # File extension
        ext = '.txt'

        auth = None
        noqi = False  # False menas that quality index is also migrated
        maxobs = 5000
        req = requests

        # Load procedure description
        res = req.get("%s/wa/istsos/services/%s/procedures/%s" % (
            url, service,
            proc
            ), auth=auth, verify=False)

        data = res.json()

        if data['success'] is False:
            raise Exception(
                f"{Fore.RED}Description of procedure %s can not be loaded: %s{Style.RESET_ALL}" % (
                    proc, data['message']))

        data = data['data']
        aid = data['assignedSensorId']

        # Getting observed properties from describeSensor response
        op = []
        for out in data['outputs']:
            if not noqi or not ':qualityIndex' in out['definition']:
                op.append(out['definition'])

        # Load of a getobservation request
        res = req.get(
            "%s/wa/istsos/services/%s/operations/getobservation/"
            "offerings/%s/procedures/%s/observedproperties/%s/ev"
            "enttime/last" % (url, service, off, proc, ','.join(op)),
            auth=auth,
            verify=False)

        data = res.json()

        if data['success'] is False:
            raise Exception(
                f"{Fore.RED}Last observation of procedure %s can not be "
                f"loaded: %s{Style.RESET_ALL}" % (proc, data['message']))

        data = data['data'][0]
        data['AssignedSensorId'] = aid
        data['result']['DataArray']['values'] = []

        # Discover json observed property disposition
        jsonindex = {}
        for pos in range(0, len(data['result']['DataArray']['field'])):
            field = data['result']['DataArray']['field'][pos]
            if not noqi:
                jsonindex[field['definition']] = pos
            elif not ':qualityIndex' in field['definition']:
                jsonindex[field['definition']] = pos
            elif ':qualityIndex' in field['definition'] and noqi:
                data['result']['DataArray']['field'].pop(pos)

        files = glob.glob(os.path.join(wd, "%s_*%s" % (proc, ext)))
        files.sort()

        if len(files) > 0:
            for f in files:
                file = open(f, 'r')
                lines = file.readlines()
                obsindex = lines[0].strip(' \t\n\r').split(",")

                # Check if all the observedProperties of the procedure are
                # included in the CSV file (quality index is optional)
                for k, v in jsonindex.items():
                    if k in obsindex:
                        continue
                    elif ':qualityIndex' in k:
                        continue
                    else:
                        raise Exception(
                            f"{Fore.RED}Mandatory observed property %s is not present"
                            f" in the CSV.{Style.RESET_ALL}" % k)

                # Loop lines (skipping header)
                for i in range(1, len(lines)):
                    try:
                        line = lines[i]
                        lineArray = line.strip(' \t\n\r').split(",")

                        # Creating an empty array where the values will be inserted
                        observation = ['']*len(jsonindex)

                        for k, v in jsonindex.items():
                            val = None
                            if k in obsindex:
                                val = lineArray[obsindex.index(k)]
                            elif ':qualityIndex' in k:
                                # Quality index is not present in the CSV
                                # so the default value will be set
                                val = quality

                            observation[v] = val

                        # Attach to object
                        data['result']['DataArray']['values'].append(observation)

                    except Exception as e:
                        raise Exception(
                            f"{Fore.RED}Error in %s line: %s - %s\n%s{Style.RESET_ALL}" % (
                                f, i, lines[i], str(e)))

            dtstr = os.path.split(f)[1].replace("%s_" % proc, "").replace(ext, "")
            offset = False

            if '+' in dtstr:
                offset = dtstr[dtstr.index('+'):]
                offset = [offset[0:3], offset[3:5]]
                dtstr = dtstr[:dtstr.index('+')]
            elif '-' in dtstr:
                offset = dtstr[dtstr.index('-'):]
                offset = [offset[0:3], offset[3:5]]
                dtstr = dtstr[:dtstr.index('-')]

            ep = datetime.strptime(dtstr, "%Y%m%d%H%M%S%f").replace(tzinfo=timezone('UTC'))

            if offset:
                ep = ep - timedelta(hours=int(offset[0]), minutes=int(offset[1]))

            if len(data['result']['DataArray']['values']) > 0:
                # Taking first observation as begin position
                bp = iso.parse_datetime(data['result']['DataArray']['values'][0][jsonindex[isourn]])
            else:
                # Otherwise this can be an irregular procedure where just
                # the end position is moved forward
                if ep > iso.parse_datetime(data["samplingTime"]["endPosition"]):
                    bp = ep
                else:
                    raise Exception(f"{Fore.RED}Something is wrong with begin position..{Style.RESET_ALL}")

            data["samplingTime"] = {
                "beginPosition": bp.isoformat(),
                "endPosition":  ep.isoformat()
            }

            if len(files) > 0:
                if len(data['result']['DataArray']['values']) > maxobs:
                    total = len(data['result']['DataArray']['values'])
                    inserted = last = maxobs

                    while len(data['result']['DataArray']['values']) > 0:
                        tmpData = copy.deepcopy(data)
                        tmpData['result']['DataArray']['values'] = (
                            data['result']['DataArray']['values'][:last]
                        )
                        data['result']['DataArray']['values'] = (
                            data['result']['DataArray']['values'][last:]
                        )

                        if len(data['result']['DataArray']['values']) > 0:
                            tmpData["samplingTime"] = {
                                "beginPosition": tmpData[
                                    'result'][
                                    'DataArray'][
                                    'values'][0][jsonindex[isourn]],
                                "endPosition": data[
                                    'result'][
                                    'DataArray'][
                                    'values'][0][jsonindex[isourn]]
                            }
                        else:
                            tmpData["samplingTime"] = {
                                "beginPosition": tmpData[
                                    'result'][
                                    'DataArray'][
                                    'values'][0][jsonindex[isourn]],
                                "endPosition":   ep.isoformat()
                            }

                        res = req.post(
                            "%s/wa/istsos/services/%s/"
                            "operations/insertobservation" % (url, service),
                            auth=auth,
                            verify=False,
                            data=json.dumps({
                                "ForceInsert": "true",
                                "AssignedSensorId": aid,
                                "Observation": tmpData
                            })
                        )
                        
                        # Read response
                        res.raise_for_status()
                        if not res.json()['success']:
                            log(res.json()['message'])
                            return False, 0

                        if len(
                                data['result']['DataArray']['values']
                                ) < maxobs:
                            last = len(
                                data['result']['DataArray']['values'])
                        inserted += last

                else:
                    res = req.post(
                        "%s/wa/istsos/services/%s/operations/"
                        "insertobservation" % (url, service),
                        auth=auth,
                        verify=False,
                        data=json.dumps({
                            "ForceInsert": "true",
                            "AssignedSensorId": aid,
                            "Observation": data
                        })
                    )

                    # Read response
                    res.raise_for_status()
                    if not res.json()['success']:
                        log(f"{Fore.RED}  > Insert observation success: False{Style.RESET_ALL}")
                        return False, 0
                    else: 
                        log(f"{Fore.GREEN}  > Insert observation success: True{Style.RESET_ALL}")
                        log("  > Values: %s" % len(data['result']['DataArray']['values']))

                # with open('JSON_files/' + proc + '-' + dtstr + '.json', 'w') as outfile:
                #     json.dump(data, outfile)

    except requests.exceptions.HTTPError as eh:
        #addException(str(eh))
        traceback.print_exc()
        return False, 0

    except Exception as e:
        #addException(str(e))
        traceback.print_exc()
        return False, 0

    return True, len(data['result']['DataArray']['values'])
# post_data_on_station("http://192.168.2.11/istsos", "demo", "unread_data", "ASIGONIA")