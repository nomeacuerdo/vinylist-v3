import Table from '@/components/Table';
import { Release } from '@/lib/types';
import { getFormat, stupidSpecificArtistNamingCriteria } from '@/lib/utils';

async function getData(
  url: string = 'https://api.discogs.com/users/no-me-acuerdo/collection/folders/0/releases?per_page=100',
  recursive = false
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

export default async function Home() {
  const data: Release[] = await getData();
  const formattedData = data.map((item) => {
    const { title, thumb } = item.basic_information;
    const artist = item.basic_information.artists.length > 1
    ? stupidSpecificArtistNamingCriteria(item.basic_information, true)
    : stupidSpecificArtistNamingCriteria(item.basic_information, false);

    const newItem = {
      ...item,
      cover: thumb,
      artist,
      format: getFormat(item.basic_information?.formats[0]?.descriptions),
      acquired: item.notes[0]?.value || '',
      year:  item.notes[1]?.value || '',
    };

    return newItem;
  });

  return (
    <main className="flex min-h-screen flex-col items-center justify-start pt-4 md:pt-14">
      <Table data={formattedData} />
      <div className="rounded-md border w-full hidden">
        <pre>{JSON.stringify(data[0], null, 2)}</pre>
      </div>
    </main>
  );
}
