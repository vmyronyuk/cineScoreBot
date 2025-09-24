import { Context, Telegraf } from 'telegraf'
import { Update } from 'telegraf/typings/core/types/typegram'
import { supabase } from '../../../config/supabase'
import { saveMovie } from '../../../services/moviesService'
import { TMDBMovie } from '../../../types/movies'

export function registerRateAction(bot: Telegraf<Context<Update>>) {
	bot.action(/rate:(\d+):([\d.]+)/, async ctx => {
		const tmdbId = Number(ctx.match[1])
		const rating = parseFloat(ctx.match[2])
		const userId = ctx.from?.id

		await ctx.answerCbQuery('⏳ Зберігаю рейтинг…', { show_alert: false })

		try {
			let { data: movie } = await supabase
				.from('movies')
				.select('*')
				.eq('tmdbId', tmdbId)
				.single()

			if (!movie) {
				const res = await fetch(
					`https://api.themoviedb.org/3/movie/${tmdbId}?language=uk-UA&api_key=${process.env.TMDB_API_KEY}`
				)

				if (!res.ok) throw new Error('TMDB API error')

				const tmdbMovie = (await res.json()) as TMDBMovie
				const newMovie = await saveMovie(tmdbMovie)
				movie = newMovie
			}

			const { data: existing } = await supabase
				.from('user_ratings')
				.select('*')
				.eq('userId', userId)
				.eq('movieId', movie.id)
				.maybeSingle()

			if (existing) {
				await ctx.answerCbQuery('⚠️ Ти вже оцінив цей фільм', {
					show_alert: true,
				})
				return
			}

			await supabase.from('user_ratings').insert({
				userId,
				movieId: movie.id,
				rating,
			})

			await ctx
				.editMessageText(`✅ Рейтинг ${rating} збережено для «${movie.title}»`)
				.catch(() =>
					ctx.reply(`✅ Рейтинг ${rating} збережено для «${movie.title}»`)
				)
		} catch (error) {
			console.error(error)
			await ctx.answerCbQuery('❌ Помилка при збереженні рейтингу', {
				show_alert: true,
			})
		}
	})
}
