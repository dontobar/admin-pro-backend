const {response } = require('express');
const bcrypt = require('bcryptjs');
const { generarJWT } = require('../helpers/jwt')
const Usuario = require('../models/usuario');
const { googleVerify } = require('../helpers/google-verify');

 const login = async(req,res= response) =>{

    const { email,password } = req.body;

    try {
        //Verificar email
        const usuarioDB = await Usuario.findOne({email});

        if(!usuarioDB){
            return res.status(404).json({
                ok:false,
                msg:'Email no encontrado'
            });
        }

        //Verificar contraseña
        const validPassword = bcrypt.compareSync( password,usuarioDB.password);

        if(!validPassword){
            res.status(400).json({
                ok:false,
                msg:'Contraseña no valida'
            })

        }

        //Generar el TOKEN -JWT
        const token = await generarJWT(usuarioDB.id)

        res.json({
            ok:true,
            token
        })
        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok:false,
            msg:'hable con el administrador'
        });
    }
 }

 const googleSignIn = async(req,res= response) =>{

    const googleToken = req.body.token;

try {

    await googleVerify(googleToken);

    res.json({
        ok:true,
        msg:'Google Signin',
        googleToken
    });
    
} catch (error) {

    

    res.json({
        ok:false,
        msg:'Token incorrecto'
    });
    
}

     res.status(401).json({
         ok:false,
         msg:'Token no es correcto',
         googleToken
     });
 }

 const renewToken = async(req,res = response) =>{
     const uid = req.uid;


     //Generar el TOKEN - JWT
    const token = await generarJWT(uid)

    //Obtener el usuario por UID
     const usuario = await Usuario.findById(uid)

     
     res.json({
        ok:true,
        token,
        usuario
    })

    
    }
    
        



 module.exports = {
     login,
     googleSignIn,
     renewToken
 }