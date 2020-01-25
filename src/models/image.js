const {Schema,model} = require('mongoose');
const path = require('path');
const imageSchema = new Schema({
    title: {type:String},
    description:{type:String},
    path:{type:String},
    public_id:{type:String},
    views:{type:Number,default:0},
    likes:{type:Number,default:0},
    fecha_at:{type:Date,default:Date.now}
});

module.exports = model('Image',imageSchema);