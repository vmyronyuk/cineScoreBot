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
