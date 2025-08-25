import { Context, Markup } from 'telegraf'
import { TMDB_API_KEY } from '../../bot'
import { saveMovie } from '../../services/moviesService'
import { TMDBMovie } from '../../types/movies'
import { replyHTML } from '../../utils/replyHTML'

export async function randomCommandHandler(ctx: Context) {
	try {
		const randomPage = Math.floor(Math.random() * 500) + 1

		const url = new URL('https://api.themoviedb.org/3/discover/movie')
		url.search = new URLSearchParams({
			api_key: TMDB_API_KEY,
			page: String(randomPage),
			language: 'uk-UA',
			sort_by: 'popularity.desc',
			'vote_average.gte': '6',
			'vote_count.gte': '100',
		}).toString()

		const res = await fetch(url.toString())

		const tmdbData = await res.json()

		if (!tmdbData.results || tmdbData.results.length === 0) {
			return await replyHTML(ctx, 'Фільм не знайдено')
		}

		const randomMovie = tmdbData.results[
			Math.floor(Math.random() * tmdbData.results.length)
		] as TMDBMovie

		const movieTitle = randomMovie.title
		const movieOverview = randomMovie.overview
		const posterUrl = randomMovie.poster_path
			? `https://image.tmdb.org/t/p/w500${randomMovie.poster_path}`
			: null

		const message = `<b>${movieTitle}</b>\n\n${movieOverview}`

		if (posterUrl) {
			await ctx.replyWithPhoto(posterUrl, {
				caption: message,
				parse_mode: 'HTML',
				reply_markup: Markup.inlineKeyboard([
					Markup.button.switchToChat('🔗 Поділитись', movieTitle),
				]).reply_markup,
			})
		} else {
			await ctx.reply(message, {
				parse_mode: 'HTML',
				reply_markup: Markup.inlineKeyboard([
					Markup.button.switchToChat('🔗 Поділитись', movieTitle),
				]).reply_markup,
			})
		}

		await saveMovie(randomMovie)
	} catch (error) {
		console.error(error)
		ctx.reply('Сталася помилка при отриманні випадкового фільму ⚠️ ')
	}
}
