const Comment = require('../models/comment');
const Image = require('../models/image');
async function imageCounter() {
    return await Image.countDocuments();
}


async function commentCounter() {
    return await Comment.countDocuments();
}


async function imageTotalViewsCounter() {
    const result = await Image.aggregate([{
        $group: {
            _id: '1',
            viewsTotal: { $sum: '$views' }
        }
    }])
    if(result.length >  0){
        return result[0].viewsTotal
    }
    return 0;
}


async function imageTotalLikesCounter() {
    const result = await Image.aggregate([{
        $group: {
            _id: '1',
            likesTotal: { $sum: '$likes' }
        }
    }])
    if(result.length >  0){
        return result[0].likesTotal
    }
    return 0;
}


module.exports =  async () => {
    const result = await Promise.all([
        imageCounter(),
        commentCounter(),
        imageTotalViewsCounter(),
        imageTotalLikesCounter()
    ]);
    return {
        images:result[0],
        comments:result[1],
        views:result[2],
        likes:result[3]
    }
}