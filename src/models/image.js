const {Schema,model} = require('mongoose');
const path = require('path');
const imageSchema = new Schema({
    title: {type:String},
    description:{type:String},
    filename:{type:String},
    path:{type:String},
    views:{type:Number,default:0},
    likes:{type:Number,default:0},
    fecha_at:{type:Date,default:Date.now}
})

imageSchema.virtual('uniqueId')
    .get(function(){
        return this.filename.replace(path.extname(this.filename),'');
    })

module.exports = model('Image',imageSchema);