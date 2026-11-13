import { createApp } from './app.ts'
import { isEmpty, openDb } from './db.ts'
import { seed } from './seed.ts'

const db = openDb()
if (isEmpty(db)) {
  seed(db)
  console.log('Created data/dev.db with synthetic data')
}

const port = Number(process.env.PORT ?? 3001)
createApp(db).listen(port, () => {
  console.log(`API ready on http://localhost:${port}`)
})
