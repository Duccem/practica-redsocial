const { Schema, model } = require('mongoose');
const path = require('path');
const { ObjectId } = Schema;
const imageSchema = new Schema({
    title: { type: String },
    description: { type: String },
    path: { type: String },
    public_id: { type: String },
    user:{type:ObjectId,ref:'User'},
    views: [{ type: ObjectId }],
    likes: [{type:ObjectId}],
    fecha_at: { type: Date, default: Date.now }
});

module.exports = model('Image', imageSchema);