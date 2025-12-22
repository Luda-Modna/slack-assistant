# Slack AI Assistant – Company Policy Bot

This project is a Slack bot that answers user questions based on a company holiday policy.
The bot loads the policy from a public website and uses the DeepSeek AI API to generate responses.

## Features
- Listens to messages in Slack channels
- Loads and parses company holiday policy from an external website
- Uses an AI model to answer user questions based on the policy text
- Sends responses back to Slack in real time

## Technologies Used
- Node.js
- @slack/bolt
- Axios
- Cheerio
- DeepSeek API (OpenAI-compatible)

## How It Works
1. On application startup, the bot loads the company holiday policy from the website.
2. When a user sends a message in Slack, the bot treats it as a question.
3. The question and policy text are sent to the AI model.
4. The AI-generated answer is posted back to Slack.

## Setup Instructions

1. Clone the repository:
```bash
git clone <your-repository-url>
cd <project-folder>
npm install
Create a .env file with the following variables:
SLACK_BOT_TOKEN=your_slack_bot_token
SLACK_APP_TOKEN=your_slack_app_token
DEEPSEEK_API_KEY=your_deepseek_api_key
npm run dev