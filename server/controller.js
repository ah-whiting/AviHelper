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
        let rawEndDate = moment();
        let endDate = rawEndDate.format("YYYY-MM-DD");
        let startDate = rawEndDate.subtract(req.params.days, 'days').format("YYYY-MM-DD");
        console.log("start date:", startDate, "endDate", endDate)
        let returnData = {};
        delayCalls();

        function delayCalls(option = dataOptions, idx = 0){
            if(idx == option.length){
                // console.log(returnData);
                const nwac = new Nwac(returnData);
                nwac.save()
                    .then(data => console.log('successful save'))
                    .catch(err => console.log('woops', err));
                console.log('data sent');
                return res.json(returnData)
            };

            axios.get(`https://www.nwac.us/data-portal/csv/location/${req.params.location}/sensortype/${option[idx]}/start-date/${startDate}/end-date/${endDate}/`)
                .then(data => {
                    let keyIdx = data.data.indexOf("\n");
                    firstLine = data.data.substr(0, keyIdx);
                    let replaceLine = firstLine.split(".").join("");
                    let parsedData = replaceLine + data.data.substr(keyIdx + 1);
                    returnData[option[idx]] = csvjson.toObject(parsedData);
                    console.log(option[idx], " hit")
                    setTimeout(delayCalls, 5000, dataOptions, idx + 1);
                })
                .catch(err => console.log('get error', err));
        }
    },

    nwacDB: (req, res) => {

        Nwac.findById("5ca7c068d0a9e21c2886f2af")
            .then(data => res.json(data))
            .catch(err => res.json(err))
    },

    d3Test: (req, res) => {

    }



    
    
}