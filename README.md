# DressCode

#### Video Demo: https://www.youtube.com/watch?v=X-spF8oPTCI

#### Description:

A weather app, which suggests clothing based on the current weather.

This is meant to be my submission for the final project in CS50.

# About

I am from Sweden, a relatively cold country in the north. Yet I often found it odd when I visited countries in the mediterranean how, despite the temperature being a lot higher, felt a lot more bearable compared to the summers in Sweden. I later found out that this had a lot to do with the humidity and other factors.

At the same time, I have always had a hard time picking the right clothes before leaving my home. Sure, I could always just open a window or walk outside the door, but sometimes when the weather is cold here it is essentially equivalent to suicide. So after suffering through plenty of years either sweating or freezing my butt off, I decided to take the opportunity of making my own weather app. For my own needs, and hopefully someone else's too perhaps.

As it is harder to predict the weather the further into the future you look, I planned to opt for planning just for the current day - but doing it as accurately as possible.

I decided to use flask, as this is what I most recently learned from CS50x, and wanted to make a flask application from scratch. After doing my research, I opted to use OpenWeatherMap's free "5 Day / 3 Hour Forecast" API - After some time I realized that I could also have used the more advanced "One Call" API, which let's one use it for free 1000 times a day- but at that time I decided to instead keep going and make a challenge out of it.

I knew early on that there were 3 things that I wanted to have at the end:

- Display the current weather
- Display clothing suggestions based on the weather that day
- Time and date of the location. If possible, also a progressbar showing remaining daylight.

Additionally, I wanted only th eminimum amount of scripts to be on the server, as javascript is faster than Python. I wanted the user to be able to search location by city name, but from there the final image was rather fuzzy at first. As I went along I realized: What city should be the first thing a first time user sees? I first thought of using geolocation, but that wasn't possible as the user first needs to approve permission for this to be used. At one moment I just thought of using London as the default (as it has GMT = 0), but then thought about using IP adresses. So I did. If a user visits the website by the GET method, and has no prior session memory, I would localize their position using the IP adress. If not, use the city they were on last.

Then I added a geolocation button, surprisingly without much problem. It was a lot worse with searching by words however - initially I had planned to use google's places API for autocomplete suggestions, but I found it both scary and hard (I had already received a warning from GITHUB at the time that my previous API key was exposed). So in the end, that is a feature I skipped for this project.

After Making sure that I could request and fetch information from the server to the browser, it was time to use javascript to make use of this information for all the features I had planned. - Some easier things like converting from kelvin to celcius or fahrenheit, and other much more complicated things - The worst by far was the sunlight left progress bar. A bit of a funny story with this one:

The progress bar actually consists of 2 colored bars, one gray and one colored, stacked upon eachother to display progress. When one shortens, the one below is revealed. There was one point where I managed to make it act just like I wanted - except that the bars somehow got mixed up, and the whole progress bar was moving from the opposite end than I had planned to. So I figured, why not just flip it once more until it is right? Instead of rewriting the logic for the 1857 time, I decided to simply switch the colors, mirror the SVG figures using CSS, and inverse the percentage with percentage = percentage - 1.

One of my prouder moments was thinking of making the counter function - A function which took the list from the free OpenWeatherMap API with weather every 3rd hour, and counted how many times one had to go down the list until it reached midnight, and base all other clothing suggestions based on that. The logic could probably be improved a lot for more accurate clothing suggestions if one instead used OpenWeatherMap's One Call API with weather data for every hour instead of just every third, but with the limiation I set upon me I am still quite happy in the way i set it up.

In addition, I wrote several helper functions, such as localTimeStamp (Which takes a Unix timestamp and a location's timezone to tell what the time would be over there). I could probably have improved the code a lot, had I planned a bit more of what I actually needed. As in: I want the weatherIcon to display a sun when it is still daylight out, and a moon when the sun goes down. What do I need to acomplish this, aside from the icons? Well, I would need to determine whether the sun is up or not in that location. What info do I need to determine that? What the time is in that location, and what time in that location the sun rises or goes down. What do I need to tell the time and timezones over there? I need the gmt, and compare it to the time of the user's. Etc. Each of these steps could have been it's own function, and some of the later, lower end ones are likely to be used multiple times elsewhere.

On the frontend, it took a while, but it gives the website a very nice feel whenever one moves the mouse over the mouse icons. The hard part was figuring out that the best file format to do this was not gifs or webps, but using mp4 files.

Originally, I had some plans to also make a login system, where all user's could comment on the clothing suggestions where to hot or cold, which would be saved into a database and correct the future clothing suggestions based on these answers. As time I went on to question the decision from the perspective of a user perspective - Do I really want user's to sign up just to see the weather? So that was scrapped, alongside the autocomplete feature. Aside from that however, I am very satisfied with how the project ended up.
