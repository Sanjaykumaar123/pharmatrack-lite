import Link from 'next/link';
import { Button } from './ui/button';
import { LayoutDashboard } from 'lucide-react';

const PillIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    {...props}
  >
    <path d="M12.337 2.012a9.75 9.75 0 0 0-9.325 9.325 9.75 9.75 0 0 0 9.325 9.325 9.75 9.75 0 0 0 9.325-9.325A9.75 9.75 0 0 0 12.337 2.012ZM11.25 8.637a.75.75 0 0 1 .75-.75h.75a.75.75 0 0 1 .75.75v3h3a.75.75 0 0 1 .75.75v.75a.75.75 0 0 1-.75.75h-3v3a.75.75 0 0 1-.75.75h-.75a.75.75 0 0 1-.75-.75v-3h-3a.75.75 0 0 1-.75-.75v-.75a.75.75 0 0 1 .75-.75h3v-3Z" />
  </svg>
);

export default function Header() {
  return (
    <header className="bg-card shadow-sm">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <PillIcon className="h-8 w-8 text-primary" />
            <span className="text-xl font-bold text-primary font-headline">
              PharmaTrack Lite
            </span>
          </Link>

          <nav>
            <Link href="/medicines" passHref>
              <Button variant="ghost">
                <LayoutDashboard className="mr-2 h-5 w-5" />
                Medicines
              </Button>
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}
