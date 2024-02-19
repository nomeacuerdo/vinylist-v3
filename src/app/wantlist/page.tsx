import { ColumnDef } from "@tanstack/react-table";
import Table from '@/components/Table';
import { getFormat, stupidSpecificArtistNamingCriteria } from '@/lib/utils';
import { Release, PaginationType } from '@/lib/types';

async function getData(
  url: string = 'https://api.discogs.com/users/no-me-acuerdo/wants?per_page=100'
): Promise<[Release[], PaginationType]> {
  const res = await fetch(url, {
    headers: {
      Authorization: `Discogs token=${process.env.DISCOGS_TOKEN}`,
      'user-agent': 'Vinylist/0.1 +https://github.com/nomeacuerdo/vinylist',
    }
  });
  const { wants, pagination } = await res.json();

  if (!res.ok) {
    throw new Error('Failed to fetch data')
  }

  if (pagination.page < pagination.pages) {
    const nextData = await getData(pagination.urls.next);
    return [wants.concat(nextData[0]), pagination];
  } else {
    return [wants, pagination];
  }
}

const wantlistColumns: ColumnDef<Release>[] = [
  {
    id: "cover",
    accessorKey: "cover",
    // @ts-ignore
    title: "Cover",
    header: "Cover",
    filter: false,
  },
  {
    id: "title",
    accessorKey: "basic_information.title",
    // @ts-ignore
    title: "Name",
    header: "Name",
    filter: true,
  },
  {
    id: "artist",
    accessorKey: "artist",
    // @ts-ignore
    title: "Artist",
    header: "Artist",
    filter: true,
  },
  {
    id: "format",
    accessorKey: "format",
    // @ts-ignore
    title: "Format",
    header: "Format",
    filter: true,
  },
];

export default async function Page({ params }: { params: { id: string } }) {
  const url = `https://api.discogs.com/users/no-me-acuerdo/wants?per_page=100`;
  const [data, pagination]: [Release[], PaginationType] = await getData(url);
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

  return(
    <main className="flex min-h-screen flex-col items-center justify-start pt-4 md:pt-14">
      <h1 className="text-2xl pb-4">
        Wantlist ({pagination.items})
      </h1>

      <Table data={formattedData} columnProps={wantlistColumns} />

      <div className="rounded-md border w-full hidden">
        <pre>{JSON.stringify(data, null, 2)}</pre>
      </div>
    </main>
  );
}
