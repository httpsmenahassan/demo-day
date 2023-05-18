require("dotenv").config();
const apiUrl = 'https://api.openai.com/v1/models/text-davinci-003';


const { Configuration, OpenAIApi } = require('openai')

async function openAI() {
    const configuration = new Configuration({
        apiKey: process.env.OPENAI_API_KEY,
    });
    const openai = new OpenAIApi(configuration);
    const foods = ['apples', 'orange', 'sugar', 'flour']
    let prompt = 'Give me a recipe using only these ingredients:'
    foods.forEach(food => prompt += food + ',')
    console.log(prompt)
    const completion = await openai.createChatCompletion({
        model: "gpt-3.5-turbo",
        messages: [{role: "user", content: prompt}],
      });
      console.log(completion.data.choices[0].message);
}

openAI()

// checkboxes next to foods of allFoods page
// submit what foods they'd like to get a recipe for
// if they check multiple checkboxes, they'll get an array (if only one item is included add extra conditional to make it an array)
// sub line 12 with array
// put recipe in <pre> tag or something similar that respects line breaks
// res.render() -- console.log(completion.data.choices[0].message);


