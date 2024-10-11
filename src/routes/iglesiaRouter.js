import { Router } from 'express';
import { sendIglesiaMessage, webChatIglesia } from '../controllers/iglesiaController.js';

const iglesiaRouter = Router();

iglesiaRouter.post('/', sendIglesiaMessage);

iglesiaRouter.get('/chat', webChatIglesia);

export default iglesiaRouter;