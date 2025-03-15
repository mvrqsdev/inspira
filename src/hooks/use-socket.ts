'use client'

import { useState, useEffect } from 'react'
import openSocket from 'socket.io-client'

interface useSocketProps {
  userId: string
}

export function useSocket({ userId }: useSocketProps) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [socket, setSocket] = useState<any>(null)

  useEffect(() => {
    if (!userId) return

    const newSocket = openSocket(process.env.NEXT_PUBLIC_APP_URL, {
      transports: ['websocket', 'polling', 'flashsocket'],
      timeout: 18000,
      query: { userId },
    })

    setSocket(newSocket)

    return () => {
      newSocket.disconnect()
    }
  }, [userId])

  return { socket }
}
