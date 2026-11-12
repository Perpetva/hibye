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
    try {
        if (!link || !login || !password) {
            throw new Error('LINK, LOGIN e PASSWORD precisam estar configurados')
        }

        await page.goto(link, { waitUntil: 'domcontentloaded' })

        await page.getByTestId('login.emailInput').fill(login)
        await page.getByTestId('login.passwordInput').fill(password)
        await page.keyboard.press('Enter')
        await delay(10000)

        const pointMarkingLink = page.locator('div').filter({ hasText: /^Marcar Ponto$/ }).first()

        await pointMarkingLink.click()
        await page.getByRole('button', { name: 'MARCAR PONTO', exact: true }).click()

        await delay(4000)

        console.log('Ponto marcado com sucesso em ' + new Date().toLocaleString())
    } finally {
        await context.close()
        await browser.close()
    }
}

function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms))
}

async function saveFailureDiagnostics(page) {
    try {
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-')
        await page.screenshot({ path: `playwright-failure-${timestamp}.png`, fullPage: true })
        console.error('Estado da página após falha:', {
            url: page.url(),
            title: await page.title(),
            body: (await page.locator('body').innerText()).slice(0, 1000),
        })
    } catch (diagnosticError) {
        console.error('Não foi possível coletar diagnóstico da página:', diagnosticError)
    }
}