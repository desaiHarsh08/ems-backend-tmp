import fetch from "node-fetch";

export const sendWhatsAppMessage = async (to, message, interaktApiKey, interaktBaseUrl) => {
    try {
    
        console.log(interaktApiKey, interaktBaseUrl);
    console.log("in service, to =", to);
        const requestBody = {
          countryCode: '+91',
          phoneNumber: to,
          type: 'Template',
          template: {
            name: 'logincode',
            languageCode: 'en',
            headerValues: ['Alert'],
            bodyValues: [message],
          },
          data: {
            message: message,
          },
        };
    
        const response = await fetch(`https://api.interakt.ai/v1/public/message/`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Basic ${interaktApiKey}`,
          },
          body: JSON.stringify(requestBody)
        });
    
        if (!response.ok) {
          const errorResponse = await response.json(); // Log the error response
          throw new Error(`HTTP error! Status: ${response.status}, Message: ${JSON.stringify(errorResponse)}`);
        }
    
        const data = await response.json()
        console.log(data)

        return data;

      } catch (error) {
        console.error(error);
        throw error
      }
}