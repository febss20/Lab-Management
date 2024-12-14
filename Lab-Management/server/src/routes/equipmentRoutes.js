import { 
    getEquipmentById, 
    getEquipment, 
    getEquipmentUsageCount, 
    editEquipment, 
    deleteEquipment, 
    addEquipment 
} from '../controllers/equipmentController.js'
import express from "express";


const router = express.Router();

router.get('/count', getEquipmentUsageCount);
router.get('/:id', getEquipmentById);
router.get('/', getEquipment);
router.post('/', addEquipment);
router.put('/:id', editEquipment);
router.delete('/:id', deleteEquipment);


export default router;