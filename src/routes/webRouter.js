import { Router } from 'express';
import { sendMessage } from '../controllers/webController.js';

const webRouter = Router();

webRouter.post('/', sendMessage);

export default webRouter;