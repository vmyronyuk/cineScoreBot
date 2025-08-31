import { supabase } from '../config/supabase'
import { User } from '../types/user'

export async function createUserIfNotExist(
	userId: number,
	username: string,
	userFirstName: string
) {
	const { data: user, error } = await supabase
		.from('users')
		.select('*')
		.eq('id', userId)
		.single()

	if (!user) {
		await supabase.from('users').insert({ id: userId, username, userFirstName })
	}

	return user as User
}

export async function getUserStats(userId: number) {
	const { data, error } = await supabase
		.from('user_ratings')
		.select(`userId, rating, movies (runtime, title, releaseDate)`)
		.eq('userId', userId)

	if (error || !data) {
		return {
			numberOfRatings: 0,
			totalRuntime: 0,
			avgRating: 0,
			mostRatedMovie: null,
		}
	}

	const normalized = data.map((r: any) => ({
		...r,
		movie: Array.isArray(r.movies) ? r.movies[0] : r.movies,
	}))

	const numberOfRatings = data.length

	const totalWatchTime = data.reduce(
		(sum, r: any) => sum + (r.movies?.runtime ?? 0),
		0
	)
	const avgRating = (
		data.reduce((sum, r: any) => sum + r.rating, 0) / numberOfRatings
	).toFixed(1)

	const mostRatedMovie = normalized.reduce((prev, curr: any) => {
		if (curr.rating > prev.rating) {
			return curr
		}
		return prev
	})

	const mostRatedMovieTitle = mostRatedMovie.movie?.title ?? null

	const lowestRatedMovie = normalized.reduce((prev, curr: any) => {
		if (curr.rating < prev.rating) {
			return curr
		}
		return prev
	})

	const lowestRatedMovieTitle = lowestRatedMovie.movie?.title ?? null

	return {
		numberOfRatings,
		totalWatchTime,
		avgRating,
		mostRatedMovieTitle,
		lowestRatedMovieTitle,
	}
}
