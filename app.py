import requests
import sqlite3
from datetime import datetime
from flask import Flask, render_template, request

# Configure application
app = Flask(__name__, template_folder="templates")

# Configure to use myDB.db as a database
db = sqlite3.connect('myDB.db')

#Find out the current latitude and longitude of user using geolocation
# Store API key
key = '4267f2641be9e115967b50caf509acef'

@app.route('/', methods=['GET', 'POST'])
def index():
    if request.method == 'POST':
        # #request user location from the browser (javascript)
        data = request.get_json()
        latitude = data['latitude']
        longitude = data['longitude']

        # Obtain a working url to find weather info based on user's location
        coordinate_api_url = f"https://api.openweathermap.org/data/2.5/weather?lat={latitude}&lon={longitude}&appid={key}"
        # Request and store the data from it
        weather_request=requests.get(coordinate_api_url)
        weather_data = weather_request.json()

        # Save all the info needed in a variable
        # START
        weather_description = weather_data['weather'][0]['description']
        # Get temperature in Kelvin
        temp = weather_data['main']['temp']
        temp_min = weather_data['main']['temp_min']
        temp_max = weather_data['main']['temp_max']
        feels_like = weather_data['main']['feels_like']
        humidity = weather_data['main']['humidity']
        pressure = weather_data['main']['pressure']
        visibility = weather_data['visibility']
        wind_speed = weather_data['wind']['speed']
        wind_deg = weather_data['wind']['deg']
        name = weather_data['name']
        country = weather_data['sys']['country']
        sunrise = weather_data['sys']['sunrise']
        sunset = weather_data['sys']['sunset']
        id = weather_data['id']

        # Check if it's day or night
        sun_moon = ''
        if sunrise < sunset:
            sun_moon = 'sun'
        else:
            sun_moon = 'moon'

        # Convert from Unix timestamp format to readable format
        sunrise = datetime.utcfromtimestamp(sunrise).strftime('%Y-%m-%d %H:%M:%S')
        sunset = datetime.utcfromtimestamp(sunset).strftime('%Y-%m-%d %H:%M:%S')

        #END

        # Store all of the info in a dictionary
        weather_info = {
            'weather_description': weather_description,
            'temp': temp,
            'temp_min': temp_min,
            'temp_max': temp_max,
            'feels_like': feels_like,
            'humidity': humidity,
            'pressure': pressure,
            'visibility': visibility,
            'wind_speed': wind_speed,
            'wind_deg': wind_deg,
            'name': name,
            'country': country,
            'sunrise': sunrise,
            'sunset': sunset,
            'id': id,
            'sun_moon': sun_moon
        }

        print(weather_info)

        # Return weather_info back to the browser
        return render_template('index.html', weather_info=weather_info)
    else:
        return render_template('index.html')



# https://api.openweathermap.org/data/2.5/weather?lat={lat}&lon={lon}&appid={API key}
