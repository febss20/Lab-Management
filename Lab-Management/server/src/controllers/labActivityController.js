import asyncHandler from '../middleware/asyncHandler.js';
import { LabActivity } from '../schema/labActivity.js';

const getActivity = asyncHandler (async (req, res) => {
    const { activity_type } = req.query;

    let filter = {};

    if(activity_type){
        filter.activity_type = activity_type;
    }

    const activityDocs = await LabActivity.find(filter);
    

    res.status(200).send({
        message: 'Data fetch successfull',
        data: activityDocs
    });
})

const getActivityById = asyncHandler (async (req, res) => {
    const { id } = req.params;

    const activityDocs = await LabActivity.findOne({_id: id});

    if(!activityDocs){
        res.status(404).send({
            message: 'Cannot find any activity with this id'
        })
        return;
    }
    res.status(200).send({
        message: 'Data fetch successfull',
        data: activityDocs
    });
})

const getActivityByLab = asyncHandler (async (req, res) => {
    const { labId } = req.params;

    try{
        const activityDocs = await LabActivity.findById({labId});

        res.status(200).send({
            message: 'Data fetch successfull',
            data: activityDocs
        });
    }
    catch(err){
        res.status(404).send({
            message: 'Cannot find any activity with this id'
        })
        return;
    }
    
    res.status(500).send({
        message: 'Something went wrong'
    })
    return;
})

const addActivity = asyncHandler (async (req, res) => {
    let { start_time, end_time } = req.body;

    start_time = new Date(start_time);
    end_time = new Date(end_time);


    if(end_time < start_time){
        return res.status(400).json({ error: 'end_time must be equal to or after start_time' });
    }

    const newActivity = new LabActivity(req.body);
    await newActivity.save();

    res.status(200).send({
        message: 'Data added successfully',
        data: newActivity,
    });
})

const editActivity = asyncHandler (async (req, res) => {
    const { id } = req.params;

    let { start_time, end_time } = req.body;
    //neeed to parsed, date passed via req.body is a string

    start_time = new Date(start_time);
    end_time = new Date(end_time);

    if(end_time < start_time){
        return res.status(400).json({ error: 'end_time must be equal to or after start_time' });
    }


    const docs = await LabActivity.findOne({_id: id});
    if(!docs){
        res.status(404).send({
            message: 'Cannot find lab with this id'
        })
        return;
    }


    try{
        const updatedDocs = await LabActivity.findOneAndUpdate({_id: id}, req.body, {new: true});

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



const deleteActivity = asyncHandler (async (req, res) => {
    const { id } = req.params;

    try{
        await LabActivity.findOneAndDelete({_id: id}, req.body);
    
        res.status(200).send({
            message: "Activity successfully deleted",
        });
    }
    catch{
        res.status(404).send({
            message: "Data not found",
        });
    }
})



export { 
    getActivityById, 
    getActivityByLab, 
    getActivity, 
    addActivity, 
    editActivity, 
    deleteActivity, 
}