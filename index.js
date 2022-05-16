require('dotenv').config();

const express = require('express');
const cors = require('cors')

const { dbConnection } = require('./database/config');

//crear el servidor de express
const app = express();

//configurar CORS
app.use( cors() )

//base de datos
dbConnection();

//usuario y  pass mongo
//usuario : MEAN_HOSPITAL
//pass:LYVpcGnKYIP0e0uk


//Rutas
app.get('/',(req,res)=>{

    res.json({
        ok:true,
        msg:'Hola mundo'
    })
});

app.listen(process.env.PORT,()=>{
    console.log('Servidor corriendo en puerto' + process.env.PORT);
});