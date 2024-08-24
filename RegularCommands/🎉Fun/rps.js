const choices = ['rock', 'paper', 'scissors'];

module.exports = {
	name: 'rps',
	aliases: ['rps'],
	description: 'Play Rock-Paper-Scissors.',
	execute(msg, args) {
		if (!args.length) {
			return msg.reply('You need to provide a choice!');
		}

		const choice = args[0].toLowerCase();
		if (!choices.includes(choice)) {
			return msg.reply('Invalid choice. Please choose Rock, Paper, or Scissors.');
		}

		const response = choices[Math.floor(Math.random() * choices.length)];

		let result;
		if (choice === response) {
			result = 'A tie!';
		} else if ((choice === 'rock' && response === 'scissors') ||
			(choice === 'paper' && response === 'rock') ||
			(choice === 'scissors' && response === 'paper')) {
			result = 'You win!';
		} else {
			result = 'I win!';
		}

		return msg.reply(`${response.charAt(0).toUpperCase() + response.slice(1)}! ${result}`);
	}
};