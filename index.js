require('dotenv').config();

const express = require('express');
const cors = require('cors')

const { dbConnection } = require('./database/config');

//crear el servidor de express
const app = express();

//configurar CORS
app.use( cors() )

//lectura y parseo del body
app.use( express.json() );

//base de datos
dbConnection();

//Rutas
app.use('/api/usuarios',require('./routes/usuarios') );
app.use('/api/login',require('./routes/auth') );


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