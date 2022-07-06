/*
    Ruta:/api/usuarios
*/


const { Router } = require ('express');
const { check } = require('express-validator');
const { validarCampos } = require('../middlewares/validar-campos')

const { getUsuarios,crearUsuarios,actualizarUsuarios,borrarUsuarios } = require('../controllers/usuarios')
const { validarJWT, validarADMIN_ROLE,validarADMIN_ROLE_o_MismoUsuario} = require('../middlewares/validar-jwt')

const router = Router();

router.get('/', validarJWT,getUsuarios);

router.post('/',
[
    check('nombre','El nombre es obligatorio').not().isEmpty(),
    check('password','la contraseña es obligatoria').not().isEmpty(),
    check('email','El email es obligatorio').isEmail(),
    validarCampos
],
crearUsuarios);

router.put('/:id',
[
    validarJWT,
    validarADMIN_ROLE_o_MismoUsuario,
    check('nombre','El nombre es obligatorio').not().isEmpty(),
    check('email','El email es obligatorio').isEmail(),
    check('role','El role es obligatorio').not().isEmpty(),
    validarCampos
    
],
actualizarUsuarios);

router.delete('/:id',
    [validarJWT,validarADMIN_ROLE],
    borrarUsuarios
);







module.exports = router;