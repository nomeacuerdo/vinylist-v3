import Table from '@/components/Table';
import DataLog from '@/components/DataLog';
import { getFormat, stupidSpecificArtistNamingCriteria } from '@/lib/utils';
import { Release, PaginationType } from '@/lib/types';
import { getWantlistData } from '@/lib/api';

export default async function Page({ params }: { params: { id: string } }) {
  const url = `https://api.discogs.com/users/${process.env.USERNAME}/wants?per_page=100`;
  const [data, pagination]: [Release[], PaginationType] = await getWantlistData(url);
  const formattedData = data.map((item) => {
    const { title, thumb } = item.basic_information;
    const artist = item.basic_information.artists.length > 1
    ? stupidSpecificArtistNamingCriteria(item.basic_information, true)
    : stupidSpecificArtistNamingCriteria(item.basic_information, false);

    const newItem = {
      ...item,
      cover: thumb,
      artist,
      format: getFormat(item.basic_information?.formats),
    };

    return newItem;
  });

  return(
    <>
      <main className="flex flex-col items-center justify-start pt-4 md:pt-14">
        <h1 className="text-2xl pb-4">
          Wantlist ({pagination.items})
        </h1>

        <Table data={formattedData} wantlist />
      </main>
      <div className="flex items-start justify-start pt-4 md:pt-14">
        <DataLog data={formattedData} name="Table data" />
      </div>
    </>
  );
}
