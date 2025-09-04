import Calendar from '@/components/Calendar';
import DataLog from '@/components/DataLog';
import { Release, FormattedRelease, FolderType } from '@/lib/types';
import { getFormat, stupidSpecificArtistNamingCriteria } from '@/lib/utils';
import { getFolders, getData } from '@/lib/api';

function splitByFormat(data: Array<FormattedRelease>): [Array<FormattedRelease>, Array<FormattedRelease>, Array<FormattedRelease>] {
  const lpArr: Array<FormattedRelease> = [];
  const singleArr: Array<FormattedRelease> = [];
  const otherArr: Array<FormattedRelease> = [];

  data.forEach(item => {
    if (item.format.includes('LP')) {
      lpArr.push(item);
    } else if (
      item.format.includes('12"') ||
      item.format.includes('10"') ||
      item.format.includes('7"')
    ) {
      singleArr.push(item);
    } else {
      otherArr.push(item);
    }
  });

  return [lpArr, singleArr, otherArr];
}

export default async function Page({ params }: { params: { id: string } }) {
  const folders: FolderType[] = await getFolders();
  const url = `https://api.discogs.com/users/${process.env.USERNAME}/collection/folders/0/releases?per_page=100`;
  const data: Release[] = await getData(url);

  // get today's date in YYYY-mm-dd
  const today = new Date();
  const formattedDate = today.toISOString().split('T')[0];

  const formattedData: FormattedRelease[] = data.map((item) => {
    const { thumb } = item.basic_information;
    const artist = item.basic_information.artists.length > 1
    ? stupidSpecificArtistNamingCriteria(item.basic_information, true)
    : stupidSpecificArtistNamingCriteria(item.basic_information, false);
    const dealer = folders.find((fold) => item.folder_id === fold.id);
    const notes = Array.isArray(item.notes) ? item.notes : [];
    const acquired = notes[0]?.value || '';
    const year = notes[1]?.value || '';

    const newItem = {
      id: item.id,
      cover: thumb,
      artist,
      name: item.basic_information?.title,
      format: getFormat(item.basic_information?.formats),
      year,
    };

    return newItem;
  });

  const [lpArr, singleArr, otherArr] = splitByFormat(formattedData);
  const dataObject = {
    LP: lpArr,
    Single: singleArr,
    Other: otherArr,
  };

  return (
    <>
      <main className="flex flex-col items-center justify-start pt-4 md:pt-14">
        <h1 className="text-2xl pb-4">
          Calendar for {new Date(formattedDate).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}
        </h1>

        <Calendar data={dataObject} />
      </main>
      <div className="flex items-start justify-start pt-4 md:pt-14">
        <DataLog data={data[0]} name="First entry" />
        <DataLog data={formattedData} name="Table data" />
      </div>
    </>
  );
}
