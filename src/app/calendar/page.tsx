import Calendar from '@/components/Calendar';
import DataLog from '@/components/DataLog';
import { Release, FormattedRelease, FolderType } from '@/lib/types';
import { getFormat, stupidSpecificArtistNamingCriteria } from '@/lib/utils';
import { getFolders, getData } from '@/lib/api';

export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';

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

export default async function Page() {
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
      <main className="flex flex-col items-center justify-start px-4 pt-4 md:pt-14">
        <div className="w-full max-w-7xl rounded-3xl border border-white/10 bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-950 px-4 py-6 shadow-2xl shadow-black/20 md:px-6 md:py-8">
          <div className="mb-6 flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.35em] text-zinc-400">Collection calendar</p>
              <h1 className="pb-0 text-3xl md:text-4xl">
                Calendar for {new Date(formattedDate).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}
              </h1>
            </div>
            <p className="max-w-md text-sm text-zinc-400">
              Browse the collection by format and jump into the releases recorded on each day.
            </p>
          </div>

          <Calendar data={dataObject} />
        </div>
      </main>
      <div className="flex items-start justify-start px-4 pt-4 md:pt-14">
        <DataLog data={data[0]} name="First entry" />
        <DataLog data={formattedData} name="Table data" />
      </div>
    </>
  );
}
