/*
    Ruta:/api/uploads
*/

const { Router } = require ('express');
const expressfileUpload = require('express-fileupload');


const { validarJWT} = require('../middlewares/validar-jwt')
const { fileupload, retornaImagen } = require('../controllers/uploads')

const router = Router();

router.use(expressfileUpload());


router.put('/:tipo/:id',validarJWT,fileupload);

router.get('/:tipo/:foto',retornaImagen);



module.exports = router;