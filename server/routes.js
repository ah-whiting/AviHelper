const controller = require('./controller')

module.exports = (app) => {

    app
        // .get('/init', controller.init)
        .get('/api/nwac/:location/:days', controller.nwac)
        
}