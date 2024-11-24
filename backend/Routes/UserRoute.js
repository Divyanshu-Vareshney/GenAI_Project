import express from 'express';
import {loginUser, myProfile, verifyUser} from '../Controllers/userControllers.js';
import { isAuth } from '../Middlewares/isAuth.js';
const router=express.Router();

router.post("/login",loginUser);
router.post("/verify",verifyUser);
router.get('/me',isAuth,myProfile);

export default router;