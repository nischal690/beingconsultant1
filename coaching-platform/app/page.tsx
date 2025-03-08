import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="flex h-16 items-center border-b px-4 md:px-6">
        <Link href="/" className="flex items-center gap-2 font-semibold">
          <span className="text-xl font-bold">ConsultCoach</span>
        </Link>
        <nav className="ml-auto flex gap-4">
          <Link href="/auth/login" passHref>
            <Button variant="ghost">Login</Button>
          </Link>
          <Link href="/auth/signup" passHref>
            <Button>Sign Up</Button>
          </Link>
        </nav>
      </header>
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-12">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl">Elevate Your Consulting Career</h1>
                  <p className="max-w-[600px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
                    Expert coaching, resources, and tools to help you succeed in the consulting world.
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Link href="/auth/signup" passHref>
                    <Button className="gap-1">
                      Get Started
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>
                  <Link href="/ai-coach-demo" passHref>
                    <Button variant="outline">Try AI Coach Demo</Button>
                  </Link>
                </div>
              </div>
              <div className="flex items-center justify-center">
                <img
                  src="/placeholder.svg?height=550&width=550"
                  alt="Consulting Coaching Platform"
                  className="rounded-lg object-cover"
                  width={550}
                  height={550}
                />
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}

