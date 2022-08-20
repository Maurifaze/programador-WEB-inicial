var express = require('express');
var router = express.Router();
var nodemailer = require('nodemailer');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
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
