import { createServer } from 'node:http'
import next from 'next'
// import { startJobs } from '@/queues/startJobs'
import { initIO } from '@/lib/socket'

const dev = process.env.NODE_ENV !== 'production'
const hostname = process.env.HOSTNAME || 'localhost'
const port = Number(process.env.PORT)

const app = next({ dev, hostname, port })
const handle = app.getRequestHandler()

const httpServer = createServer((req, res) => {
  handle(req, res)
})

app.prepare().then(() => {
  initIO(httpServer)

  // startJobs()
  //   .then(() => {})
  //   .catch((error) => {
  //     console.log(error)
  //   })

  httpServer.listen(port, () => {
    console.log(`Server rodando na porta ${port}`)
    console.log(`http://${hostname}:${port}`)
  })
})
