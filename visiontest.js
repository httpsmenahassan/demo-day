const fetch = require('node-fetch');
const fs = require('fs');
const path = require('path');

// Read the image file as a buffer
const imagePath = path.join(__dirname, 'produce.jpg');
const imageBuffer = fs.readFileSync(imagePath);

// Set the Azure Cognitive Services endpoint URL and headers
const url = "https://eastus.api.cognitive.microsoft.com/vision/v3.2/detect?model-version=latest";
const headers = {
  "Content-Type": "image/jpeg",
  "Ocp-Apim-Subscription-Key": "KEY"
};

// Set the request options
const options = {
  method: 'POST',
  headers: headers,
  body: imageBuffer
};

// Send the HTTP request to the endpoint
fetch(url, options)
  .then(res => res.json())
  .then(jsonResponse => {
    // Do something with the response
    console.log(jsonResponse);
  })
  .catch(error => console.error(error));