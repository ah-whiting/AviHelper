const mongoose = require('mongoose');

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/nwac')
    .then(data => console.log("connected to db"))
    .catch(error => console.log("failed to connect"));

const nwacSchema = new mongoose.Schema({
    "temperature": Array,
    "precipitation": Array,
    "snowfall_24_hour": Array,
    "wind_direction": Array,
    "wind_speed_average": Array
}, 
    {timestamps: true}
);
module.exports = mongoose.model('Nwac', nwacSchema);

