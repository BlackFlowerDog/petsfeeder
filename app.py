from flask import Flask, render_template, request, redirect, send_from_directory, url_for, abort
from werkzeug.utils import secure_filename
from datetime import datetime
import random
import json
import os

UPLOAD_FOLDER = 'static/images'
ALLOWED_EXTENSIONS = {'jpg', 'jpeg', 'png'}
CONFIG_FILENAME = 'config.json' 

app = Flask(__name__, static_folder='static')
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

#pages for users

@app.route('/')
def mainPage():
	return render_template('main.html')

@app.route('/about_us/')
def aboutUsPage():
	return render_template('about_us.html')        

@app.route('/settings/schedule', methods = ['GET'])
def scheduleSettingsPage():
	if request.method == 'GET':
		action = request.args.get('action')
		if action is not None:
			with open(CONFIG_FILENAME, 'r+') as jsonFile:
				pets = json.load(jsonFile)
				jsonFile.close()
				petName = request.args.get('pet_name')
				if (pets.get(petName, None) == None):
					abort(501)

				if action == 'change_activation':
					currentState = pets.get(petName)['schedule']['activate']
					pets.get(petName)['schedule']['activate'] = not currentState
				elif action == 'delete_time':
					deleteTime = request.args.get('time')
					pets.get(petName)['schedule']['time'].remove(deleteTime)
				elif action == 'add_time':
					time = request.args.get('time')
					if isCorrectFormat(time):
						pets.get(petName)['schedule']['time'].append(time)
						pets.get(petName)['schedule']['time'] = sorted(pets.get(petName)['schedule']['time'])
				elif action == 'reset_schedule':			
					pets.get(petName)['schedule']['time'].clear()
				with open(CONFIG_FILENAME, 'w') as jsonFile:
					json.dump(pets, jsonFile)  
					jsonFile.close()
					return redirect(url_for('scheduleSettingsPage'))
	return render_template('schedule.html')

def isCorrectFormat(time): 
	timeFormat = '%H:%M'
	validTime = datetime.strptime(time, timeFormat)
	if validTime != False:
		return True
	else: 
		return False	

@app.route('/settings/addpets', methods = ['GET', 'POST'])
def addPetPage():
	if request.method == 'POST':
		with open(CONFIG_FILENAME, 'r+') as jsonFile:
			pets = json.load(jsonFile)
			jsonFile.close()
			petName = request.form.get('name')
			if (pets.get(petName, None) != None):
				abort(501)

			if request.form.get('type') == 'cat':
				petType = True
			else:
				petType = False
			photo = request.files['photo']	
			if not photo:
				if petType:
					photoName = 'default-cat.jpg'
				else:
					photoName = 'default-dog.jpg'	 
			else:
				if allowedFile(photo.filename):
					photoName = petName + secure_filename(photo.filename)
					photo.save(os.path.join(app.config['UPLOAD_FOLDER'], photoName))
			birthday = request.form.get('birthday') 
			if request.form.get('gender') == 'male':
				sex = True
			else:
				sex = False	
			if request.form.get('isSchedule') == 'on':
				activate = True
			else:
				activate = False
			newPet = {'type': petType, 'photoName': photoName, 'birthday': birthday, 'sex': sex, 'schedule': {'activate': activate, 'time': []} }
			pets[petName] = newPet
			with open(CONFIG_FILENAME, 'w') as jsonFile:
				json.dump(pets, jsonFile)  
				jsonFile.close()
				return redirect(url_for('addPetPage'))
	return render_template('addpets.html')

def allowedFile(filename):
	return '.' in filename and \
		filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@app.route('/delete_pet', methods = ['GET'])
def deletePet():
	if request.method == 'GET':
		with open(CONFIG_FILENAME, 'r+') as jsonFile:
			pets = json.load(jsonFile)
			jsonFile.close()
			petName = request.args.get('delete_pet')
			deletePet = pets.pop(petName, None)
			if deletePet != None:
				if deletePet['photoName'] != 'default-dog.jpg' and deletePet['photoName'] != 'default-cat.jpg':
					os.remove(os.path.join(app.config['UPLOAD_FOLDER'], deletePet['photoName']))
			else:
				abort(501)		
			with open(CONFIG_FILENAME, 'w') as jsonFile:
				json.dump(pets, jsonFile)  
				jsonFile.close()
	return redirect(url_for('addPetPage'))   

@app.route('/fill_bowl', methods = ['GET'])
def fillBowl():
	if request.method == 'GET':
		petName = request.args.get('pet_name')
	return redirect(url_for('mainPage')) 

#api pages
@app.route('/api/get_pet_food_level')
def apiGetPetFoodLevel():
	with open(CONFIG_FILENAME, 'r+') as jsonFile:
		pets = json.load(jsonFile)
		jsonFile.close()
		if len(pets) > 0:
			interval = int(100/len(pets))
			sensorsValues = {}
			names = list(pets.keys())
			for i in range(len(pets)): 
				sensorsValues[names[i]] = random.randint(i * interval, (i + 1) * interval)
			return sensorsValues
		else:
			return '0'

@app.route('/api/get_schedule')
def getSchedule():
	with open(CONFIG_FILENAME, 'r+') as jsonFile:
		pets = json.load(jsonFile)
		jsonFile.close()
		if len(pets) > 0:
			petsSchedule = {}
			names = list(pets.keys())
			for i in range(len(pets)):
				petsSchedule[names[i]] = pets.get(names[i])['schedule']
			return petsSchedule
		else:
			return '0'

@app.route('/api/get_schedule/<petName>')
def getCurrentSchedule(petName):
	with open(CONFIG_FILENAME, 'r+') as jsonFile:
		pets = json.load(jsonFile)
		jsonFile.close()
		pet = pets.get(petName, None)
		if pet != None:
			return pet['schedule']
		else:
			return '0' 
	

@app.route('/api/get_pets')
def getCurrentPet():  
	with open(CONFIG_FILENAME, 'r+') as jsonFile:  
		pets = json.load(jsonFile)
		jsonFile.close()
		return pets 

# error page
@app.errorhandler(404)
def notFoundError(error):
	return render_template('/error_pages/404.html'), 404

@app.errorhandler(500)
def internalError(error):
	return render_template('/error_pages/500.html'), 500

@app.errorhandler(501)
def configFileModificationError(error):
	return render_template('/error_pages/501.html'), 501	

if __name__ == '__main__':
	app.run(host = '0.0.0.0', debug = 0)
