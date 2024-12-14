import asyncHandler from '../middleware/asyncHandler.js';
import { Lab } from '../schema/lab.js';


const addLab = asyncHandler(async (req, res) => {
    const labData = req.body;
    const newLab = await Lab.create(labData);
    
    res.status(201).send({
        message: 'Data fetch successfull',
        data: newLab
    });
});

const getLabAll = asyncHandler(async (req, res) => {
    console.log('Fetching labs...'); 
    const labs = await Lab.find();
    res.status(200).send({
      message: 'Data fetch successfull',
      data: labs,
    });
  });

const getLabById = asyncHandler (async (req, res) => {
    const { labId } = req.params;
    const labDocs = await Lab.findOne({lab_id: labId});


    if(!labDocs){
        res.status(404).send({
            message: 'Cannot find lab with this id'
        })
        return;
    }

    res.status(200).send({
        message: 'Data fetch successfull',
        data: labDocs
    });
})

const getAslabByLab = asyncHandler (async (req, res) => {
    const { labId } = req.params;
    const labDocs = await Lab.findOne({lab_id: labId});


    if(!labDocs){
        res.status(404).send({
            message: 'Cannot find lab with this id'
        })
        return;
    }

    if(labDocs.lab_aslab.length == 0){
        res.status(404).send({
            message: 'Cannot find any aslab in this lab'
        })
        return;
    }

    res.status(200).send({
        message: 'Data fetch successfull',
        data: labDocs.lab_aslab
    });
})

const getAslabByNim = asyncHandler (async (req, res) => {
    const { labId, nim } = req.params;
    const labDocs = await Lab.findOne({lab_id: labId});

    const aslabDocs = labDocs.lab_aslab.find((aslab) => {
        return aslab.nim == nim;
    });

    if(!aslabDocs){
        res.status(404).send({
            message: 'Cannot find any aslab with this nim'
        })
        return;
    }

    res.status(200).send({
        message: 'Data fetch successfull',
        data: aslabDocs
    });
})



const addAslab = asyncHandler (async (req, res) => {
    const { labId } = req.params;
    const labDocs = await Lab.findOne({lab_id: labId});

    

    if(!labDocs){
        res.status(404).send({
            message: 'Cannot find lab with this id'
        })
        return;
    }

    const { nim } = req.body;

    const aslabDocs = labDocs.lab_aslab.find((aslab) => {
        return aslab.nim == nim;
    });


    if(aslabDocs){
        res.status(400).send({
            message: 'Aslab with this nim has been created'
        })
        return;
    }
    


    labDocs.lab_aslab.push(req.body);
    await labDocs.save();
    

    res.status(200).send({
        message: 'Data added successfully',
        data: labDocs.lab_aslab[labDocs.lab_aslab.length - 1],
    });
})

const editAslab = asyncHandler (async (req, res) => {
    const { labId, nim } = req.params;
    const labDocs = await Lab.findOne({lab_id: labId});

    if(!labDocs){
        res.status(404).send({
            message: 'Cannot find lab with this id'
        })
        return;
    }

    const aslabIndex = labDocs.lab_aslab.findIndex((aslab) => {
        console.log(aslab.nim, nim)
        return aslab.nim == nim;
    });

    if(aslabIndex == -1){
        res.status(404).send({
            message: 'Cannot find any aslab with this nim'
        })
        return;
    }

    //mongoose docs are not javascript object, without toObject()
    //spread operator below will not work as expected
    //hours wasted: 3
    const aslab = labDocs.lab_aslab[aslabIndex].toObject();
    const body = req.body;

    labDocs.lab_aslab[aslabIndex] = {
        ...aslab,
        ...body
    }


    await labDocs.save();

    res.status(200).send({
        message: 'Data changed successfully',
        data: labDocs.lab_aslab[aslabIndex],
    });
})

const deleteAslab = asyncHandler (async (req, res) => {
    const { labId, nim } = req.params;
    const labDocs = await Lab.findOne({lab_id: labId});

    if(!labDocs){
        res.status(404).send({
            message: 'Cannot find lab with this id'
        })
        return;
    }

    const updatedLab = await labDocs.updateOne({
        $pull: {
            lab_aslab: {nim: nim},
        },
    });


    if (updatedLab.modifiedCount === 0) {
        return res.status(404).send({
            message: 'Cannot find aslab with this nim'
        });
    }

    res.status(200).send({
        message: 'Data deleted successfully',
        data: updatedLab,
    });
})

const editKasublab = asyncHandler (async (req, res) => {
    const { labId } = req.params;
    const labDocs = await Lab.findOne({lab_id: labId});

    if(!labDocs){
        res.status(404).send({
            message: 'Cannot find lab with this id'
        })
        return;
    }

    //now why this not a weird mongoose object wdf, i dont get it
    const kasublab = labDocs.lab_kasublab;
    const body = req.body;

    labDocs.lab_kasublab = {
        ...kasublab,
        ...body
    }

    await labDocs.save();

    res.status(200).send({
        message: 'Data changed successfully',
        data: labDocs.lab_kasublab
    });
})

const editStaff = asyncHandler (async (req, res) => {
    const { labId } = req.params;
    const labDocs = await Lab.findOne({lab_id: labId});

    if(!labDocs){
        res.status(404).send({
            message: 'Cannot find lab with this id'
        })
        return;
    }

    const staff = labDocs.lab_staff;
    const body = req.body;

    labDocs.lab_staff = {
        ...staff,
        ...body
    }

    await labDocs.save();

    res.status(200).send({
        message: 'Data changed successfully',
        data: labDocs.lab_staff
    });
})



export { 
    addLab,
    getLabAll,
    getLabById, 
    getAslabByLab, 
    getAslabByNim, 
    addAslab, 
    editAslab, 
    deleteAslab, 
    editKasublab, 
    editStaff,
}