var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');






var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');





var app = express();






// app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());







// view engine setup
app.use(express.static(path.join(__dirname, 'public')))
   .set('views', [
     path.join(__dirname, 'views')
   ])
   .engine('html', require('ejs').renderFile) // npm install ejs --save
   .set('view engine', 'ejs');//chage jade to ejs







app.use('/', indexRouter);
app.use('/users', usersRouter);






/*
const io = require('socket.io')();
var users = 0;

io.on('connection', function (socket) {

  socket.on('connection', function (data) {
    users++;

    io.emit("message", data + " connected"); //push data to webapp

    console.log(`${data} connected (total ${users} users)`)
  });

  socket.on('disconnect', function (data) {
    if(users > 0){
        users--;
        console.log(`${data} disconnected (total ${users} users)`)
    }
  });


  socket.on('update_pos_socket', function(data){
      res_data = {
        "px": data.px,
        "py": data.py,
        "pz": data.pz,
        "type": "to client"
      }
      io.sockets.emit("update_pos_socket", res_data);
  });

})
io.listen(2000);
*/






// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});






// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});






module.exports = app;
