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
		.select(`userId, rating, movies(runtime)`)
		.eq('userId', userId)

	if (error || !data) {
		return {
			numberOfRatings: 0,
			totalRuntime: 0,
		}
	}

	const numberOfRatings = data.length
	const totalWatchTime = data.reduce(
		(sum, r: any) => sum + (r.movies?.runtime ?? 0),
		0
	)
	const avgRating = (
		data.reduce((sum, r: any) => sum + r.rating, 0) / numberOfRatings
	).toFixed(1)

	return {
		numberOfRatings,
		totalWatchTime,
		avgRating,
	}
}
