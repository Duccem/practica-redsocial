const {Schema,model} = require('mongoose');
const {ObjectId} = Schema;

const commentSchema = new Schema({
    comment:{type:String},
    user:{type:ObjectId,ref:'User'},
    fecha_at:{type:Date,default:Date.now},
    image_id:{type:ObjectId}
});
commentSchema.virtual('image')
    .set(function(image){
        this._image  = image;
    })
    .get(function(){
        return this._image;
    })
module.exports = model('Comment', commentSchema);