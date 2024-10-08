import { prepareCards } from '../services/cardServices.js';
import { botMsg } from '../services/gptServices.js';

export const sendMessage = async (req, res) => {
    let messageFrom = req.cookies.user_session;
    let messageBody = req.body.message;

    console.log(`Mensaje: ${messageBody}`)
    console.log(`User: ${messageFrom}`)

    try {
        if (messageFrom) {
            let response = await botMsg(messageBody, messageFrom);

            let cards = prepareCards(response);

            if (cards.length > 1) { 
                response = cards;
            }

            return res.send({ response });
        }
    } catch (error) {
        console.log(error);
        return res.status(500).send(error);
    }


    res.status(200).send('EVENT_RECEIVED');

}