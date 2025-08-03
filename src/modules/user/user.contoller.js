import {Router} from 'express';
import * as userServices from './user.service.js';

const router = Router();


router.get("/", userServices.getUsers);
router.get("/profile/:id", userServices.getProfile);

export default router;