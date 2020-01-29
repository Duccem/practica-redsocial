const User = require('../models/user');
const encript = require('../helpers/encript');
const Image = require('../models/image');
const { jsonwebtoken } = require('../keys');
const sidebar = require('../helpers/sidebar');
const jwt = require('jsonwebtoken');
const fs = require('fs-extra');
const cloudinary = require('cloudinary');
const controller = {};

controller.signup = async (req, res) => {
    const newUser = new User(req.body);
    console.log(req);
    const { path } = req.file;
    const {  url } = await cloudinary.v2.uploader.upload(path);
    newUser.avatar = url;
    newUser.password = await encript.encriptar(newUser.password);
    await newUser.save();
    await fs.unlink(path);
    const token = jwt.sign({ id: newUser._id }, jsonwebtoken.key || "2423503", { expiresIn: 60 * 60 * 24 });
    return res.cookie('token', token, { expire: new Date() + 60 * 60 * 24 }).redirect('/');
};

controller.signin = async (req, res) => {
    const user = await User.findOne({ username: req.body.username });
    const valid = await encript.validar(req.body.password, user.password);
    if (!valid) return res.redirect('/login');
    const token = jwt.sign({ id: user._id }, jsonwebtoken.key || "2423503", { expiresIn: 60 * 60 * 24 });
    return res.cookie('token', token, { expire: new Date() + (60 * 60 * 24) }).redirect('/');
};

controller.profile = async (req, res) => {
    try {
        const sesion = await User.findOne({ _id: req.user_id });
        let viewModel = { images: [] };
        viewModel.sesion = sesion;
        const user = await User.findOne({ username: req.params.username });
        if(user){
            viewModel.user = user;
            const images = await Image.find({user:user._id}).populate('comments');
            console.log(images);
            viewModel.images = images;
            viewModel = await sidebar.SidebarData(viewModel);
            viewModel = await sidebar.userImageCounter(viewModel, user._id);
            return res.render('profile', viewModel);
        }
        return res.redirect('/');
    } catch (error) {
        console.log(error);
    }
}

module.exports = controller;