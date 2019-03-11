const moment = require('moment');
const Nwac = require('./models');
const axios = require('axios');
const csvjson = require('csvjson');
const dataOptions = [
    "temperature",
    "precipitation",
    "snowfall_24_hour",
    "wind_direction",
    "wind_speed_average"
];
module.exports = {

    nwac: (req, res) => {
        console.log('nwac hit');

        let startDate = moment().subtract(10, 'days').format("YYYY-MM-DD");
        let endDate = moment().format("YYYY-MM-DD");
        let returnData = {};

        delayCalls();

        function delayCalls(option = dataOptions, idx = 0){

            if(idx == option.length){
                console.log('data sent')
                const nwac = new Nwac(returnData);
                nwac.save()
                    .then(data => console.log('successful save'))
                    .catch(err => console.log('woops', err))
                return res.json(returnData)
            };

            axios.get(`https://www.nwac.us/data-portal/csv/location/${req.params.location}/sensortype/${option[idx]}/start-date/${startDate}/end-date/${endDate}/`)

                .then(data => {
                    let parsedData = data.data.split(". ").join();
                    returnData[option[idx]] = csvjson.toObject(parsedData);
                    console.log(option[idx], " hit")
                    setTimeout(delayCalls, 5000, dataOptions, idx + 1);
                })
                .catch(err => console.log('get error', err))
        }

    },

    nwacDB: (req, res) => {

        Nwac.findById("5c54bb916a9aba1bc8112fda")
            .then(data => res.json(data))
            .catch(err => res.json(err))
    },

    d3Test: (req, res) => {

    }



    
    
}