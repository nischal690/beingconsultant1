import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function CommunityLayout({
  children,
}: {
  children: React.ReactNode;
}) {
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
        <div className="container px-4 py-6 md:px-6 md:py-8">
          <nav className="mb-6 flex items-center space-x-4 text-sm font-medium text-muted-foreground">
            <Link
              href="/community"
              className="transition-colors hover:text-foreground"
            >
              Community
            </Link>
            <span>/</span>
            <Link
              href="/community/success-stories"
              className="text-foreground"
            >
              Success Stories
            </Link>
          </nav>
          {children}
        </div>
      </main>
    </div>
  );
}
