import {Router} from 'express';
import * as blogServices from './blog.service.js';

const router = Router();


router.post("/add", blogServices.addBlog );
router.delete("/delete/:id", blogServices.deleteBlog );
router.put("/update/:id", blogServices.updateBlog);



export default router;