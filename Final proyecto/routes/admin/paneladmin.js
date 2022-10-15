var express = require('express');
var router = express.Router();
var novedadesModel = require('../../models/novedadesModel');

var util = require('util');
var cloudinary = require('cloudinary').v2;

const uploader = util.promisify(cloudinary.uploader.upload);
const destroy = util.promisify(cloudinary.uploader.destroy);


router.get('/', async function (req, res, next) {
  var novedades = await novedadesModel.getNovedades();

  novedades = novedades.map(novedad => {
    if (novedad.img_id) {
      const foto = cloudinary.image(novedad.img_id, {
        width: 100,
        height: 100,
        crop: 'fill'
      });
      return {
        ...novedad,
        foto
      }
    } else {
      return {
        ...novedad,
        foto: ''
      }
    }
  });


  res.render('admin/paneladmin', {
    layout: 'admin/layout',
    adminusuario: req.session.nombre,
    novedades
  });
});


router.get('/eliminar/:id', async (req, res, next) => {
  var id = req.params.id;

  let novedad = await novedadesModel.getNovedadById(id);
  if (novedad.img_id){
    await (destroy(novedad.img_id));
  }

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

    var img_id = '';
    if (req.files && Object.keys(req.files).length > 0) {
      foto = req.files.foto;
      img_id = (await uploader(foto.tempFilePath)).public_id;
    }


    if (req.body.tipo != "" && req.body.marca != "" && req.body.descripcion != "" && req.body.precio != "") {
      await novedadesModel.insertNovedad({
        ...req.body,
        img_id
      });
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
    let img_id = req.body.img_original;
    let borrar_img_vieja = false;
    if (req.body.img_delete ==="1") {
      img_id = null;
      borrar_img_vieja = true;
    } else {
      if (req.files && Object.keys(req.files).length > 0) {
        foto = req.files.foto;
        img_id = (await
        uploader(foto.tempFilePath)).public_id;
        borrar_img_vieja = true; 
      }
    }
    if (borrar_img_vieja && req.body.img_original) {
      await (destroy(req.body.img_original));
    }


    var obj = {
      /*foto: req.body.foto,*/
      tipo: req.body.tipo,
      marca: req.body.marca,
      descripcion: req.body.descripcion,
      precio: req.body.precio,
      img_id
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