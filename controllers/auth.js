const {response } = require('express');
const bcrypt = require('bcryptjs');
const { generarJWT } = require('../helpers/jwt')
const Usuario = require('../models/usuario');
const { googleVerify } = require('../helpers/google-verify');
const { getMenuFrontEnd } = require('../helpers/menu-frontend');

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
            token,
            menu:getMenuFrontEnd(usuarioDB.role)
        });
        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok:false,
            msg:'hable con el administrador'
        });
    }
 }

 const googleSignIn = async(req,res= response) =>{

    try {
        const {email,name,picture} = await googleVerify(req.body.token);

        const usuarioDB = await Usuario.findOne({email});
        let usuario;

        if(!usuarioDB){
            usuario = new Usuario({
                nombre:name,
                email,
                password:'@@@',
                img:picture,
                google:true
            })
        }else{
            usuario = usuarioDB;
            usuario.google = true;
            //usuario.password = '@@@'
        }

        //Guardar usuario
        await usuario.save();

        //Generar el TOKEN -JWT
        const token = await generarJWT(usuario.id);

        res.json({
            ok:true,
            email,name,picture,
            token,
            menu:getMenuFrontEnd(usuario.role)
            }); 

    } catch (error) {
        console.log(error)
        res.status(400).json({
            ok:false,
            msg:'token de google no es correcto'
            }); 
    }


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
        usuario,
        menu:getMenuFrontEnd(usuario.role)
    })

    
    }
    
        



 module.exports = {
     login,
     googleSignIn,
     renewToken
 }