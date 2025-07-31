import * as motion from "motion/react-client";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  SignedIn,
  SignedOut,
  SignInButton,
  SignUpButton,
  UserButton,
} from "@clerk/nextjs";
import { Tektur } from "next/font/google";

const tektur = Tektur({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-tektur",
});

export default function Navbar() {
  return (
    <motion.nav
      initial={{ opacity: 0, y: -40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="fixed w-full mx-auto px-4 sm:px-6 lg:px-6 bg-white shadow-sm border-b border-gray-200"
    >
      <div className="flex justify-between items-center h-16">
        <Link href="/">
          <span
            className={`text-xl font-semibold text-gray-700 ${tektur.className}`}
          >
            SmartFeed
          </span>
        </Link>

        <div className="flex items-center space-x-4">
          <SignedIn>
            <Link href="/dashboard">
              <Button
                variant="ghost"
                color="grey"
                className="hover:text-indigo-600 hover:bg-indigo-50"
              >
                Dashboard
              </Button>
            </Link>
            <UserButton />
          </SignedIn>

          <SignedOut>
            <SignInButton>
              <Button variant="outline">Login</Button>
            </SignInButton>
            <SignUpButton>
              <Button>Sign up</Button>
            </SignUpButton>
          </SignedOut>
        </div>
      </div>
    </motion.nav>
  );
}
