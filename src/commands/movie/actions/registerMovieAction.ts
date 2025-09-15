import { Context, Telegraf } from 'telegraf'
import { Update } from 'telegraf/typings/core/types/typegram'
import { TMDB_API_KEY } from '../../../bot'
import { supabase } from '../../../config/supabase'
import { saveMovie } from '../../../services/moviesService'
import { TMDBMovie } from '../../../types/movies'
import { releaseDateToYear } from '../../../utils/tmdb/releaseDateToYear'

export async function registerMovieAction(bot: Telegraf<Context<Update>>) {
	bot.action(/movie:(\d+)/, async ctx => {
		const tmdbId = Number(ctx.match[1])
		await ctx.answerCbQuery()

		try {
			await ctx.answerCbQuery()
			let { data: movie } = await supabase
				.from('movies')
				.select('*')
				.eq('tmdbId', tmdbId)
				.single()

			if (!movie) {
				const detailsRes = await fetch(
					`https://api.themoviedb.org/3/movie/${tmdbId}?language=uk-UA&api_key=${TMDB_API_KEY}`
				)
				const tmdbMovie = (await detailsRes.json()) as TMDBMovie

				const release = tmdbMovie.release_date || 'Невідомо'
				const overview = tmdbMovie.overview || 'Опис відсутній'
				const posterUrl = tmdbMovie.poster_path
					? `https://image.tmdb.org/t/p/w500${tmdbMovie.poster_path}`
					: null

				const msg =
					`<strong>${tmdbMovie.title}</strong> (${releaseDateToYear(
						release
					)})\n\n` + `${overview}`

				if (posterUrl) {
					await ctx.replyWithPhoto(posterUrl, {
						caption: msg,
						parse_mode: 'HTML',
					})
				} else {
					await ctx.reply(msg, { parse_mode: 'HTML' })
				}

				await saveMovie(tmdbMovie)
			}
		} catch (error) {
			console.error('Movie error', error)
			await ctx.answerCbQuery('❌ Помилка при отриманні фільму', {
				show_alert: true,
			})
		}
	})
}
