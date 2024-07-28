import { cn } from '@/lib/utils';
import Image from 'next/image';
import Link from 'next/link';
import { SVGProps } from 'react';

const Header = ({ children, className }: HeaderProps) => {
  return (
    <header className={cn("w-full bg-[#000000] px-4", className)}>
      <div className="flex items-center justify-between h-16 max-w-screen-xl mx-auto w-full">
        <Link href='/' className="flex items-center">
          <FolderIcon className="w-8 h-8 text-[#08B371]" />
          <span className="ml-2 text-xl font-bold text-white">SmartDocs</span>
        </Link>
        <div className="flex items-center">
          {children}
        </div>
      </div>
    </header>
  )
}

function FolderIcon(props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z" />
    </svg>
  )
}

export default Header;
