const fs = require('fs');
const path = require('path');

module.exports = {
    name: 'makefaq',
    description: 'Create a new FAQ entry',
    execute(message, args) {
        if (!args.length) {
            return message.reply('Please provide a question and answer in the format `!makefaq {question} : {answer}`');
        }

        const faqPath = path.join(__dirname, '../../data/faq.json');
        const faq = JSON.parse(fs.readFileSync(faqPath, 'utf8'));
        const input = args.join(' ');
        const [question, answer] = input.split(':');

        if (!question || !answer) {
            return message.reply('Please provide a question and answer in the format `!makefaq {question} : {answer}`');
        }

        faq[question.trim().toLowerCase()] = answer.trim();
        fs.writeFileSync(faqPath, JSON.stringify(faq, null, 2));

        message.reply(`FAQ added: ${question} - ${answer}`);
    }
};