const {response} = require ('express');
const bcrypt = require ('bcryptjs');

const Usuario = require ('../models/usuario');
const { generarJWT } = require('../helpers/jwt')


const getUsuarios = async(req,res)=>{

    const desde = Number(req.query.desde) || 0;

 const [usuario,total] = await Promise.all([
    Usuario
        .find({},'nombre email role google img')
        .skip(desde)
        .limit(5),

    Usuario.count()

 ]);

    res.json({
        ok:true,
        usuario,
        total
        //uid:req.uid  con esto podemos tener el uid del usuario 
    });
}

const crearUsuarios = async(req,res= response)=>{

   const { email,password} = req.body;


   try {

    const existeEmail = await Usuario.findOne({ email});

    if(existeEmail){
        return res.status(400).json({
            ok:false,
            msg:'El correo ya esta registrado'
        });
    }

    const usuario = new Usuario (req.body);

    //Encriptar contraseña
    const salt = bcrypt.genSaltSync();
    usuario.password = bcrypt.hashSync(password,salt);

    //Guardar Usuario
    await usuario.save();
 
    //Generar JWT
    const token = await generarJWT(usuario.id)
 
     res.json({
         ok:true,
         usuario,
         token
     });
       
    } catch (error) {
       console.log(error);
       res.status(500).json({
           ok:false,
           msg:'Error inesperado... revisar logs'
       })
       
    }


    }

    const actualizarUsuarios = async(req,res = response)=>{

        //TODO:Validar token y comprobar si es el usuario correcto

        const uid = req.params.id;

        try {

            const usuarioDB = await Usuario.findById( uid);
            if(!usuarioDB){
                return res.status(404).json({
                    ok:false,
                    msg:'No existe el usuario por ese id'
                });
            }

            //Actualizacion
            const { password,google,email,...campos} = req.body;

            if(usuarioDB.email !== email ){
               
            
               const existeEmail = await Usuario.findOne({email});
               if(existeEmail){
                   return res.status(400).json({
                       ok:false,
                       msg:'Ya existe un usuario con ese email'
                   });
               } 
            }

            campos.email = email
            const usuarioActualizado = await Usuario.findByIdAndUpdate(uid, campos, {new:true});


            res.json({
                ok:true,
                usuario:usuarioActualizado
            })
            
        }catch (error) {
            console.log(error);
            res.status(500).json({
                ok:false,
                msg:'Error inesperado'
            })
            
         }
    }

    const borrarUsuarios= async(req,res = response)=>{

        const uid = req.params.id;

        try {

            const usuarioDB = await Usuario.findById( uid);
            if(!usuarioDB){
                return res.status(404).json({
                    ok:false,
                    msg:'No existe el usuario por ese id'
                });
            }

            //DELETE
            await Usuario.findByIdAndDelete(uid);

            res.json({
                ok:true,
                msg:'Usuario eliminado'
            });
            
        }catch (error) {
            console.log(error);
            res.status(500).json({
                ok:false,
                msg:'Error inesperado para borrar usuarios'
            })
            
         }
    }



module.exports = {
    getUsuarios,
    crearUsuarios,
    actualizarUsuarios,
    borrarUsuarios
}