import chromium from 'playwright'
import dotenv from 'dotenv'

dotenv.config()

const login = process.env.LOGIN
const senha = process.env.SENHA

const link = process.env.LINK

export default async function pointMarking() {

    const browser = await chromium.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
    })

    const context = await browser.newContext({
        locale: 'pt-BR',
        timezoneId: 'America/Sao_Paulo',
        viewport: { width: 1366, height: 900 },
    })

    const page = await context.newPage()

    await page.goto(link, { waitUntil: 'domcontentloaded' })   
}