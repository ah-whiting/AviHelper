const Product = require('./models')

module.exports = {

    all_products: (req,res) => {
        Product.find()
            .then(data => res.json({message: "success", data}))
            .catch(err => res.json({message: 'find error', error: err}))
    },
    create_product: (req,res) => {
        console.log('route hit')
        const product = new Product(req.body)
        product.save()
            .then(data => res.json({message: "success", data}))
            .catch(err => res.json({message: 'add error', error: err}))
    }, 
    show_product: (req,res) => {
        Product.findById(req.params.id)
            .then(data => res.json({message: "success", data}))
            .catch(err => res.json({message: 'find error', error:err}))
    },
    update_product: (req,res) => {
        Product.findByIdAndUpdate(req.params.id, { $set : req.body }, 
            {new: true, runValidators: true}
        )
            .then(data => res.json({message: "success", data}))
            .catch(err => res.json({message: 'update error', error: err}))
    },
    delete_product: (req,res) => {
        Product.findByIdAndDelete(req.params.id)
            .then(data => res.json({message: 'success', deleted: data}))
            .catch(err => res.json({message: "delete error", error: err}))
    }
}