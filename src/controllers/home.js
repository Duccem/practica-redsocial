const sidebar = require('../helpers/sidebar');
const controller = {}
const Image = require('../models/image');
const User = require('../models/user');

controller.index = async (req, res) => {
    const images = await Image.find().sort({ fecha_at: -1 }).limit(10);
    const sesion = await User.findOne({_id:req.user_id});
    let viewModel = { images: [] };
    viewModel.images = images;
    viewModel.sesion = sesion;
    viewModel = await sidebar.SidebarData(viewModel);
    return res.render('index', viewModel);
};

controller.signup = async (req, res) => {
    return res.clearCookie('token').render('signup');
};

controller.signin = async (req, res) => {
    return res.clearCookie('token').render('login');
};

controller.logout = async (req,res)=>{
    return res.clearCookie('token').redirect('/login');
}

module.exports = controller;