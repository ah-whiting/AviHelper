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

    nwac: (req = null, res = null) => {
        console.log('nwac hit');
        let days = 45
        if(req) { days = req.params.days}
        let rawEndDate = moment();
        let endDate = rawEndDate.format("YYYY-MM-DD");
        let startDate = rawEndDate.subtract(days, 'days').format("YYYY-MM-DD");
        let returnData = {};
        delayCalls();

        function delayCalls(option = dataOptions, idx = 0){
            let location = 'snoqualmie-pass';
            if(idx == option.length) {
                const nwac = new Nwac(returnData);
                nwac.save()
                    .then(data => console.log('successful save'))
                    .catch(err => console.log('woops', err));
                console.log('data sent');
                if( res ) { return res.json(returnData) }
            }
            if(req) { location = req.params.location }
            axios.get(`https://www.nwac.us/data-portal/csv/location/${location}/sensortype/${option[idx]}/start-date/${startDate}/end-date/${endDate}/`)
                .then(data => {
                    let keyIdx = data.data.indexOf("\n");
                    let firstLine = data.data.substr(0, keyIdx);
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
        Nwac.findOne().sort({ field: 'asc', _id: -1 })
            .then(data => res.json(data))
            .catch(err => res.json(err));
    },

    demo: (req, res) => {
        Nwac.findById("5cb15b0b3e117c378c74679f")
            .then(data => res.json(data))
            .catch(err => res.json(err));
    }
}

let isUpdateOn = true;
function update() {
    if(isUpdateOn) {return}
    nwacUpdate();
}
function nwacUpdate() {
    module.exports.nwac();
    setTimeout(nwacUpdate, 43200000)
}
update();