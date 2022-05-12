# -*- coding: utf-8 -*-
from cmath import e
import glob
import yaml 
import re
import os
import hashlib

with open("../pythonscripts/external-data/units-cfg.yml", "r") as ymlfile:
    units = yaml.safe_load(ymlfile)

wind_dir = {
	"N":"0","NNE":"1","NE":"2","ENE":"3","E":"4","ESE":"5","SE":"6","SSE":"7",
	"S":"8","SSW":"9","SW":"10","WSW":"11","W":"12","WNW":"13","NW":"14","NNW":"15"
}

def convert_sensor_label(label):
	param = "urn:ogc:def:parameter:x-istsos:1.0:meteo:"
	fixed = ["urn:ogc:def:parameter:x-istsos:1.0:time:iso8601"]
	for col in label[1:]:
		fixed.append(param + col.lower())
	return fixed

def fix_line(prevLine):
	prev = [x for x in prevLine.split("  ") if x != '' and x != '\n']
	for p in prev:
		if p[0] == ' ': prev[prev.index(p)] = p[1:]
	for j in prev:
		if j[-1] == '\n': prev[prev.index(j)] = j[:-1]
	return prev

def fix_union(falseData, correctData, label):
	for i in range(len(correctData)):
		decCor = correctData[i].find('.')
		decFal = falseData[i].find('.')
		if decCor != -1:
			dCor = correctData[i][decCor:]
			dFal = falseData[i][decFal:]
			if len(dCor) != len(dFal):
				falseData = falseData[:i] + [falseData[i][:decFal + len(dCor)]] + [falseData[i][decFal + len(dCor):]] + falseData[i+1:]
				unit2 = units["meteo"][label[i+1].replace(":","_").lower()]
				if unit2[2] == True:
					while True:
						if float(falseData[i+1]) > unit2[4]:
							falseData[i] = falseData[i] + falseData[i+1][0]
							falseData[i+1] = falseData[i+1][1:]
						else: break
		i += 1
	return falseData

def fix_names(line, prev, prevLine, indP, step):
	newM = line
	for p in prev:
		ind = prevLine.find(p, indP)
		indP = ind + len(p)
		toL = False; toR = False
		if line[ind] != " ": toL = True
		else: toR = True
		while True:
			if line[ind] != " " and toL == True: ind -= 1
			elif line[ind] == " " and toR == True: ind += 1
			else: 
				if line[ind] != " " and toR == True: ind -= 1
				newM = newM[:(ind + step)] + "    " + p.replace(" ",":") + ":" + newM[(ind + 1 + step):]
				step += len(p) + 4
				break
	newM = [x.replace(' ',':') for x in fix_line(newM)]
	newM[1] = newM[0] + ":" + newM[1]
	return newM[1:]

def fix_date(data):
	day, mon, year = data[0].split("/")
	if len(data[1]) < 5: 
		data[1] = "0" + data[1]
	data[1] = "20" + '-'.join([year, mon, day]) + "T" + data[1] + ":00.000000+0000"
	return data 

def fix_wind_direction_empty_space(line):
	for i, li in enumerate(line[1:]):
		if i == 0: continue
		if li in wind_dir.keys(): 
			line[i+1] = wind_dir[li]
		if li == '---':
			line[i+1] = '-999.9'
	return line

