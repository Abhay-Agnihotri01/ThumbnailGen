import express from 'express';
import { getThumbnailbyId, getUserThumbnails } from '../Controllers/UserController.js';
import protect from '../middleware/auth.js';
const UserRouter=express.Router();

UserRouter.get('/thumbnails',protect, getUserThumbnails);
UserRouter.get('/thumbnail/:id',protect,getThumbnailbyId);

export default UserRouter;