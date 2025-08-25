import dotenv from 'dotenv'
import { Telegraf } from 'telegraf'
import { registerRateAction } from './commands/addRating/actions/registerRateAction'
import { addRatingCommandHandler } from './commands/addRating/addRatingCommandHandler'
import { randomCommandHandler } from './commands/random/randomCommandHandler'

dotenv.config()

const bot = new Telegraf(process.env.BOT_TOKEN!)
export const TMDB_API_KEY = process.env.TMDB_API_KEY!

bot.start(ctx => ctx.reply('Hello!'))

bot.command('addRating', addRatingCommandHandler)
registerRateAction(bot)

bot.command('random', randomCommandHandler)

bot.launch()
