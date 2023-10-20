from flask import Flask, render_template, request, jsonify, session
from dotenv import load_dotenv
import os
import requests
import sqlite3

# Configure application
app = Flask(__name__, template_folder="templates")

app.secret_key = 'my_secret_key'

# Configure to use myDB.db as a database
db = sqlite3.connect('myDB.db')

#Find out the current latitude and longitude of user using geolocation
# Store API key
load_dotenv('variables.env')
key = os.getenv('key')

def getWeatherInfo(lat, lon, key):
    # Obtain a working url to find weather info based on user's location
    coordinate_api_url = f"https://api.openweathermap.org/data/2.5/forecast?lat={lat}&lon={lon}&appid={key}"
    # Request and store the data from it
    weather_request=requests.get(coordinate_api_url)
    weather_info = weather_request.json()
    return weather_info


def getCityWeatherInfo(city_name, key):
    # Obtain a working url to find weather info based on user's input
    city_api_url = f"https://api.openweathermap.org/data/2.5/forecast?q={city_name}&appid={key}"
    weather_request = requests.get(city_api_url)
    weather_data = weather_request.json()
    return weather_data

@app.route('/', methods=['GET', 'POST'])
def index():
    session['searches'] = session.get('searches', [])  # Initialize the 'searches' key with an empty list
    if request.method == 'POST':
        # Save user input in a variable called "city_name"
        city_name = request.form.get('city_name')
        weather_data = getCityWeatherInfo(city_name, key)

        # if the city name is not found, return an error. get() returns None without raising KeyError if key not present in dictionary
        if weather_data.get('cod') == '404':
            return jsonify(weather_data)

        input = city_name.capitalize()
        # Save only unique city_name to session
        # Append the input to the list
        session['searches'].append(input)
        # Check if the most recently added item has an earlier duplicate
        if session['searches'][-1] in session['searches'][:-1]:
            #If yes, remove the earlier duplicate
            session['searches'].remove(session['searches'][-1])

        while len(session['searches']) > 4:
            session['searches'].pop(0)

        session['lat'] = weather_data['city']['coord']['lat']
        session['lon'] = weather_data['city']['coord']['lon']
        weather_info = weather_data
        searches = session.get('searches', [])
        # Return weather_info back to the browser
        return jsonify(weather_info, searches)
    else:
        # Using the GET method
        #Check if session['lat'] and session['lon'] are None, indicating first time user
        if session.get('lat') is None or session.get('lon') is None:
            # Request for the user's IP address
            ip = requests.get('https://api64.ipify.org?format=json').json()
            # Store the IP address in a variable
            ip_address = ip['ip']

            location_data = requests.get(f'http://ip-api.com/json/{ip_address}?fields=status,message,country,regionName,city,lat,lon').json()

            # Save all the info needed in their own variables

            #latitude = location_data['lat']
            #longitude = location_data['lon']

            session['lat'] = location_data['lat']
            session['lon'] = location_data['lon']

            weather_info = getWeatherInfo(session['lat'], session['lon'], key)

            # Return weather_info back to the browser
            return render_template('index.html', weather_info=weather_info, searches=session.get('searches', []))
        else:
            # Return weather_info back to the browser based on session['lat'] and session['lon']
            weather_info = getWeatherInfo(session['lat'], session['lon'], key)
            return render_template('index.html', weather_info=weather_info, searches=session.get('searches', []))

@app.route('/locate', methods=['POST'])
def locate():
        # request user location from the browser (javascript)
        data = request.get_json()
        # Store lat and lon in session
        session['lat'] = data['latitude']
        session['lon'] = data['longitude']
        weather_info = getWeatherInfo(session['lat'], session['lon'], key)
        # Return weather_info back to the browser
        return jsonify(weather_info)

@app.route('/shortcut', methods=['POST'])
def shortcut():
    city_name = request.form.get('city_name')
    weather_data = getCityWeatherInfo(city_name, key)
    session['lat'] = weather_data['city']['coord']['lat']
    session['lon'] = weather_data['city']['coord']['lon']
    weather_info = weather_data
    return jsonify(weather_info)
