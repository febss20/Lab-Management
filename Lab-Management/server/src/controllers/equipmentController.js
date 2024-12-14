import asyncHandler from '../middleware/asyncHandler.js';
import { Equipment } from '../schema/equipment.js';
import { LabActivity } from '../schema/labActivity.js';

const getEquipment = asyncHandler (async (req, res) => {
    const { condition, lab_id } = req.query

    let filter = {}

    if(condition){
        filter.condition = condition;
    }

    if(lab_id){
        filter.lab_id = lab_id;
    }


    const equipmentDocs = await Equipment.find(filter);

    res.status(200).send({
        message: 'Data fetch successfull',
        data: equipmentDocs
    });
})

const getEquipmentById = asyncHandler (async (req, res) => {
    const { id } = req.params;

    const equipmentDocs = await Equipment.findOne({_id: id});

    if(!equipmentDocs){
        res.status(404).send({
            message: 'Cannot find any equipment with this id'
        })
        return;
    }

    res.status(200).send({
        message: 'Data fetch successfull',
        data: equipmentDocs
    });
})

const getEquipmentUsageCount = asyncHandler(async (req, res) => {

    const { sort } = req.query;

    let sortDirection = 1;


    if(sort){
        sortDirection = req.query === 'desc' ? -1 : 1;
    }

    const equipmentUsageCounts = await LabActivity.aggregate([
        { $unwind: "$equipment_used" },
        {
            $group: {
                _id: "$equipment_used.equipment_id",
                usageCount: { $sum: 1 },
            },
        },
        {
            $addFields: {
                _id: { $toObjectId: "$_id" },
            },
        },
        {
            $lookup: {
                from: "equipment",
                localField: "_id",
                foreignField: "_id",
                as: "equipmentDetails",
            },
        },
        {
            $project: {
                _id: 0,
                equipmentId: "$_id",
                usageCount: 1,
                equipmentDetails: { $arrayElemAt: ["$equipmentDetails", 0] },
            },
        },
        {   
            // @ts-ignore
            $sort: { usageCount: sortDirection}
        }
    ]);

    res.status(200).json({
        success: true,
        data: equipmentUsageCounts,
    });
});


const editEquipment = asyncHandler (async (req, res) => {
    const { id } = req.params;
    let { last_used, last_maintenance, first_added } = req.body;
    //neeed to parsed, date passed via req.body is a string

    last_used = new Date(last_used);
    last_maintenance = new Date(last_maintenance);
    first_added = new Date(first_added);

    //first check
    if(last_used < first_added){
        return res.status(400).json({ error: 'last_used must be equal to or after first_added' });
    }
    
    if(last_maintenance < first_added){
        return res.status(400).json({ error: 'last_maintenance must be equal to or after first_added' });
    }


    const docs = await Equipment.findOne({_id: id});
    if(!docs){
        res.status(404).send({
            message: 'Cannot find lab with this id'
        })
        return;
    }

    //second check
    if(!('first_added' in req.body)){
        if(last_used < docs.first_added){
            return res.status(400).json({ error: 'last_used must be equal to or after first_added' });
        }
        
        if(last_maintenance < docs.first_added){
            return res.status(400).json({ error: 'last_maintenance must be equal to or after first_added' });
        }
    }


    try{
        const updatedDocs = await Equipment.findOneAndUpdate({_id: id}, req.body, {new: true});

        res.status(200).send({
            message: "Equipment successfully edited",
            data: updatedDocs
        });
    }
    catch{
        res.status(404).send({
            message: "Data not found",
        })
    }
})

const deleteEquipment = asyncHandler (async (req, res) => {
    const { id } = req.params;

    try{
        await Equipment.findOneAndDelete({_id: id}, req.body);
    
        res.status(200).send({
            message: "Equipment successfully deleted",
        });
    }
    catch{
        res.status(404).send({
            message: "Data not found",
        });
    }
})


const addEquipment = asyncHandler (async (req, res) => {
    let { last_used, last_maintenance, first_added } = req.body;
    last_used = new Date(last_used);
    last_maintenance = new Date(last_maintenance);
    first_added = new Date(first_added);

    if(last_used < first_added){
        return res.status(400).json({ error: 'last_used must be equal to or after first_added' });
    }
    if(last_maintenance < first_added){
        return res.status(400).json({ error: 'last_maintenance must be equal to or after first_added' });
    }

    const docs = new Equipment(req.body);
    const newEquipment = await docs.save();

    res.status(201).send({
        message: 'Data added successfully',
        data: newEquipment,
    });
})




export { 
    getEquipmentById, 
    getEquipmentUsageCount, 
    getEquipment, 
    editEquipment, 
    deleteEquipment, 
    addEquipment 
}