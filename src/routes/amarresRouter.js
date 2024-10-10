import { Router } from 'express';
import { sendAmarresMessage, webChatAmarres } from '../controllers/amarresController.js';

const amarresRouter = Router();

amarresRouter.post('/', sendAmarresMessage);

amarresRouter.get('/chat', webChatAmarres);

export default amarresRouter;