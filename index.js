const express = require('express');
const bodyParser = require('body-parser');
const http = require('http');

const app = express();
const port = 8383;
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.post('/webhook', (req, res) => {
    const apiKey = '6de6dc4c0b5b806fcf7beb4527285ddc766e6ef8';
    const cityName = req.body.queryResult.parameters['geo-city'];
    const requestUrl = `http://api.waqi.info/feed/${cityName}/?token=${apiKey}`;
    http.get(requestUrl, (apiResponse) => {
        let responseBody = '';
        apiResponse.on('data', (d) => {
            responseBody += d;
        });
        apiResponse.on('end', () => {
            console.log(responseBody);
            let jsonResponse = JSON.parse(responseBody);
            let data = jsonResponse.data;
            let reply = `${data.time.s} 
            ${data.city.name}
            Air quality information:
            Temperature: ${data.iaqi.t.v} deg C
            Atmospheric pressure: ${data.iaqi.p.v}
            Humidity: ${data.iaqi.h.v}
            AQI(Air Quality Index): ${data.aqi}
            PM2.5: ${data.iaqi.pm25.v}
            Nitrogen dioxide(NO2): ${data.iaqi.no2.v}
            Ozone(O3): ${data.iaqi.o3.v}
            See more at: ${data.city.url}`

            return res.json({
                fulfillmentText: reply
            });
        });
    }, (error) => {
        return res.json({
            fulfillmentText: error
        });
    });
});

app.listen((process.env.PORT || port), () => {
    console.log(`Server is running at port ${port}...`);
});