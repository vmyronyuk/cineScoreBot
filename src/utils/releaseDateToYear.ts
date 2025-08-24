import { TMDBMovie } from '../types/movies'

export function releaseDateToYear(releaseDate: TMDBMovie['release_date']) {
	return releaseDate.split('-')[0]
}
