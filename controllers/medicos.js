const { response } = require('express')
const Hospital = require('../models/hospital')

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

const getMedicoById = async(req,res = response) =>{

    const id = req.params.id;

    try {
     const medico = await Medicos.findById(id)
                                .populate('usuario','nombre img email')
                                .populate('hospital','nombre img')

    res.json({
        ok:true,
        medico
    })
    } catch (error) {
        console.log(error)
        res.json({
            ok:true,
            msg:'Hable con el administrador'
        })
    }


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
            msg:'Hable con el administrador'
        })
    }


}

const actualizarMedico = async(req,res = response) =>{
    const id = req.params.id;
    const uid = req.uid;

try {
    const medicos = await Medicos.findById(id);
    if(!medicos){
        res.status(404).json({
            ok:false,
            msg:'Medico no encontrado por id',
        });
    }

    const cambioMedico = {
        ...req.body,
        usuario:uid,
    }
    const medicoActualizado = await Medicos.findByIdAndUpdate(id,cambioMedico,{new:true})

    res.json({
        ok:true,
        medico:medicoActualizado
    })

    
} catch (error) {
    res.status(500).json({
        ok:false,
        msg:"hable con el administrador"
    })
}
}

const borrarMedico = async(req,res = response) =>{
    const id = req.params.id;

try {
    const medicos = await Medicos.findById(id);
    if(!medicos){
        res.status(404).json({
            ok:false,
            msg:'Medico no encontrado por id',
        });
    }

     await Medicos.findByIdAndDelete(id);

    res.json({
        ok:true,
        msg:"Medico Borrado"
    })

    
} catch (error) {
    res.status(500).json({
        ok:false,
        msg:"hable con el administrador"
    })
}
}


module.exports = {
    getMedicos,
    crearMedico,
    actualizarMedico,
    borrarMedico,
    getMedicoById

}