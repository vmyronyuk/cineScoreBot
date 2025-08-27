import { Context, Telegraf } from 'telegraf'
import { Update } from 'telegraf/typings/core/types/typegram'
import { randomCommandHandler } from '../randomCommandHandler'

export function registerRandomAction(bot: Telegraf<Context<Update>>) {
	bot.action('random_movie', async ctx => {
		try {
			await ctx.answerCbQuery()
			await randomCommandHandler(ctx)
		} catch (error) {
			console.error('Random movie error', error)
			await ctx.answerCbQuery('❌ Помилка при  отримані рандомного фільму', {
				show_alert: true,
			})
		}
	})
}
