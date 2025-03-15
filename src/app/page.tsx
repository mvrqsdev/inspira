import { Button } from '@/components/ui/button'
import Link from 'next/link'
export default function Home() {
  return (
    <div className="flex items-center justify-center min-h-screen w-full">
      <div className="flex flex-col w-[300px]">Home</div>
      <Button asChild>
        <Link href="/login">Ir para o Login/Dashboard</Link>
      </Button>
    </div>
  )
}
