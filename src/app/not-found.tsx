import Link from "next/link"

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4 bg-smoky-black px-6 text-center text-light-gray">
      <h1 className="text-4xl font-semibold text-white-2">404</h1>
      <p className="max-w-md text-sm font-light">
        The page you&apos;re looking for doesn&apos;t exist.
      </p>
      <Link
        href="/"
        className="rounded-[14px] border border-jet px-5 py-3 text-sm text-gold transition-colors hover:border-gold focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
        tabIndex={0}
        aria-label="Back to homepage"
      >
        Back to home
      </Link>
    </main>
  )
}
