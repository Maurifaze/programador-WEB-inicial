var express = require('express');
var router = express.Router();
var novedadesModel = require('../../models/novedadesModel')

router.get('/', async function (req, res, next) {

  var novedades = await novedadesModel.getNovedades();

  res.render('admin/paneladmin', {
    layout: 'admin/layout',
    adminusuario: req.session.nombre,
    novedades
  });
});


router.get('/eliminar/:id', async (req, res, next) => {
  var id = req.params.id;
  await novedadesModel.deleteNovedadesById(id);
  res.redirect('/admin/paneladmin')
});


router.get('/agregar', (req, res, next) => {
  res.render('admin/agregar', {
    layout: 'admin/layout'
  })
});


router.post('/agregar', async (req, res, next) => {
  try {
    if (req.body.tipo != "" && req.body.marca != "" && req.body.descripcion != "" && req.body.precio != "") {
      await novedadesModel.insertNovedad(req.body);
      res.redirect('/admin/paneladmin')
    } else {
      res.render('admin/agreagar', {
        layout: 'admin/layout',
        error: true, message: 'Todos los campos son requeridos'
      })
    }
  } catch (error) {
    console.log(error)
    res.render('admin/agregar', {
      layout: 'admin/layout',
      error: true, message: 'No se cargo la novedad'
    })
  }

})

router.get('/modificar/:id', async (req, res, next) => {
  var id = req.params.id;
  var novedad = await novedadesModel.getNovedadById(id);

  res.render('admin/modificar', {
    layout: 'admin/layout',
    novedad
  });
});

router.post('/modificar', async (req, res, next) => {
  try {
    var obj = {
      foto: req.body.foto,
      tipo: req.body.tipo,
      marca: req.body.marca,
      descripcion: req.body.descripcion,
      precio: req.body.precio
    }

    await novedadesModel.modificarNovedadById(obj, req.body.id);
    res.redirect('/admin/paneladmin');
  }
  catch (error) {
    console.log(error)
    res.render('admin/modificar', {
      layout: 'admin/layout',
      error: true,
      message: 'No se modifico la novedad'
    })
  }
})







module.exports = router;