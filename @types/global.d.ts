import { Server as SocketIOServer } from 'socket.io'

declare module 'tailwindcss/lib/util/flattenColorPalette' {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const flattenColorPalette: (colors: any) => Record<string, string>
  export default flattenColorPalette
}

declare global {
  // eslint-disable-next-line no-var
  var __io: SocketIOServer | null
}
