import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center">
      <main className="flex w-full flex-1 flex-col items-center justify-center px-4 text-center sm:px-20">
        <h1 className="text-4xl font-bold sm:text-5xl">
          PDF to XML <span className="text-primary">Converter</span>
        </h1>
        <p className="mt-4 text-lg text-gray-500 dark:text-gray-400 sm:text-xl">
          Convert your PDF files to structured XML with ease
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <Button asChild>
            <Link href="/sign-in">Get Started</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/about">Learn More</Link>
          </Button>
        </div>
      </main>
      <footer className="w-full border-t border-gray-200 py-4 text-center dark:border-gray-800">
        <p className="text-sm text-gray-500 dark:text-gray-400">
          © {new Date().getFullYear()} PDF to XML Converter. All rights reserved.
        </p>
      </footer>
    </div>
  );
}