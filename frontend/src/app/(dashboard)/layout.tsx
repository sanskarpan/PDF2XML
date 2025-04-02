import { UserButton } from '@clerk/nextjs';
import Link from 'next/link';
import { ModeToggle } from '@/components/mode-toggle';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-10 border-b bg-background">
        <div className="container flex h-16 items-center justify-between">
          <Link href="/convert" className="font-bold">
            PDF to XML
          </Link>
          <nav className="hidden space-x-6 sm:flex">
            <Link
              href="/convert"
              className="transition-colors hover:text-foreground/80"
            >
              Convert
            </Link>
            <Link
              href="/history"
              className="transition-colors hover:text-foreground/80"
            >
              History
            </Link>
            <Link
              href="/profile"
              className="transition-colors hover:text-foreground/80"
            >
              Profile
            </Link>
          </nav>
          <div className="flex items-center gap-4">
            <ModeToggle />
            <UserButton afterSignOutUrl="/" />
          </div>
        </div>
      </header>
      <main className="flex-1">{children}</main>
    </div>
  );
}