from contextlib import redirect_stdout
import io
import re
import tkinter as tk
from tkinter import filedialog, Button
import os
from tkinter import font
from turtle import dot
import yaml
import postMain
from io import StringIO
import sys

with open("external_data/config.yml", "r") as ymlfile:
    cfg = yaml.safe_load(ymlfile)

CANVAS_CL = "#ffffff"
FRAME_CL = "#a3b87d"
TEXT_CL = "#ffffff"
BUTTON_CL = "#5f7d36"

root = tk.Tk()
root.title('Simple App!')

files = []

def selectFiles():
    filename = filedialog.askopenfilenames(
                initialdir="/", 
                title="Select Files",
                filetypes=(("text document", "*.txt"), )
                )
    for x in list(filename):
        if x not in files: files.append(x)
    # print(files)
    csv = ''
    for x in files:
        csv += x.split('/')[-1] + '\n'
    selectFileDisplay['state'] = tk.NORMAL
    selectFileDisplay.insert(tk.INSERT, csv)
    selectFileDisplay['state'] = tk.DISABLED

def runPythonScript():
    ip = entryIp.get()
    db = entryDb.get()

    if ip != cfg["istsos"]["ip"]:
        cfg["istsos"]["ip"] = ip
        cfg["istsos"]["url"] = 'http://' + ip + '/istsos/'
        # print(cfg["istsos"]["ip"], cfg["istsos"]["url"])

    if db != cfg["istsos"]["db"]:
        cfg["istsos"]["db"] = db
        # print(cfg["istsos"]["db"])

    with open("external_data/config.yml", "w") as f:
        yaml.dump(cfg, f)

    # sys.stdout = buffer = StringIO()
    console['state'] = tk.NORMAL
    f = io.StringIO() 
    with redirect_stdout(f):
        if files == []:
            postMain.postMain(None)
        else:
            postMain.postMain(files) 
    console.insert(tk.INSERT, f.getvalue())
    
    console['state'] = tk.DISABLED


# Specify dimensions
canvas = tk.Canvas(root, height=600, width=900, bg=CANVAS_CL)
canvas.pack()

# Split canvas into frames
frameLogo = tk.Frame(root, bg=FRAME_CL)
frameLogo.place(relx=0.025, rely=0.025, relwidth=0.95, relheight=0.15)

frameLeft = tk.Frame(root, bg=CANVAS_CL)
frameLeft.place(relx=0.025, rely=0.2, relwidth=0.4, relheight=0.775)

frameLup = tk.Frame(frameLeft, bg=BUTTON_CL, bd=25)
frameLup.place(relx=0, rely=0, relwidth=1, relheight=0.2)

frameLdown = tk.Frame(frameLeft, bg=FRAME_CL, bd=25)
frameLdown.place(relx=0, rely=0.25, relwidth=1, relheight=0.4)

frameRight = tk.Frame(root, bg=FRAME_CL, bd=25)
frameRight.place(relx=0.45, rely=0.2, relwidth=0.525, relheight=0.775)

# Add logo label
logo = tk.Label(frameLogo, text="Simple App!", font=(font.BOLD, 35), bg=FRAME_CL, fg=TEXT_CL)
logo.place(relx=0, rely=0, relwidth=1, relheight=1)

# Add URL
frameUrl = tk.Frame(frameLup, bg=BUTTON_CL)
frameUrl.place(relx=0, rely=0, relwidth=1, relheight=0.4)

textURL = tk.Label(frameUrl, text="Ip service:", font=font.BOLD, fg=TEXT_CL, bg=BUTTON_CL, anchor='w')
textURL.place(relx=0, rely=0, relwidth=0.25, relheight=1)

entryIp = tk.Entry(frameUrl)
entryIp.place(relx=0.3, rely=0, relwidth=0.7, relheight=1)
entryIp.insert(1, cfg["istsos"]["ip"])

# Add label Database
frameDb = tk.Frame(frameLup, bg=BUTTON_CL)
frameDb.place(relx=0, rely=0.6, relwidth=1, relheight=0.4)

textDb = tk.Label(frameDb, text="Database:", font=font.BOLD, fg=TEXT_CL, bg=BUTTON_CL, anchor='w')
textDb.place(relx=0, rely=0, relwidth=0.25, relheight=1)

entryDb = tk.Entry(frameDb)
entryDb.place(relx=0.3, rely=0, relwidth=0.7, relheight=1)
entryDb.insert(1, cfg["istsos"]["db"])

# Add select button
selectFile = Button(frameLdown, text="Select\nFiles", bg=BUTTON_CL, fg=TEXT_CL, command=selectFiles)
selectFile.place(relx=0, rely=0, relwidth=0.25, relheight=0.4)

# Add select files names text
selectFileDisplay = tk.Text(frameLdown, state=tk.DISABLED)
selectFileDisplay.place(relx=0.3, rely=0, relwidth=0.7, relheight=1)

scroll1 = tk.Scrollbar(frameLdown, orient="vertical", command=selectFileDisplay.yview)
scroll1.pack(side='right', fill='y')
selectFileDisplay.configure(yscrollcommand=scroll1.set)

# Add run button
runPyScript = Button(frameLdown, text="Start\nProcedure", bg=BUTTON_CL, fg=TEXT_CL, command=runPythonScript)
runPyScript.place(relx=0, rely=0.45, relwidth=0.25, relheight=0.55)

# Add console messages
console = tk.Text(frameRight, state=tk.DISABLED)
console.place(relx=0, rely=0, relwidth=1, relheight=1)

scroll2 = tk.Scrollbar(frameRight, orient="vertical", command=console.yview)
scroll2.pack(side='right', fill='y')
console.configure(yscrollcommand=scroll2.set)

root.mainloop()
