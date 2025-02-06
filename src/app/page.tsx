import Table from '@/components/Table';
import DataLog from '@/components/DataLog';
import { Release, FolderType } from '@/lib/types';
import { getFormat, stupidSpecificArtistNamingCriteria } from '@/lib/utils';
import { getFolders, getData } from '@/lib/api';

export default async function Home() {
  const folders: FolderType[] = await getFolders();

  const url = `https://api.discogs.com/users/${process.env.USERNAME}/collection/folders/0/releases?per_page=100`;
  const data: Release[] = await getData(url);

  const formattedData = data.map((item) => {
    const { thumb } = item.basic_information;
    const artist = item.basic_information.artists.length > 1
    ? stupidSpecificArtistNamingCriteria(item.basic_information, true)
    : stupidSpecificArtistNamingCriteria(item.basic_information, false);
    const dealer = folders.find((fold) => item.folder_id === fold.id);

    const newItem = {
      ...item,
      cover: thumb,
      artist,
      format: getFormat(item.basic_information?.formats),
      acquired: item.notes[0]?.value || '',
      year:  item.notes[1]?.value || '',
      dealer,
    };

    return newItem;
  });

  return (
    <>
      <main className="flex flex-col items-center justify-start pt-4 md:pt-14">
        <Table data={formattedData} />
      </main>
      <div className="flex items-start justify-start pt-4 md:pt-14">
        <DataLog data={data[0]} name="First entry" />
        <DataLog data={formattedData} name="Table data" />
      </div>
    </>
  );
}
