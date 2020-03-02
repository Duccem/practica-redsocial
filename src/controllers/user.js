const User = require('../models/user');
const encript = require('../helpers/encript');
const Image = require('../models/image');
const { jsonwebtoken } = require('../keys');
const sidebar = require('../helpers/sidebar');
const jwt = require('jsonwebtoken');
const fs = require('fs-extra');
const cloudinary = require('cloudinary');
const { cloudinar } = require('../keys');
const controller = {};

cloudinary.config({
    cloud_name: cloudinar.CLOUD_NAME,
    api_key: cloudinar.API_KEY,
    api_secret: cloudinar.API_SECRET
});

controller.signup = async (req, res) => {
    const newUser = new User(req.body);
    if (req.file) {
        const { path } = req.file;
        const { url } = await cloudinary.v2.uploader.upload(path);
        newUser.avatar = url;
        await fs.unlink(path);
    }
    newUser.password = await encript.encriptar(newUser.password);
    await newUser.save();
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
        let user;
        if (sesion.username == req.params.username) {
            user = sesion;
            viewModel.isMyProfile = true;
        } else {
            user = await User.findOne({ username: req.params.username });
            viewModel.isMyProfile = false;
        }
        if (user) {
            viewModel.user = user;
            const images = await Image.find({ user: user._id }).populate('comments');
            viewModel.images = images;
            viewModel = await sidebar.SidebarData(viewModel);
            viewModel = await sidebar.userImageCounter(viewModel, user._id);

            return res.render('profile', viewModel);
        }
        return res.redirect('/');
    } catch (error) {
        console.log(error);
        return res.redirect('/');
    }
}

controller.edit = async (req, res) => {
    try {
        const sesion = await User.findOne({ _id: req.user_id });
        if(sesion.username !== req.params.username) return res.redirect('/');
        let viewModel = { images: [] };
        const user = sesion;
        viewModel.sesion = sesion;
        if (user) {
            viewModel.user = user;
            const images = await Image.find({ user: user._id }).populate('comments');
            viewModel.images = images;
            viewModel = await sidebar.SidebarData(viewModel);
            viewModel = await sidebar.userImageCounter(viewModel, user._id);

            return res.render('edit', viewModel);
        }
        return res.redirect('/');
    } catch (error) {
        console.log(error);
        return res.redirect('/');
    }
}

controller.update = async (req, res) => {
    try {
        const newUser = req.body;
        const user = await User.findOne({ _id: req.user_id });
        if (req.file) {
            const { path } = req.file;
            let avatar = user.avatar;
            let public_id = avatar.split('/')[7].split('.')[0];
            await cloudinary.v2.uploader.destroy(public_id);
            const { url } = await cloudinary.v2.uploader.upload(path);
            newUser.avatar = url;
            await fs.unlink(path);
        }
        await user.updateOne({$set:newUser});
        return res.redirect('/profile/'+user.username);
    } catch (error) {
        console.log(error);
        return res.redirect('/');
    }
}

module.exports = controller;