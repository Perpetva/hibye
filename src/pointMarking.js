import { chromium } from 'playwright'
import dotenv from 'dotenv'

dotenv.config()

const login = process.env.LOGIN
const password = process.env.PASSWORD

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

    await page.getByTestId('login.emailInput').fill(login)
    await page.getByTestId('login.passwordInput').fill(password)
    await page.keyboard.press('Enter')

    // bater o ponto
    await page.getByText('Marcar Ponto').click()
    await page.getByRole('button', { name: 'MARCAR PONTO' }).click()

    await delay(4000)

    console.log('Ponto marcado com sucesso em ' + new Date().toLocaleString())

    await context.close()
    await browser.close()
}

function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms))
}