def convert_data_from_files(primitive_data, unread_data, conf=None):	
	# Search for all the unreaded data files.
	if conf == None:
		primitiveDataFiles = glob.glob(primitive_data)
	else:
		primitiveDataFiles = primitive_data

	# Convert the data from the files
	for file in primitiveDataFiles:
		if file.split('!')[0].split('/')[-1] == 'error':
			print('error')
			print('Your region has not the authority to add these data.')
			print('region')
			print(file.split('!')[1])
			os.remove(file)
			continue

		f = open(file, "r")
		i = 0
		place = []; wrongLine = []
		wrong = False

		try:
			for line in f:
				if line.split() == []: continue
				if i == 0:
					prevLine = line
					prev = fix_line(prevLine)
				elif i == 1:
					newNames = [x.replace('.','') for x in fix_names(line, prev, prevLine, 0, 0)]
					place.append(convert_sensor_label(newNames))
					length = len(newNames)
					labels = []
					for x in newNames:
						m = re.search(r"\d", x)
						if m: 
							if x[m.start()-1] != ':' and m.start()+1 < len(x): labels.append(x[:m.start()] + x[m.start()+1:])
							elif x[m.start()-1] != ':' and m.start()+1 >= len(x): labels.append(x[:m.start()])
							elif x[m.start()-1] == ':' and m.start()+1 < len(x): labels.append(x[:m.start()-1] + x[m.start()+1:])
							else: labels.append(x[:m.start()-1])
						else: labels.append(x)
				elif line[0:3] != "---":
					data = line.split()
					data = fix_date(data)
					data = fix_wind_direction_empty_space(data)
					# Check if data ara splitted correct
					if len(data[1:]) == length:
						correctDataPattern = data[1:]
						place.append(correctDataPattern)
					elif len(data[1:]) < length:
						# When the mistake occured on the first data row
						wrong = True
						wrongLine.append([i-2, data[1:]])
						place.append([])
				i += 1
			if wrong == True:
				for input in wrongLine:
					place[input[0]] = fix_union(input[1], correctDataPattern, labels[1:])		
			f.close()

			# Create the converted and unreaded data file
			if conf != None:
				nameD = file.split("\\")[1].split(".")[0].upper()
			else:
				nameD = file.split("/")[-1].split("_")[0].upper()
			newName = unread_data + nameD + "_" + data[1].replace('-','').replace(':','').replace('T','')[:14] + ".txt"
			unread = open(newName, "w")
			for row in place:
				unread.write(','.join(row) + '\n')
			unread.close()
		except:
			print("error")
			print(file)

		os.remove(file)

def convert_data_for_verification(file_for_check):	
	
	f = open(file_for_check, "r")
	i = 0
	place = []; wrongLine = []
	wrong = False

	try:
		for line in f:
			if line.split() == []: continue
			if i == 0:
				prevLine = line
				prev = fix_line(prevLine)
			elif i == 1:
				newNames = [x.replace('.','') for x in fix_names(line, prev, prevLine, 0, 0)]
				place.append(convert_sensor_label(newNames))
				length = len(newNames)
				labels = []
				for x in newNames:
					m = re.search(r"\d", x)
					if m: 
						if x[m.start()-1] != ':' and m.start()+1 < len(x): labels.append(x[:m.start()] + x[m.start()+1:])
						elif x[m.start()-1] != ':' and m.start()+1 >= len(x): labels.append(x[:m.start()])
						elif x[m.start()-1] == ':' and m.start()+1 < len(x): labels.append(x[:m.start()-1] + x[m.start()+1:])
						else: labels.append(x[:m.start()-1])
					else: labels.append(x)
			elif line[0:3] != "---":
				data = line.split()
				data = fix_date(data)
				data = fix_wind_direction_empty_space(data)
				# Check if data ara splitted correct
				if len(data[1:]) == length:
					correctDataPattern = data[1:]
					place.append(correctDataPattern)
				elif len(data[1:]) < length:
					# When the mistake occured on the first data row
					wrong = True
					wrongLine.append([i-2, data[1:]])
					place.append([])
			i += 1
		if wrong == True:
			for input in wrongLine:
				place[input[0]] = fix_union(input[1], correctDataPattern, labels[1:])		
		f.close()

		tempFile = open("tempFile.txt", "w")
		for row in place:
			tempFile.write(','.join(row) + '\n')
		tempFile.close()
		
		nameD = file_for_check.split("/")[-1].split(".")[0].upper()
		newName = nameD + "_" + data[1].replace('-','').replace(':','').replace('T','')[:14] + ".txt"
				
		file = open("tempFile.txt", 'rb')
		bytes = file.read() # read entire file as bytes
		hashValue = hashlib.sha256(bytes).hexdigest()
		file.close()

		os.remove("tempFile.txt")
		print(newName.split('_')[0])
		print(newName.split('_')[0] + '_' + newName.split('_')[-1].split('.')[0])
		print(hashValue)
	except:
		print("error")

	

# convert_data_for_verification("../../penteli.txt")