from cmath import e
import glob
import sys
import os
from dotenv import load_dotenv
import convertData
load_dotenv("../firstdapp/.env")

verifyPath = os.getenv("PATH_VERIFY") + "*.txt"
fileForCheck = glob.glob(verifyPath)
for f in fileForCheck:
    convertData.convert_data_for_verification(f)
    os.remove(f)
