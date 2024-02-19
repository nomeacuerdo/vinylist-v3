import Link from 'next/link';
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import {
  PersonIcon,
} from "@radix-ui/react-icons";

import {
  Command,
  CommandList,
  CommandGroup,
  CommandItem,
  CommandShortcut,
  CommandSeparator,
} from "@/components/ui/command";
import { FolderType } from '@/lib/types';

async function getData(
  url: string = 'https://api.discogs.com/users/no-me-acuerdo/collection/folders',
  recursive = false
): Promise<any[]> {
  const res = await fetch(url, {
    headers: {
      Authorization: `Discogs token=${process.env.DISCOGS_TOKEN}`,
      'user-agent': 'Vinylist/0.1 +https://github.com/nomeacuerdo/vinylist',
    }
  });
  const { folders } = await res.json();

  if (!res.ok) {
    throw new Error('Failed to fetch data')
  }
  return folders;
}

export default async function Folders() {
  const folders: FolderType[] = await getData();

  return(
    <main className="flex min-h-screen flex-col items-center justify-start pt-4 md:pt-14">
      <h1 className="text-2xl pb-4">
        The people that has drained me from my money:
      </h1>

      <div className="flex space-x-2 flex-col space-x-0 space-y-1 w-full md:w-64">
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

      {/*
      <Command className="rounded-lg border shadow-md mt-4 w-64 h-max">
          <CommandGroup heading="Tiendas">
            {
              folders.map((item) => (
                <>
                  <CommandItem>
                    <PersonIcon className="mr-2 h-4 w-4" />
                    <Link href={`/folders/${item.id}`}>
                      <span>{item.name}</span>
                    </Link>
                    <CommandShortcut>
                      {item.count}
                    </CommandShortcut>
                  </CommandItem>
                  {
                    item.name === 'All' && (<CommandSeparator />)
                  }
                </>
              ))
            }
          </CommandGroup>
      </Command>
      */}
    </main>
  );
}
