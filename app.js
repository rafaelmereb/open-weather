const express = require('express')
const https = require('https')
const app = express()
require('dotenv').config()

const SERVER_PORT = process.env.SERVER_PORT
const OPEN_WEATHER_API_KEY = process.env.OPEN_WEATHER_API_KEY
const city = {
    country_code: 'BRA',
    city_name: 'Goiânia',
    lat: '-16.680882',
    lon: '-49.2532691'
}

app.use(express.urlencoded({ extended: true }))

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html')
})

app.post('/', (req, res) => {
    const cityName = req.body.cityName || city.city_name

    let units = 'metric'
    const URL_WEATHER_API = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${OPEN_WEATHER_API_KEY}&units=${units}`
    https.get(URL_WEATHER_API, (response) => {
        console.log(response.statusCode)

        response.on("data", (data) => {
            const weatherData = JSON.parse(data)

            const temperature = weatherData.main.temp
            const weatherDescription = weatherData.weather[0].description
            const icon_id = weatherData.weather[0].icon
            const imageUrl = `http://openweathermap.org/img/wn/${icon_id}@2x.png`

            res.set('Content-Type', 'text/html')
            res.write(`<p>The weather is currently ${weatherDescription}</p>`)
            res.write(`<h1>The temperature in ${cityName} is: ${temperature} degrees celcius</h1>`)
            res.write(`<img src="${imageUrl}">`)
            res.send()
        })
    })
})

app.get('/gyn/geo', (req, res) => {

    const limit = 1
    const URL_GEOCODING_API = `https://api.openweathermap.org/geo/1.0/direct?q=${city.city_name},${city.country_code}&limit=${limit}&appid=${OPEN_WEATHER_API_KEY}`
    https.get(URL_GEOCODING_API, (response) => {
        console.log(response.statusCode);
        response.on("data", (data) => {
            let jsonData = JSON.parse(data)

            let lat = jsonData[0].lat
            let lon = jsonData[0].lon

            res.write(`Latitude: ${lat}\n`)
            res.write(`Longitude: ${lon}`)
            res.send()
        })

    })
})

app.listen(SERVER_PORT, function () {
    console.log('Listening on port ' + SERVER_PORT)
})

