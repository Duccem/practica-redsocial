const fs = require('fs-extra');
const cloudinary = require('cloudinary');
const Image = require('../models/image');
const Comment = require('../models/comment');
const User = require('../models/user');
const sidebar = require('../helpers/sidebar');
const { cloudinar } = require('../keys');
const controller = {}

cloudinary.config({
    cloud_name: cloudinar.CLOUD_NAME,
    api_key: cloudinar.API_KEY,
    api_secret: cloudinar.API_SECRET
});

controller.index = async (req, res) => {
    let viewModel = { image: {}, comments: [] };
    const { image_id } = req.params;
    const image = await Image.findOne({ public_id: image_id }).populate('user');
    const user = await User.findOne({_id:req.user_id});
    viewModel.image = image;
    viewModel.user = user;
    viewModel.like = false;
    viewModel.delete = false;
    if (image) {
        if (!image.views.includes(req.user_id)) {
            await image.updateOne({ $push: { views: req.user_id } });
            await image.save();
        }
        if (!image.likes.includes(req.user_id)) viewModel.like = true;
        if (image.user._id == req.user_id) viewModel.delete = true;
        const comments = await Comment.find({ image_id: image._id }).populate('user').sort({ fecha_at: -1 });
        viewModel.comments = comments;

        viewModel = await sidebar.SidebarData(viewModel);
        viewModel = await sidebar.imageStatsSideBar(viewModel, image._id);
        res.render('image', viewModel);
    } else {
        res.redirect('/');
    }

};
controller.create = async (req, res) => {
    console.log(req);
    const { title, description } = req.body;
    const { path } = req.file;
    const { public_id, url } = await cloudinary.v2.uploader.upload(path);
    const newPost = new Image({
        title,
        description,
        user: req.user_id,
        path: url,
        public_id
    });
    await newPost.save();
    await fs.unlink(path);
    res.redirect(`/images/${newPost.public_id}`);
};
controller.like = async (req, res) => {
    try {
        const { image_id } = req.params;
        const image = await Image.findOne({ public_id: image_id });
        let count =  image.likes.length;
        if (image) {
            if(image.likes.includes(req.user_id)){
                await image.updateOne({ $pull: { likes: req.user_id } });
                count--;
            }else{ 
                await image.updateOne({ $push: { likes: req.user_id } });
                count++
            }
            await image.save();
            res.json({ likes: count});
        }
    } catch (error) {
        res.json({error:'Internal server error'});
        console.log(error);
    }
};
controller.comment = async (req, res) => {
    const { image_id } = req.params;
    const image = await Image.findOne({ public_id: image_id });
    const user = await User.findOne({ _id: req.user_id });
    if (image) {
        const comment = new Comment({
            comment: req.body.comment,
            user: req.user_id
        });
        comment.image_id = image._id;
        comment.name = user.username;
        await comment.save();
        res.redirect(`/images/${image.public_id}`);
    } else {
        res.redirect('/');
    }

};
controller.delete = async (req, res) => {
    const { image_id } = req.params;
    const image = await Image.findOne({ public_id: image_id });
    if (image) {
        await Comment.deleteMany({ image_id: image._id });
        await cloudinary.v2.uploader.destroy(image.public_id);
        await image.remove();
        res.json({ deleted: true });
    }

};
module.exports = controller;