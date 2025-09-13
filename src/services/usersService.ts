import { supabase } from '../config/supabase'

export async function getUsersMovies() {
	const { data, error } = await supabase
		.from('user_ratings')
		.select('rating, movies (id, title, releaseDate)')

	if (error || !data) {
		return []
	}

	return data.map((r: any) => ({
		...r,
		movie: Array.isArray(r.movies) ? r.movies[0] : r.movies,
	}))
}
