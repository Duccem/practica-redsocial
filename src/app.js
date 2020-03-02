//modulos npm
const express = require('express');
const path = require('path');
const exphbs = require('express-handlebars');
const multer = require('multer');
var cookieParser = require('cookie-parser');

//modulos personales
const routes = require('./routes');

//incializando el objeto del servidor
const app = express();
require('./database');

//config
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname,'./views'));
app.engine('.hbs',exphbs({
    defaultLayout: 'main',
    partialsDir:path.join(app.get('views'),'partials'),
    layoutsDir:path.join(app.get('views'),'layouts'),
    extname:'.hbs',
    helpers: require('./lib')
}));
app.set('view engine', '.hbs');
const storage = multer.diskStorage({//manejador de archivos como imagenes
    destination: path.join(__dirname,'public/img/uploads'),
    filename: (req,file,cb)=>{
        cb(null,new Date().getTime()+path.extname(file.originalname));
    }
});


//midlewares
app.use('/public',express.static(path.join(__dirname,'./public')));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({extended:false}));

app.use('/user/update',multer({storage}).single('image'));
app.use('/user/signup',multer({storage}).single('image'));
app.use('/images',multer({storage}).single('image'));


//routes
routes(app);

module.exports = app;