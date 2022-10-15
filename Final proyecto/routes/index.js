var express = require('express');
var router = express.Router();
var nodemailer = require('nodemailer');
var novedadesModel = require('../models/novedadesModel')
var cloudinary = require('cloudinary').v2;

/* GET home page. */
router.get('/', async function (req, res, next) {

  var novedades = await novedadesModel.getNovedades()


  /*novedades = novedades.splice(0, 5);*/
  
  novedades = novedades.map(novedad => {
    if (novedad.img_id) {
      const foto = cloudinary.url(novedad.img_id, {
        width: 500,
        crop: 'fill'
      });
      return {
        ...novedad,
        foto
      }
    } else {
      return {
        ...novedad,
        foto: '/images/logo.jpg' /*no voy a dejar disponible esta opcion */
      }
    }
  });
  res.render('index', { novedades });
});



router.post('/', async (req, res, next) => {

  console.log(req.body)

  var nombre = req.body.nombre;
  var apellido = req.body.apellido;
  var email = req.body.email;
  var telefono = req.body.telefono;
  var motcontacto = req.body.motcontacto;

  var obj = {
    to: 'maurifaze@gmail.com',
    subject: 'CONTACTO WEB',
    html: nombre + " " + apellido + " Se contacto a travez de la web, este es su email de contacto: " + email + ".<br> El motivo del contacto o consulta es el siguiente: " + motcontacto + ".<br> Su telefono es: " + telefono
  }

  var transport = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    }
  })

  var info = await transport.sendMail(obj);

  res.render('index', {
    message: 'Mensaje enviado correctamente',
  });

});

module.exports = router;
