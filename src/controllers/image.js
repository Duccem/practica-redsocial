const fs = require('fs-extra');
const Image = require('../models/image');
const Comment = require('../models/comment');
const sidebar = require('../helpers/sidebar');
const controller = {}


controller.index = async (req,res) =>{
    let viewModel = {image:{},comments:[]};
    const {image_id} = req.params;
    const image =  await Image.findOne({filename:{$regex:image_id}});
    viewModel.image = image;
    if(image){
        image.views = image.views+1;
        await image.save();
        const comments = await  Comment.find({image_id:image._id}).sort({fecha_at:-1});
        viewModel.comments = comments;
        viewModel = await sidebar(viewModel);
        res.render('image',viewModel);
    }else{
        res.redirect('/');
    }
    
};
controller.create = async (req,res) =>{
    const {title,description} = req.body;
    const {filename,path} = req.file;
    const newPost = new Image({
        title,
        description,
        filename,
        path
    });
    await  newPost.save();
    res.redirect(`/images/${newPost.uniqueId}`);
};
controller.like = async (req,res) =>{
    const {image_id} = req.params;
    const image =  await Image.findOne({filename:{$regex:image_id}});
    if(image){
        image.likes = image.likes + 1;
        await image.save();
        res.json({likes:image.likes});
    }
};
controller.comment = async (req,res) =>{
    const {image_id} = req.params;
    const image = await Image.findOne({filename:{$regex:image_id}});
    if(image){
        const comment = new Comment(req.body);
        comment.image_id = image._id;
        await comment.save();
        res.redirect(`/images/${image.uniqueId}`);
    }else{
        res.redirect('/');
    }
    
};
controller.delete = async (req,res) =>{
    const {image_id} = req.params;
    const image =  await Image.findOne({filename:{$regex:image_id}});
    if(image){
        await fs.unlink(image.path);
        await Comment.deleteMany({image_id:image._id});
        await image.remove();
        res.json({deleted:true});
    }
    
};
module.exports = controller;