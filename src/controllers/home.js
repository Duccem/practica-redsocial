const controller = {}
const Image = require('../models/image');
const sidebar = require('../helpers/sidebar');

controller.index = async(req,res) =>{
    const images = await Image.find().sort({fecha_at:-1});
    let viewModel = {images:[]};
    viewModel.images = images;
    viewModel = await sidebar(viewModel);
    console.log(viewModel.sidebar);
    res.render('index',viewModel);
};


module.exports = controller;