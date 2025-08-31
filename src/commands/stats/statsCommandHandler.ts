import { Context } from 'telegraf'
import { getUserStats } from '../../services/userService'
import { replyHTML } from '../../utils/replyHTML'
import { formatRuntime } from '../../utils/tmdb/formatRuntime'

export async function statsCommandHandler(ctx: Context) {
	const userId = ctx.from?.id!

	try {
		const userStats = await getUserStats(userId)

		await replyHTML(
			ctx,
			`🎬 Оцінено фільмів: <strong>${
				userStats.numberOfRatings
			}</strong>\n⭐️ Середня оцінка: <strong>${
				userStats.avgRating
			}</strong>\n🏆Найвища оцінка: <strong>${
				userStats.mostRatedMovieTitle
			}</strong>\n🤮 Найнижча оцінка: <strong>${
				userStats.lowestRatedMovieTitle
			}</strong>\n⏳ Загальна тривалість перегляду: <strong>${formatRuntime(
				userStats.totalWatchTime as number
			)}</strong>`
		)
	} catch (error) {
		console.error('Stats error', error)
		await ctx.reply('❌ Помилка при отриманні статистики')
	}
}
