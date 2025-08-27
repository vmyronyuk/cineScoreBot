import { TMDB_API_KEY } from '../../bot'

export function buildTMDBUrl(
	endpoint: string,
	params: Record<string, string>
): string {
	const url = new URL(`https://api.themoviedb.org/3/${endpoint}`)
	url.search = new URLSearchParams({
		api_key: TMDB_API_KEY,
		language: 'uk-UA',
		...params,
	}).toString()
	return url.toString()
}
