# Produce Savior - Demo

Upload a photo of your groceries and let AI handle the rest. Receive recipe suggestions and text reminders before your produce expires.

Link to project: https://producesavior.onrender.com/

# How It's Made
Tech used: HTML, CSS, SCSS, JavaScript, Express, Node.js, Multer

APIs: Azure Cognitive Services for image detection, Twilio for SMS texts, and OpenAI for ChatGPT recipe suggestions

## See this project on your own machine:
See below for instructions.

### Install
1. Clone repo
2. run `npm install`

### Things to add
Create a .env file and add the following as key = value
PORT = 8080 (can be any port example: 3000)
OCP_APIM_SUBSCRIPTION_KEY = YOUR AZURE KEY HERE
ACCOUNT_SID = YOUR TWILIO ACCOUNT SID HERE
AUTH_TOKEN = YOUR TWILIO TOKEN HERE
PHONE_NUMBER = YOUR TWILIO PHONE NUMBER HERE
MY_NUMBER = YOUR PHONE NUMBER HERE
OPENAI_API_KEY = YOUR OPENAI KEY HERE

### Usage
run `node server.js`
Navigate to `localhost:8080`