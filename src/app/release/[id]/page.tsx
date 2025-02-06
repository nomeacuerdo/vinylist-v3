import Image from 'next/image';
import Link from 'next/link';
import { ExternalLinkIcon } from "@radix-ui/react-icons"
import {
  Table,
  TableBody,
  TableCell,
  TableRow,
} from "@/components/ui/table"
import DataLog from '@/components/DataLog';
import Back from '@/components/Back';
import { getFormat, stupidSpecificArtistNamingCriteria } from '@/lib/utils';
import { Release, FolderType } from '@/lib/types';
import { getParentReleaseData, getReleaseData, getFolders } from '@/lib/api';

export default async function Page({ params }: { params: { id: string } }) {
  const folders: FolderType[] = await getFolders();
  const releaseData: Release = await getReleaseData(`https://api.discogs.com/users/${process.env.USERNAME}/collection/releases/${params.id}`);
  const parentRelease: Release = await getParentReleaseData(`https://api.discogs.com/releases/${params.id}`);
  const cover = releaseData?.basic_information.cover_image;
  const title = releaseData?.basic_information.title;
  const artist = releaseData.basic_information.artists.length > 1
    ? stupidSpecificArtistNamingCriteria(releaseData.basic_information, true)
    : stupidSpecificArtistNamingCriteria(releaseData.basic_information, false);
  const format = getFormat(releaseData?.basic_information?.formats);
  const dealer = folders.find((fold) => releaseData.folder_id === fold.id);

  return(
    <>
      <main className="flex max-sm:flex-col items-start justify-start basis-4 pt-4 md:pt-14 mb-8">
        <div className="grow-0 min-w-[500px]">
          <Back />
          <Image
            src={cover}
            width={500}
            height={500}
            alt={title}
            placeholder="blur"
            blurDataURL="/711.gif"
            className='max-sm:max-w-xs md:min-w-[500px] mt-4'
          />
          <Link
            href={`//discogs.com/release/${releaseData.basic_information.id}`}
            target="_blank"
            className="inline-flex items-center pt-4"
          >
            <span>View on Discogs </span>
            <ExternalLinkIcon />
          </Link>
        </div>
        <div className='w-auto grow pl-4 pt-10'>
          <h1 className="text-6xl py-4">
            {artist} - {title} ({releaseData?.basic_information.year})
          </h1>
          <h2>
            Original Year: <span>{releaseData?.notes[1].value}</span>
          </h2>
          <h2>
            Format: <span>{format}</span>
          </h2>
          <h2>
            Dealer: 
            {` `}
            <Link href={`/folders/${dealer?.id}`} style={{ textDecoration: 'underline' }}>
              <span>{dealer?.name}</span>
            </Link>
          </h2>
          <h2>
            Acquired: <span>{releaseData?.notes[0].value}</span>
          </h2>
          <h2 className="mt-4">Tracklist:</h2>
          <div>
            <Table>
              <TableBody>
              {
                // @ts-ignore
                parentRelease?.tracklist.map((item) => {
                  const duration = item.duration ? `(${item.duration})` : null;
                  const isTrack = item.type_ === 'track';
                  return (
                    <TableRow key={item.position}>
                      <TableCell className={!isTrack ? 'bg-slate-600' : ''}>
                        {item.position}
                      </TableCell>
                      <TableCell className={!isTrack ? 'bg-slate-600' : ''}>
                        {
                          isTrack
                          ? (item.title)
                          : (<h3>{item.title}</h3>)
                        }
                      </TableCell>
                      {
                        duration
                        ? (<TableCell className={!isTrack ? 'bg-slate-600' : ''}>{duration}</TableCell>)
                        : null
                      }
                    </TableRow>
                  );
                })
              }
              </TableBody>
            </Table>
          </div>
        </div>
      </main>
      <DataLog data={parentRelease} name="Parent Release" />
      <DataLog data={releaseData} name="Release" />
    </>
  );
}
