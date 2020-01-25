const fs = require('fs-extra');
const cloudinary = require('cloudinary');
const Image = require('../models/image');
const Comment = require('../models/comment');
const sidebar = require('../helpers/sidebar');
const {cloudinar} = require('../keys');
const controller = {}

cloudinary.config({
    cloud_name: cloudinar.CLOUD_NAME,
    api_key: cloudinar.API_KEY,
    api_secret: cloudinar.API_SECRET
});

controller.index = async (req, res) => {
    let viewModel = { image: {}, comments: [] };
    const { image_id } = req.params;
    const image = await Image.findOne({ public_id:  image_id  });
    viewModel.image = image;
    if (image) {
        image.views = image.views + 1;
        await image.save();
        const comments = await Comment.find({ image_id: image._id }).sort({ fecha_at: -1 });
        viewModel.comments = comments;
        viewModel = await sidebar(viewModel);
        res.render('image', viewModel);
    } else {
        res.redirect('/');
    }

};
controller.create = async (req, res) => {
    const { title, description } = req.body;
    const { path } = req.file;
    const { public_id, url } = await cloudinary.v2.uploader.upload(path);
    const newPost = new Image({
        title,
        description,
        path: url,
        public_id
    });
    await newPost.save();
    await fs.unlink(path);
    res.redirect(`/images/${newPost.public_id}`);
};
controller.like = async (req, res) => {
    const { image_id } = req.params;
    const image = await Image.findOne({ public_id: image_id });
    if (image) {
        image.likes = image.likes + 1;
        await image.save();
        res.json({ likes: image.likes });
    }
};
controller.comment = async (req, res) => {
    const { image_id } = req.params;
    const image = await Image.findOne({ public_id: image_id  });
    if (image) {
        const comment = new Comment(req.body);
        comment.image_id = image._id;
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