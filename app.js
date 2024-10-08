import express from 'express';
import whatsappRouter from './src/routes/whatsappRouter.js';
import leadsRouter from './src/routes/leadsRouter.js';
import webRouter from './src/routes/webRouter.js';
import config from './src/config/config.js';
import cookieParser from 'cookie-parser';

const app = express();
const port = config.PORT || 3000;

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

app.use('/whatsapp', whatsappRouter);
app.use('/leads', leadsRouter);
app.use('/webchat', webRouter);

app.get('/chat', (req, res) => {
    if (!req.cookies.user_session) {
        res.cookie('user_session', 'user_' + Date.now(), { expires: new Date(9999, 0, 1), httpOnly: true });
        console.log('Cookie creada');
    } else {
        console.log('Cookie ya existente:', req.cookies.user_session);
    }

    res.redirect('chat.html');
});


const server = app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});

server.on('error', error => console.log(error));
