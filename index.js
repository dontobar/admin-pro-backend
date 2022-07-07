require('dotenv').config();
const path = require('path');

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

//Directorio público
app.use(express.static('public'))

//Rutas
app.use('/api/usuarios',require('./routes/usuarios') );
app.use('/api/medicos',require('./routes/medicos') );
app.use('/api/hospitales',require('./routes/hospitales') );
app.use('/api/uploads',require('./routes/uploads') );

app.use('/api/login',require('./routes/auth') );
app.use('/api/todo',require('./routes/busquedas') );

app.get('*',(req,res)=>{
    res.sendFile( path.resolve(__dirname,'public/index.html'));
});


//Rutas
app.get('/',(req,res)=>{

    res.json({
        ok:true,
        msg:'Hola mundo'
    })
});

app.listen(process.env.PORT,()=>{
    console.log('Servidor corriendo en puerto ' + process.env.PORT);
});