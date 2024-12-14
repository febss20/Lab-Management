import express from 'express';
import { 
    addLab,
    getLabAll,
    getLabById, 
    getAslabByLab, 
    getAslabByNim, 
    addAslab, 
    editAslab, 
    deleteAslab, 
    editKasublab, 
    editStaff  
} from '../controllers/labController.js'


const router = express.Router();

router.post('/', addLab );
router.get('/', getLabAll);
router.get('/:labId', getLabById);
router.get('/:labId/aslab', getAslabByLab);
router.get('/:labId/aslab/:nim', getAslabByNim);
router.post('/:labId/aslab', addAslab);
router.put('/:labId/aslab/:nim', editAslab);
router.put('/:labId/kasublab/', editKasublab);
router.put('/:labId/staff/', editStaff);
router.delete('/:labId/aslab/:nim', deleteAslab);


export default router;