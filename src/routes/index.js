const {Router} = require('express');
const router = Router();
const home = require('../controllers/home');
const user = require('../controllers/user');
const image = require('../controllers/image');
const {verify,logedin} = require('../helpers/verify');
module.exports = app => {
    router.get('/',verify,home.index);
    router.get('/login',logedin,home.signin);
    router.get('/signup',home.signup);
    router.get('/images/:image_id',verify,image.index);
    router.get('/profile/:username',verify,user.profile);
    router.get('/logout',verify,home.logout);
    router.get('/edit/:username',verify,user.edit);
    router.post('/user/update',verify,user.update);
    router.post('/user/signup',user.signup);
    router.post('/user/login',user.signin);
    router.post('/images',verify,image.create);
    router.post('/images/:image_id/like',verify,image.like);
    router.post('/images/:image_id/comment',verify,image.comment);
    router.delete('/images/:image_id',verify,image.delete);
    

    app.use(router)
};