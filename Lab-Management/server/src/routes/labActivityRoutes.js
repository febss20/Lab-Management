import express from 'express';
import { 
    getActivityById, 
    getActivityByLab, 
    getActivity, 
    addActivity, 
    editActivity, 
    deleteActivity, 
} from '../controllers/labActivityController.js'


const router = express.Router();

router.get('/', getActivity);
router.get('/:id', getActivityById);
router.get('/lab/:labId', getActivityByLab);
router.post('/', addActivity);
router.put('/:id', editActivity);
router.delete('/:id', deleteActivity);


export default router;