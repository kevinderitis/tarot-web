import { saveLeadPayment } from '../dao/leadDAO.js';
import { getPaymentByReference } from '../services/mpServices.js';

export const webhook = async (req, res) => {
    let data = req.query;
    let paymentId = data['data.id'];

    if (!paymentId) {
        console.log('No se proporcionó paymentId en la solicitud.');
        return res.status(400).send('Falta el parámetro paymentId en la solicitud.');
    }

    try {
        let payment = await getPaymentByReference(paymentId);
        if (payment && payment.status === 'approved') {
            let chatId = payment.external_reference;
            if (chatId) {
                await saveLeadPayment(chatId);
                console.log(`Se confirmo pago para: ${chatId}`)
            }
        }
        console.log(payment);
    } catch (error) {
        console.log(error);
        throw error;
    }

    res.send('ok');
};