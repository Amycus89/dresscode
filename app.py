import requests
import sqlite3
from flask import Flask, render_template, request

# Configure application
app = Flask(__name__, template_folder="templates")

# Configure to use myDB.db as a database
db = sqlite3.connect('myDB.db')

#Find out the current latitude and longitude of user using geolocation
key = '4267f2641be9e115967b50caf509acef'

@app.route('/', methods=['GET', 'POST'])
def index():
    if request.method == 'POST':
        data = request.get_json()
        latitude = data['latitude']
        longitude = data['longitude']
        # Obtain a working url to find weather info based on user's location
        coordinate_api_url = f"https://api.openweathermap.org/data/2.5/weather?lat={latitude}&lon={longitude}&appid={key}"
        weather_request=requests.get(coordinate_api_url)
        weather_data = weather_request.json()
        weather_description = weather_data['weather'][0]['description']
        print(weather_description)
        return render_template('index.html')
    else:
        return render_template('index.html')



# https://api.openweathermap.org/data/2.5/weather?lat={lat}&lon={lon}&appid={API key}
