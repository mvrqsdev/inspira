import { Server } from 'node:http'
import { Server as SocketIO } from 'socket.io'

if (!globalThis.__io) {
  globalThis.__io = null
}

export const initIO = (httpServer: Server): SocketIO => {
  if (!globalThis.__io) {
    globalThis.__io = new SocketIO(httpServer, {
      cors: { origin: '*' },
    })

    globalThis.__io.on('connection', (socket) => {
      socket.on('joinChatBox', (ticket: string) => {
        socket.join(ticket)
      })

      socket.on('disconnect', () => {})
    })

    console.log('✅ Socket.IO inicializado!')
  }

  return globalThis.__io
}

export const getIO = (): SocketIO => {
  if (!globalThis.__io) {
    throw new Error('❌ Erro: Socket.IO não foi inicializado ainda!')
  }
  return globalThis.__io
}
