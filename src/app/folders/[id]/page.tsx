import Table from '@/components/Table';
import DataLog from '@/components/DataLog';
import { getFormat, stupidSpecificArtistNamingCriteria } from '@/lib/utils';
import { Release, FolderType } from '@/lib/types';
import { getFolderData, getData } from '@/lib/api';

export default async function Page({ params }: { params: { id: string } }) {
  const folderData: FolderType = await getFolderData(`https://api.discogs.com/users/${process.env.USERNAME}/collection/folders/${params.id}`);

  const url = `https://api.discogs.com/users/${process.env.USERNAME}/collection/folders/${params.id}/releases?per_page=100`;
  const data: Release[] = await getData(url);
  const formattedData = data.map((item) => {
    const { title, thumb } = item.basic_information;
    const artist = item.basic_information.artists.length > 1
    ? stupidSpecificArtistNamingCriteria(item.basic_information, true)
    : stupidSpecificArtistNamingCriteria(item.basic_information, false);
    const notes = Array.isArray(item.notes) ? item.notes : [];
    const acquired = notes[0]?.value || '';
    const year = notes[1]?.value || '';
    const pending = notes[2]?.value || null;

    const newItem = {
      ...item,
      cover: thumb,
      artist,
      format: getFormat(item.basic_information?.formats),
      acquired,
      year,
      dealer: folderData,
      pending,
    };

    return newItem;
  });

  return(
    <>
      <main className="flex flex-col items-center justify-start pt-4 md:pt-14">
        <h1 className="text-2xl pb-4">
          {folderData?.name} ({folderData?.count})
        </h1>

        <Table data={formattedData} />
      </main>
      <div className="flex items-start justify-start pt-4 md:pt-14">
        <DataLog data={formattedData} name="Table data" />
      </div>
    </>
  );
}
