import { Context } from 'telegraf'
import { ExtraReplyMessage } from 'telegraf/typings/telegram-types'

export async function replyHTML(
	ctx: Context,
	text: string,
	extra?: Partial<ExtraReplyMessage>
) {
	await ctx.reply(text, {
		parse_mode: 'HTML',
		...extra,
	})
}
