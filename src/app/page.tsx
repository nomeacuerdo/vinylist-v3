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
      dealer,
      pending,
    };

    return newItem;
  }).sort((a, b) => {
    const artistA = a.artist.toLowerCase();
    const artistB = b.artist.toLowerCase();
    if (artistA < artistB) {
      return -1;
    }
    if (artistA > artistB) {
      return 1;
    }
    // If artists are equal, sort by year (ascending)
    // Extract year as integer from YYYY or YYYY-MM-DD
    const getYear = (val: string) => {
      if (!val) return Number.MAX_SAFE_INTEGER;
      const match = val.match(/^(\d{4})/);
      return match ? parseInt(match[1], 10) : Number.MAX_SAFE_INTEGER;
    };
    const yearA = getYear(a.year);
    const yearB = getYear(b.year);
    return yearA - yearB;
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
