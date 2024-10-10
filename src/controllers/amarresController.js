import config from '../config/config.js';
import { amarresBotMsg } from '../services/gptServices.js';
import { createLeadService } from '../services/leadServices.js';

const unavailableSenders = new Set();

export const sendAmarresMessage = async (req, res) => {
    let messageFrom = req.cookies.user_session;
    let messageBody = req.body.message;

    console.log(`Mensaje: ${messageBody}`)
    console.log(`User: ${messageFrom}`)

    try {
        if (messageFrom && !unavailableSenders.has(messageFrom)) {
            console.log('Available sender')
            unavailableSenders.add(messageFrom);

            let response = await amarresBotMsg(messageBody, messageFrom);

            unavailableSenders.delete(messageFrom);
            return res.send({ response });
        }
    } catch (error) {
        console.log(error);
        return res.status(500).send(error);
    }

    unavailableSenders.delete(messageFrom);
    res.status(200).send({ response: "Aguardame un minuto por favor" });

};

export const webChatAmarres = async (req, res) => {
    const email = req.query.email || req.cookies.user_session;

    if (!email) {
        return res.send({ redirectUrl: 'amarres.html' });
    }

    try {
        if (!req.cookies.user_session) {
            res.cookie('user_session', email, { expires: new Date(9999, 0, 1), httpOnly: true });
            await createLeadService(email);
        }

        const redirectUrl = 'amarres-chat.html';

        res.send({ redirectUrl });
    } catch (error) {
        console.error(error);
        res.send({ redirectUrl: 'index.html' });
    }
};