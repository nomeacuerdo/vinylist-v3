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
    <Link
      className={`btn ${pathname === href ? 'btn-blue' : ''}`}
      href={href}
    >
      {children}
    </Link>
  );
};

export default Button;
