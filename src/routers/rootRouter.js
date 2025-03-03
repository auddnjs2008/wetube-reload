import express from 'express';
import {  home,search } from '../controllers/videoController';
import { getJoin,postJoin, getLogin, postLogin } from '../controllers/userController';
import { publicOnlyMiddleware } from '../middleware';
const rootRouter = express.Router();


rootRouter.get('/',home);
rootRouter.route('/join').all(publicOnlyMiddleware).get(getJoin).post(postJoin);
rootRouter.route('/login').all(publicOnlyMiddleware).get(getLogin).post(postLogin);
rootRouter.get('/search',search);


export default rootRouter;