import Link from "next/link";
import { ThemeToggle } from "@/components/theme";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background">
      {/* Simple header for auth pages */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center">
          <div className="flex items-center space-x-4">
            <Link href="/" className="text-xl font-semibold">
              ConvoForms
            </Link>
          </div>
          <div className="ml-auto flex items-center space-x-4">
            <ThemeToggle />
          </div>
        </div>
      </header>
      
      {/* Auth content */}
      <main>
        {children}
      </main>
    </div>
  );
}