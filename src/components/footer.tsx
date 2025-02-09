import Link from "next/link";

export function Footer() {
  return (
    <footer className="w-full bg-gradient-to-r from-blue-900 via-indigo-900 to-purple-900 border-t border-white/10">
      <div className="container flex flex-col gap-4 sm:flex-row py-6 items-center justify-between px-4 md:px-6">
        <p className="text-xs text-gray-400">
          © 2025 AI-Riddle-Quest on Arbitrum Sepolia. All rights reserved.
        </p>
        <nav className="sm:ml-auto flex gap-4 sm:gap-6">
          <Link
            className="text-xs text-gray-400 hover:text-white hover:underline underline-offset-4 transition-colors duration-200"
            href="#"
          >
            Terms of Service
          </Link>
          <Link
            className="text-xs text-gray-400 hover:text-white hover:underline underline-offset-4 transition-colors duration-200"
            href="#"
          >
            Privacy
          </Link>
        </nav>
      </div>
    </footer>
  );
}
