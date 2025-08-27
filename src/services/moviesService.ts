import { supabase } from '../config/supabase'
import { Movie, TMDBMovie } from '../types/movies'

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

export async function saveMovie(movie: TMDBMovie) {
	const { data: newMovie } = await supabase
		.from('movies')
		.insert({
			tmdbId: movie.id,
			title: movie.title,
			overview: movie.overview,
			releaseDate: movie.release_date,
			posterUrl: movie.poster_path,
			runtime: movie.runtime,
		})
		.select('*')
		.single()

	return newMovie
}
