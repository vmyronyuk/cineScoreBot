import { VercelRequest, VercelResponse } from '@vercel/node'
import { bot } from '../src/bot'

export default async function handler(req: VercelRequest, res: VercelResponse) {
	if (req.method === 'POST') {
		try {
			await bot.handleUpdate(req.body)
			return res.status(200).send('OK')
		} catch (err) {
			console.error('Webhook error', err)
			return res.status(500).send('Error')
		}
	} else {
		return res.status(200).send('Bot is running')
	}
}
