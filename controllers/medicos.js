const { response } = require('express')

const  Medicos  = require('../models/medico')

const getMedicos = async(req,res = response) =>{

    const medicos = await Medicos.find()
                                .populate('usuario','nombre img email')
                                .populate('hospital','nombre img')

    res.json({
        ok:true,
        medicos
    })
}

const crearMedico = async (req,res = response) =>{

    const uid = req.uid
    const medicos = new Medicos({
        usuario:uid,
        ...req.body
    })

    try {

        const MedicoDB = await medicos.save()

        res.json({
            ok:true,
            medicos: MedicoDB
        })
        
    } catch (error) {
        console.log(error)
        res.status(500).json({
            ok:false,
            msg:'Hable con el administrados qlio'
        })
    }


}

const actualizarMedico = (req,res = response) =>{
    res.json({
        ok:true,
        msg:'actualizarMedico'
    })
}

const borrarMedico = (req,res = response) =>{
    res.json({
        ok:true,
        msg:'borrarMedico'
    })
}


module.exports = {
    getMedicos,
    crearMedico,
    actualizarMedico,
    borrarMedico

}