const controller = require('./controller')

module.exports = (app) => {

    app
        // .get('/init', controller.init)
        .get('/api/nwac/:location', controller.nwacDB)
        // .get('/')
        
}