'use client'
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";

export default function Back() {
  const router = useRouter();

  return(
    <Button
      variant="default"
      onClick={() => router.back()}
    >
      Go back
    </Button>
  );
}
