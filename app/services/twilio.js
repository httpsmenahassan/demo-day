const accountSid = process.env.ACCOUNT_SID;
const authToken = process.env.AUTH_TOKEN;
const client = require("twilio")(accountSid, authToken);

const sendText = ({name, phoneNumber, food}) => {
    client.messages
    .create({ 
      body: `${name}, your ${food} expires tomorrow!`,
      from: process.env.PHONE_NUMBER,
      // eventually we'll swap out this number for the `+${phoneNumber}` variable 
      to: process.env.MY_NUMBER,
    })
      .then(message => console.log('Message sent', message.sid));
}
// creating the basis of a function that will import into our routes
module.exports = {sendText}