import { bot } from './bot'

if (!process.env.VERCEL) {
	bot.launch()
	console.log('🤖 Bot is running locally with long polling')
}
