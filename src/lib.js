const moment = require('moment');
const helpers =  {};

helpers.timeago  = (fecha_at)=>{
   return moment(fecha_at).startOf('minutes').fromNow();
};

module.exports = helpers;