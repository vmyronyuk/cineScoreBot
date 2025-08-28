export function formatRuntime(minutes: number) {
	const hours = Math.floor(minutes / 60)
	const mins = minutes % 60
	return `${hours}г ${mins}хв`
}
