'use client'
import { FC } from "react";
import { usePathname } from 'next/navigation'
import Link from 'next/link';
import './styles.css';

interface ButtonProps {
  href: string;
  children: React.ReactNode;
}

const Button: FC<ButtonProps> = ({ href, children }) => {
  const pathname = usePathname();

  return (
    <>
      <Link
        className={`flex content-center items-center justify-center px-2 h-16 ${pathname === href && 'bg-gradient-to-r from-indigo-600 to-pink-500'} hover:bg-pink-500 hover:text-black hover:animate-pulse`}
        href={href}
      >
        <span className={`inline-block text-sm font-medium transition-colors`}>
          {children}
        </span>
      </Link>
    </>
  );
};

export default Button;
