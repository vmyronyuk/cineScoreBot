import { VercelRequest, VercelResponse } from '@vercel/node'
import { bot } from '../src/bot'

export default async function handler(req: VercelRequest, res: VercelResponse) {
	if (req.method === 'POST') {
		try {
			await bot.handleUpdate(req.body, res)
		} catch (error) {
			console.error('Bot handler error', error)
			res.status(500).send('Bot handler error')
		}
	} else {
		res.status(200).send('Bot is live')
	}
}
