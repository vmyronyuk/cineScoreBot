import { Context, Telegraf } from 'telegraf'
import { Update } from 'telegraf/typings/core/types/typegram'
import { supabase } from '../../../config/supabase'
import { TMDBMovie } from '../../../types/movies'

export function registerRateAction(bot: Telegraf<Context<Update>>) {
	bot.action(/rate:(\d+):([\d.]+)/, async ctx => {
		const tmdbId = Number(ctx.match[1])
		const rating = parseFloat(ctx.match[2])
		const userId = ctx.from?.id

		try {
			let { data: movie, error } = await supabase
				.from('movies')
				.select('*')
				.eq('tmdbId', tmdbId)
				.single()

			if (!movie) {
				const res = await fetch(
					`https://api.themoviedb.org/3/movie/${tmdbId}?language=uk-UA&api_key=${process.env.TMDB_API_KEY}`
				)

				const tmdbMovie = (await res.json()) as TMDBMovie

				const { data: newMovie, error: insertError } = await supabase
					.from('movies')
					.insert({
						tmdbId: tmdbMovie.id,
						title: tmdbMovie.title,
						overview: tmdbMovie.overview,
						releaseDate: tmdbMovie.release_date,
						posterUrl: tmdbMovie.poster_path,
					})
					.select('*')
					.single()

				if (insertError) throw insertError
				movie = newMovie
			}

			await supabase.from('user_ratings').insert({
				userId,
				movieId: movie.id,
				rating,
			})

			await ctx.editMessageText(
				`✅ Рейтинг ${rating} збережено для "${movie.title}"`
			)
		} catch (error) {
			console.error(error)
			await ctx.answerCbQuery('❌ Помилка при збереженні рейтингу', {
				show_alert: true,
			})
		}
	})
}
