var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
    res.render('admin/paneladmin', { 
        layout: 'admin/layout',
        adminusuario: req.session.nombre
     });
  });


  module.exports = router;