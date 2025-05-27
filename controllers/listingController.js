const Listing = require('../model/Listing')

const getAllListing = async (req, res) => {
    const listings = await Listing.find();

    if(!listings ) return res.status(204).json({'message': 'no listings where found!'})

        res.json(listings)
}

const createNewListing = async (req, res) => {
     
    try {
        const result = await Listing.create({
            address: req.body.address,
            baths: req.body.baths,
            bedrooms: req.body.bedrooms,
            description: req.body.description,
            email: req.body.email,
            name : req.body.name,
            phone: req.body.phone,
            tag: req.body.tag
        })
        res.status(201).json(result)
    } catch (error) {
        console.error(error)
    }
}



module.exports = {
    getAllListing,
    createNewListing
}