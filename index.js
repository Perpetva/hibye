import cron from 'node-cron'
import pointMarking from './src/pointMarking.js'

async function start() {
    await pointMarking()
}''

cron.schedule('0 8,18 * * 1-5', async () => {
    try {
        console.log('Execução agendada iniciada em ' + new Date().toLocaleString())
        await start()
    } catch (e) {
        console.error('Erro na execução agendada:', e)
    }
}, {
    timezone: 'America/Sao_Paulo',
})