import fetch from "node-fetch";
import { sendWhatsAppMessage } from "../services/whatsapp_messaging.js";

export const sendMessage = async(req, res) => {
   
  const interaktApiKey = process.env.INTERAKT_API_KEY;
  const interaktBaseUrl = process.env.INTERAKT_BASE_URL;
  try {
    const { to, message } = req.body;

    console.log(interaktApiKey, interaktBaseUrl);

    

    const data = await sendWhatsAppMessage(to, message, interaktApiKey, interaktBaseUrl);
    console.log(data)


    return res.status(200).json(data);


  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}