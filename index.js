const { App } = require('@slack/bolt');
const OpenAI = require('openai');
const axios = require('axios');
const cheerio = require('cheerio');
require('dotenv').config();

const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  appToken: process.env.SLACK_APP_TOKEN,
  socketMode: true,
});

const deepseek = new OpenAI({
  baseURL: 'https://api.deepseek.com',
  apiKey: process.env.DEEPSEEK_API_KEY,
});

let companyPolicyText = '';

async function loadCompanyPolicy () {
  try {
    const response = await axios.get(
      'https://resources.workable.com/company-holiday-policy'
    );

    const $ = cheerio.load(response.data);

    companyPolicyText = $('body').text();
  } catch (error) {
    companyPolicyText = '';

    console.error(error.message);
  }
}

async function askDeepSeek (question) {
  if (!companyPolicyText)
    return 'Sorry, the company policy has not been loaded yet or an error occurred during loading.';

  try {
    const completion = await deepseek.chat.completions.create({
      model: 'deepseek-chat',
      messages: [
        { role: 'system', content: 'You are a helpful assistant.' },
        {
          role: 'user',
          content: ` ${companyPolicyText} ${question}`,
        },
      ],
    });

    return completion.choices[0].message.content;
  } catch (err) {
    console.error('DeepSeek API error:', err.response?.data || err.message);

    await say(
      'There was a problem contacting the DeepSeek API. ' +
        'Please try again later or rephrase your question.'
    );
    return null;
  }
}

app.message(async ({ message, say }) => {
  if (!message.text || message.subtype === 'bot_message') return;

  const userQuestion = message.text.trim();
  await say(`Processing your question: "${userQuestion}"...`);

  const answer = await askDeepSeek(userQuestion);
  await say(`Answer: ${answer}`);
});

(async () => {
  await loadCompanyPolicy();

  await app.start();
})();
