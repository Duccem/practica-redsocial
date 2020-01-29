const Comment = require('../models/comment');
const Image = require('../models/image');


async function imageCounter(user_id) {
    let images = await Image.find({user:user_id});
    let likes = 0;
    images.forEach((image) => likes = likes + image.likes.length);
    return { count: images.length,likes:likes };
}

async function commentCounter(image_id) {
    let comments = await Comment.find({image_id:image_id});
    if(comments.length >  0){
        return comments.length;
    }
    return 0;
}

async function imageTotalViewsCounter(image_id) {
    const result = await Image.findOne({_id:image_id});
    if(result.views.length >  0){
        return result.views.length;
    }
    return 0;
}


async function imageTotalLikesCounter(image_id) {
    const result = await Image.findOne({_id:image_id});
    if(result.likes.length >  0){
        return result.likes.length;
    }
    return 0;
}

async function imageStats(image_id){
    const result = await Promise.all([
        commentCounter(image_id),
        imageTotalViewsCounter(image_id),
        imageTotalLikesCounter(image_id)
    ]);
    return {
        comments:result[0],
        views:result[1],
        likes:result[2]
    }
} 


module.exports = {
    imageStats,
    imageCounter
}