const controller = require('./controller')

// controller.

module.exports = (app) => {

    app
        // .get('/init', controller.init)
        .get('/api/nwac/:location/:days', controller.nwacDB)
        
}