import { createServer } from 'http'
import next from 'next'
import { initSocket } from './lib/socket'
import { initKafkaConsumer } from './lib/kafka'

const dev = process.env.NODE_ENV !== 'production'
const app = next({ dev })
const handle = app.getRequestHandler()

app.prepare().then(async () => {
  const httpServer = createServer((req, res) => handle(req, res))

  // Attach Socket.io to the HTTP server
  await initSocket(httpServer)

  // Start Kafka consumer
  await initKafkaConsumer()

  httpServer.listen(3000, () => {
    console.log('> Ready on http://localhost:3000')
  })
})