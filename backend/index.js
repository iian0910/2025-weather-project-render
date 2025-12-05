const express = require('express')
const app = express()
const PORT = process.env.PORT || 3000

async function runDailyJob()  {
  console.log('Daily job')
}

app.get('/tasks/daily-update', async(req, res) => {
  await runDailyJob()
  res.json({
    status: 'OK',
    executedAt: new Date().toISOString()
  })
})

app.listen(PORT, () => console.log('Server started on port: ', PORT))