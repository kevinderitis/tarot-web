import { getLeadByChatId, createLead, getAllLeads, getLastPendingLeads } from "../dao/leadDAO.js";

export const formatNumber = number => {
    return `${number}@c.us`;
}

export const formatChatId = chatId => {
    let number = chatId.split("@")[0];
    return number;
}

export const createResponse = async chatId => {
    let number;
    let response;
    let text;
    try {
        console.log(`Buscando lead chatId:  ${chatId}`);
        let lead = await getLeadByChatId(chatId);
        if (lead) {
            number = lead.clientPhone;
            text = 'Veo que ya te comunicaste anteriormente. Te envio el contacto de tu cajero para que te pongas en contacto.';
        } else {
            let clientData = await getNextClient();
            await createLeadService(chatId, clientData.phoneNumber);
            number = clientData.phoneNumber;
            text = `¡Hola! 👋 ¿Estas listo para jugar? Para darte la mejor atención, tenés un cajero personal para hablar con vos. Acá te envío el numero. ¡Mucha suerte! 🍀`;
        }

        response = {
            formated: formatNumber(number),
            number,
            text
        };

        return response;
    } catch (error) {
        throw error;
    }

}

export const createLeadService = async (chatId, threadId) => {
    try {
        let newLead = await createLead(chatId, threadId);
        return newLead;
    } catch (error) {
        throw error;
    }
}

export const getLeads = async filter => {
    try {
        let leads = await getAllLeads(filter);
        return leads;
    } catch (error) {
        throw error;
    }
}

export const getLastPendingLeadsService = async () => {
    try {
        let leads = await getLastPendingLeads();
        return leads;
    } catch (error) {
        throw error;
    }
}

export const getLeadByChatIdService = async chatId => {
    try {
        let leads = await getLeadByChatId(chatId);
        return leads;
    } catch (error) {
        throw error;
    }
}

export const validateLeadPayment = async (chatId) => {
    try {
        let lead = await getLeadByChatId(chatId);

        if (!lead) {
            return false;
        }

        if (!lead.payment) {
            return false;
        }

        const paymentDate = new Date(lead.payment);
        const now = new Date();

        const differenceInMs = now - paymentDate;

        const differenceInHours = differenceInMs / (1000 * 60 * 60);

        if (differenceInHours < 15) {
            console.log('El pago se realizó hace menos de 15 horas.');
            return true;
        } else {
            console.log('El pago se realizó hace más de 15 horas.');
            return false;
        }
    } catch (error) {
        console.log(error);
        throw error;
    }
};
