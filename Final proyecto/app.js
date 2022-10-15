var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

require('dotenv').config();
var session = require ('express-session');
var fileUpload = require ('express-fileupload');


var indexRouter = require('./routes/index'); 
var userRouter = require('./routes/users');
var loginRouter = require('./routes/admin/login');
var guitarrasRouter = require('./routes/guitarras'); 
var bajosRouter = require('./routes/bajos'); 
var bateriasRouter = require('./routes/baterias'); 
var saxosRouter = require('./routes/saxos'); 
var sobrenosotrosRouter = require('./routes/sobrenosotros'); 
var carritoRouter = require('./routes/carrito'); 
var paneladminRouter = require('./routes/admin/paneladmin');
const { secureHeapUsed } = require('crypto');


var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
  secret: 'holasoymauriciofazeuilhe',
  resave: false,
  saveUninitialized: true
}));

secured = async (req, res, next) => {
  try {
    console.log(req.session.id_usuario); 
    if (req.session.id_usuario) {
      next();
    } else {
      res.redirect('/admin/login')
    }
  } catch (error) {
    console.log (error);
  }
}

app.use(fileUpload({
  useTempFiles: true,
  tempFileDir: '/tmp/'
}));


app.use('/', indexRouter);
app.use('/users', userRouter);
app.use('/admin/login', loginRouter);
app.use('/guitarras', guitarrasRouter);
app.use('/bajos', bajosRouter);
app.use('/baterias', bateriasRouter);
app.use('/saxos', saxosRouter);
app.use('/sobrenosotros', sobrenosotrosRouter);
app.use('/carrito', carritoRouter);
app.use('/admin/paneladmin', secured, paneladminRouter);


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
