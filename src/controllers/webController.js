import { prepareCards } from '../services/cardServices.js';
import { botMsg } from '../services/gptServices.js';
import { createLeadService, validateLeadPayment } from '../services/leadServices.js';
import { createPaymentPreference } from '../services/mpServices.js';

const unavailableSenders = new Set();

export const sendMessage = async (req, res) => {
    let messageFrom = req.cookies.user_session;
    let messageBody = req.body.message;

    console.log(`Mensaje: ${messageBody}`)
    console.log(`User: ${messageFrom}`)

    try {
        if (messageFrom && !unavailableSenders.has(messageFrom)) {
            console.log('Available sender')
            unavailableSenders.add(messageFrom);
            let response = await botMsg(messageBody, messageFrom);

            let cards = prepareCards(response);

            if (cards.length > 1) {
                response = cards;
            }
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

export const webChat = async (req, res) => {
    const email = req.query.email || req.cookies.user_session;

    if (!email) {
        return res.send({ redirectUrl: 'index.html' });
    }

    try {
        if (!req.cookies.user_session) {
            res.cookie('user_session', email, { expires: new Date(9999, 0, 1), httpOnly: true });
            await createLeadService(email);
        }

        const payment = await validateLeadPayment(email);
        const paymentPreference = await createPaymentPreference(email);

        const redirectUrl = payment ? 'chat.html' : paymentPreference;

        res.send({ redirectUrl });
    } catch (error) {
        console.error(error);
        res.send({ redirectUrl: 'index.html' });
    }
};