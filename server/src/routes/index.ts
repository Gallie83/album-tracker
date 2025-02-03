import { Router } from "express";
import authRoutes from './authRoutes'
import albumRoutes from './albumRoutes'

const router = Router();

router.use('/auth', authRoutes);
router.use('/album', albumRoutes);

export default router;