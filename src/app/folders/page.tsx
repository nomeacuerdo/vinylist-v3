import Link from 'next/link';
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

import { CommandShortcut } from "@/components/ui/command";
import { FolderType } from '@/lib/types';
import { getFolders } from '@/lib/api';

export default async function Folders() {
  const folders: FolderType[] = await getFolders();

  return(
    <main className="flex min-h-screen flex-col items-center justify-start pt-4 md:pt-14">
      <h1 className="text-2xl pb-4">
        The people that has drained me from my money:
      </h1>

      <div className="flex space-x-0 flex-col space-y-1 w-full md:w-64">
        {folders.map((item) => (
          <Link
            key={item.id}
            href={`/folders/${item.id}`}
            className={cn(
              buttonVariants({ variant: "ghost" }),
              "hover:bg-transparent hover:underline",
              "justify-start text-2xl md:text-base py-8 md:py-4"
            )}
          >
            {item.name}
            <CommandShortcut>
              {item.count}
            </CommandShortcut>
          </Link>
        ))}
      </div>
    </main>
  );
}
