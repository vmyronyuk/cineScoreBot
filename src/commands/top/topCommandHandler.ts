import { Context } from 'telegraf'
import { getUsersMovies } from '../../services/usersService'
import { replyHTML } from '../../utils/replyHTML'

export async function topCommandHandler(ctx: Context) {
	try {
		const usersMovies = await getUsersMovies()

		if (!usersMovies.length) {
			return ctx.reply('😕 Не знайдено топ фільмів')
		}

		const moviesMap = new Map<string, { title: string; ratings: number[] }>()

		for (const entry of usersMovies) {
			const id = entry.movie.id
			if (!moviesMap.has(id)) {
				moviesMap.set(id, { title: entry.movie.title, ratings: [entry.rating] })
			} else {
				moviesMap.get(id)!.ratings.push(entry.rating)
			}
		}

		const moviesStats = Array.from(moviesMap.values()).map(m => {
			const avgRating = m.ratings.reduce((a, b) => a + b, 0) / m.ratings.length
			return {
				title: m.title,
				avgRating,
				count: m.ratings.length,
			}
		})

		const topMovies = moviesStats
			.sort((a, b) => b.avgRating - a.avgRating)
			.slice(0, 5)

		await replyHTML(
			ctx,
			'🎬 <strong>Топ-5 фільмів</strong>:\n\n' +
				topMovies
					.map(
						(m, i) =>
							`${i + 1}. <strong>${m.title}</strong> - ${m.avgRating.toFixed(
								1
							)} ⭐️ (${m.count} оцін${
								m.count === 1 ? 'ка' : m.count < 5 ? 'ки' : 'ок'
							})`
					)
					.join('\n')
		)
	} catch (error) {
		console.error('Stats error', error)
		await ctx.reply('❌ Помилка при отриманні статистики')
	}
}
