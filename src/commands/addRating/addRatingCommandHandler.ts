import { Context, Markup } from 'telegraf'
import { supabase } from '../../config/supabase'
import { getMovieByTitle } from '../../services/moviesService'
import { TMDBMovie } from '../../types/movies'
import { getTextFromMessage } from '../../utils/getTextFromMessage'
import { releaseDateToYear } from '../../utils/releaseDateToYear'
import { replyHTML } from '../../utils/replyHTML'

export async function addRatingCommandHandler(ctx: Context) {
	const TMDB_API_KEY = process.env.TMDB_API_KEY!

	try {
		const message = getTextFromMessage(ctx.message)
		if (!message) return

		const userId = ctx.from?.id

		const args = message.split(' ').slice(1)
		if (args.length < 2) {
			return await replyHTML(
				ctx,
				'Використовуйте команду в такому вигляді: <code>/addRating Залізна людина 9.8</code>'
			)
		}

		const rating = parseFloat(args[args.length - 1])
		const title = args.slice(0, -1).join(' ')

		if (isNaN(rating) || rating < 0 || rating > 10) {
			return await replyHTML(ctx, 'Рейтинг повинен бути числом від 0 до 10 ⚠️')
		}

		const movieDb = await getMovieByTitle(title)

		if (movieDb) {
			await supabase.from('user_ratings').insert({
				userId,
				movieId: movieDb.id,
				rating: rating,
			})

			return await replyHTML(
				ctx,
				`<strong>✅ Рейтинг ${rating} збережено для "${movieDb.title} (${movieDb.releaseDate})"</strong>`
			)
		}

		const res = await fetch(
			`https://api.themoviedb.org/3/search/movie?&language=uk-UA&page=1&api_key=${TMDB_API_KEY}&query=${encodeURIComponent(
				title
			)}`
		)
		const tmdbData = await res.json()

		if (!tmdbData.results || tmdbData.results.length === 0) {
			return await replyHTML(ctx, 'Фільм не знайдено')
		}

		const movies = tmdbData.results.slice(0, 4) as TMDBMovie[]

		const buttons = movies.map((movie: TMDBMovie) => [
			Markup.button.callback(
				`${movie.title} (${releaseDateToYear(movie.release_date)})`,
				`rate:${movie.id}:${rating}`
			),
		])

		await ctx.reply(
			'За вашим запитом були знайдені такі фільми:',
			Markup.inlineKeyboard(buttons)
		)
	} catch (error) {
		console.error(error)
		await ctx.reply('Помилка при додаванні рейтингу')
	}
}
