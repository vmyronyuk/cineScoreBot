import { Context } from 'telegraf'
import { getUserMovies } from '../../services/userService'
import { replyHTML } from '../../utils/replyHTML'

export async function mytopCommandHandler(ctx: Context) {
	const userId = ctx.from?.id!

	try {
		const userMovies = await getUserMovies(userId)

		if (!userMovies.length) {
			return ctx.reply('😕 У тебе ще немає оцінених фільмів')
		}

		const topMovies = userMovies.sort((a, b) => b.rating - a.rating).slice(0, 5)
		await replyHTML(
			ctx,
			'🎬 <strong>Топ-5 переглянутих фільмів</strong>:\n\n' +
				topMovies
					.map(
						(m, i) =>
							`${i + 1}. <strong>${m.movie.title}</strong> - ${m.rating} ⭐️`
					)
					.join('\n')
		)
	} catch (error) {
		console.error('Stats error', error)
		await ctx.reply('❌ Помилка при отриманні статистики')
	}
}
