import { Context, Markup } from 'telegraf'
import { TMDB_API_KEY } from '../../bot'
import { TMDBMovie } from '../../types/movies'
import { getTextFromMessage } from '../../utils/getTextFromMessage'
import { replyHTML } from '../../utils/replyHTML'
import { releaseDateToYear } from '../../utils/tmdb/releaseDateToYear'

export async function movieCommandHandler(ctx: Context) {
	const message = getTextFromMessage(ctx.message)
	if (!message) return

	try {
		const args = message.split(' ').slice(1)
		if (args.length < 1) {
			return await replyHTML(
				ctx,
				'Використовуйте команду в такому вигляді: <code>/movie Дюна</code>'
			)
		}

		const title = args.join(' ')

		const searchRes = await fetch(
			`https://api.themoviedb.org/3/search/movie?language=uk-UA&page=1&api_key=${TMDB_API_KEY}&query=${encodeURIComponent(
				title
			)}`
		)
		const searchData = await searchRes.json()

		if (!searchData.results || searchData.results.length === 0) {
			return await ctx.reply('😕 Фільм не знайдено')
		}

		const movies = searchData.results.slice(0, 5) as TMDBMovie[]

		const buttons = movies.map((movie: TMDBMovie) => [
			Markup.button.callback(
				`${movie.title} (${releaseDateToYear(movie.release_date)})`,
				`movie:${movie.id}`
			),
		])

		await ctx.reply(
			'За вашим запитом були знайдені такі фільми:',
			Markup.inlineKeyboard(buttons)
		)
	} catch (error) {
		console.error(error)
		await ctx.reply('Помилка при отримані деталей фільму')
	}
}
