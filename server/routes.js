const controller = require('./controller')

module.exports = (app) => {

    app
        .get('/api/nwac/:location/:days', controller.nwacDB)
        .get('/api/nwac/demo', controller.demo)
}