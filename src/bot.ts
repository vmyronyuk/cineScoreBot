import dotenv from 'dotenv'
import { Telegraf } from 'telegraf'

dotenv.config()

const bot = new Telegraf(process.env.BOT_TOKEN!)
const tmdbKey = process.env.TMDB_API_KEY

bot.start(ctx => ctx.reply('Hello!'))

bot.launch()
