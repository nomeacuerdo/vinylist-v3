"use client"
import { useEffect } from 'react';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Wantlist',
};

export default function Template({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    console.log("template/useEffect");
  }, []);

  return <div>{children}</div>
}
