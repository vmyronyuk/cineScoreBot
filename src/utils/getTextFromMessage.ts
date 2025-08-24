import { Message } from 'telegraf/typings/core/types/typegram'

export function getTextFromMessage(
	message: Message | undefined
): string | null {
	if (message && 'text' in message && typeof message.text === 'string') {
		return message.text
	}
	return null
}
