import { Router } from 'express';
import { sendMessage, webChat } from '../controllers/webController.js';

const webRouter = Router();

webRouter.post('/', sendMessage);

webRouter.get('/chat', webChat);

export default webRouter;