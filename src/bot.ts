import dotenv from 'dotenv'
import { Telegraf } from 'telegraf'
import { registerRateAction } from './commands/addRating/actions/registerRateAction'
import { addRatingCommandHandler } from './commands/addRating/addRatingCommandHandler'
import { registerRandomAction } from './commands/random/actions/registerRandomAction'
import { randomCommandHandler } from './commands/random/randomCommandHandler'
import { statsCommandHandler } from './commands/stats/statsCommandHandler'
import { topCommandHandler } from './commands/top/topCommandHandler'

dotenv.config()

export const bot = new Telegraf(process.env.BOT_TOKEN!)
export const TMDB_API_KEY = process.env.TMDB_API_KEY!

bot.start(ctx => ctx.reply('Hello!'))

bot.command('addRating', addRatingCommandHandler)
registerRateAction(bot)

bot.command('random', randomCommandHandler)
registerRandomAction(bot)

bot.command('stats', statsCommandHandler)

bot.command('top', topCommandHandler)

bot.launch()
