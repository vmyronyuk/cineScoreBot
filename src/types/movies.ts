export type TMDBMovie = {
	adult: boolean
	id: number
	overview: string
	poster_path: string
	title: string
	release_date: string
}

export type Movie = {
	id: number
	tmdbId: number
	title: string
	overview: string
	releaseDate: string
	posterUrl: string
	voteAvg: number
	voteCount: number
	createdAt: Date
}
