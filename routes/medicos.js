/*
 Ruta:/api/medicos

*/



const { Router } = require ('express');
const { check } = require('express-validator');
const { validarCampos } = require('../middlewares/validar-campos')

const { validarJWT} = require('../middlewares/validar-jwt')

const { getMedicos,
        crearMedico,
        actualizarMedico,
        borrarMedico,
        getMedicoById
        } = require('../controllers/medicos')

const router = Router();

router.get('/',validarJWT,getMedicos);

router.post('/',
[
    validarJWT,
    check('nombre','Es Obligatorio el nombre').not().isEmpty(),
    check('hospital','Es Obligatorio el id ').isMongoId(),
    validarCampos
],
crearMedico);

router.put('/:id',
[
    validarJWT,
    check('nombre','Es Obligatorio el nombre').not().isEmpty(),
    check('hospital','Es Obligatorio el id ').isMongoId(),
],
actualizarMedico);

router.delete('/:id',
    validarJWT,
    borrarMedico
);

router.get('/:id',
    validarJWT,
    getMedicoById
);







module.exports = router;