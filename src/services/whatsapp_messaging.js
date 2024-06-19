import fetch from "node-fetch";

export const sendWhatsAppMessage = async (to, messageArr = [], interaktApiKey, interaktBaseUrl, templateName = 'logincode') => {
  console.log(to, messageArr, interaktApiKey, interaktBaseUrl, templateName);
  try {
    const requestBody = {
      countryCode: '+91',
      phoneNumber: to,
      type: 'Template',
      template: {
        name: templateName,
        languageCode: 'en',
        headerValues: ['Alert'],
        bodyValues: messageArr,
      },
      data: {
        message: '',
      },
    };
    // 
    console.log(JSON.stringify(requestBody));
    const response = await fetch(`https://api.interakt.ai/v1/public/message/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Basic ${interaktApiKey}`,
      },
      body: JSON.stringify(requestBody)
    });

    console.log('Response Status:', response.status);
    console.log('Response Headers:', response.headers.raw());
    // const responseBody = await response.text();
    // console.log('Response Body:', responseBody);
    if (!response.ok) {
      const errorResponse = await response.json(); // Log the error response
      throw new Error(`HTTP error! Status: ${response.status}, Message: ${JSON.stringify(errorResponse)}`);
    }

    const data = await response.json()
    console.log(data)

    return data;

  } catch (error) {
    console.error(error.message);
    throw error
  }
}