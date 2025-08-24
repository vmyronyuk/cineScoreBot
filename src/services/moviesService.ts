import { supabase } from '../config/supabase'
import { Movie } from '../types/movies'

export async function getMovieByTitle(
	title: Movie['title']
): Promise<Movie | null> {
	const { data: movie, error } = await supabase
		.from('movies')
		.select('*')
		.ilike('title', title)
		.single()

	if (error) {
		console.error('Supabase error:', error.message)
		return null
	}

	return movie
}
