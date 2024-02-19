
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import Table from '@/components/Table';
import { getFormat, stupidSpecificArtistNamingCriteria } from '@/lib/utils';
import { Release, FolderType } from '@/lib/types';

async function getData(
  url: string = 'https://api.discogs.com/users/no-me-acuerdo/collection/folders/0/releases?per_page=100'
): Promise<any[]> {
  const res = await fetch(url, {
    headers: {
      Authorization: `Discogs token=${process.env.DISCOGS_TOKEN}`,
      'user-agent': 'Vinylist/0.1 +https://github.com/nomeacuerdo/vinylist',
    }
  });
  const { releases, pagination } = await res.json();

  if (!res.ok) {
    throw new Error('Failed to fetch data')
  }

  if (pagination.page < pagination.pages) {
    const nextData = await getData(pagination.urls.next);
    return releases.concat(nextData);
  } else {
    return releases;
  }
}
async function getFolderData(url: string): Promise<FolderType> {
  const res = await fetch(url, {
    headers: {
      Authorization: `Discogs token=${process.env.DISCOGS_TOKEN}`,
      'user-agent': 'Vinylist/0.1 +https://github.com/nomeacuerdo/vinylist',
    }
  });
  const folder = await res.json();

  if (!res.ok) {
    throw new Error('Failed to fetch data')
  }

  return folder;
}

export default async function Page({ params }: { params: { id: string } }) {
  const folderData: FolderType = await getFolderData(`https://api.discogs.com/users/no-me-acuerdo/collection/folders/${params.id}`);

  const url = `https://api.discogs.com/users/no-me-acuerdo/collection/folders/${params.id}/releases?per_page=100`;
  const data: Release[] = await getData(url);
  const formattedData = data.map((item) => {
    const { title, thumb } = item.basic_information;
    const artist = item.basic_information.artists.length > 1
    ? stupidSpecificArtistNamingCriteria(item.basic_information, true)
    : stupidSpecificArtistNamingCriteria(item.basic_information, false);

    const newItem = {
      ...item,
      cover: (
        <Avatar>
          <AvatarImage src={thumb} alt={title} />
          <AvatarFallback>{title.split('').pop()}</AvatarFallback>
        </Avatar>
      ),
      artist,
      format: getFormat(item.basic_information?.formats[0]?.descriptions),
      acquired: item.notes[0]?.value || '',
      year:  item.notes[1]?.value || '',
    };

    return newItem;
  });

  return(
    <main className="flex min-h-screen flex-col items-center justify-start pt-4 md:pt-14">
      <h1 className="text-2xl pb-4">
        {folderData?.name} ({folderData?.count})
      </h1>

      <Table data={formattedData} />
    </main>
  );
}
