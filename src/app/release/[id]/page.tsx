import Image from 'next/image';
import Link from 'next/link';
import { ExternalLinkIcon } from "@radix-ui/react-icons"
import {
  Table,
  TableBody,
  TableCell,
  TableRow,
} from "@/components/ui/table"
import Back from '@/components/Back';
import { getFormat, stupidSpecificArtistNamingCriteria } from '@/lib/utils';
import { Release } from '@/lib/types';

async function getReleaseData(url: string): Promise<Release> {
  const res = await fetch(url, {
    headers: {
      Authorization: `Discogs token=${process.env.DISCOGS_TOKEN}`,
      'user-agent': 'Vinylist/0.1 +https://github.com/nomeacuerdo/vinylist',
    }
  });

  if (!res.ok) {
    throw new Error('Failed to fetch data')
  }
  const { releases } = await res.json();

  return releases[0];
}

async function getParentReleaseData(url: string): Promise<Release> {
  const res = await fetch(url, {
    headers: {
      Authorization: `Discogs token=${process.env.DISCOGS_TOKEN}`,
      'user-agent': 'Vinylist/0.1 +https://github.com/nomeacuerdo/vinylist',
    }
  });

  if (!res.ok) {
    throw new Error('Failed to fetch data')
  }

  return await res.json();
}

export default async function Page({ params }: { params: { id: string } }) {
  const releaseData: Release = await getReleaseData(`https://api.discogs.com/users/no-me-acuerdo/collection/releases/${params.id}`);
  const parentRelease: Release = await getParentReleaseData(`https://api.discogs.com/releases/${params.id}`);
  const cover = releaseData?.basic_information.cover_image;
  const title = releaseData?.basic_information.title;
  const artist = releaseData.basic_information.artists.length > 1
    ? stupidSpecificArtistNamingCriteria(releaseData.basic_information, true)
    : stupidSpecificArtistNamingCriteria(releaseData.basic_information, false);
  const format = getFormat(releaseData?.basic_information?.formats[0]?.descriptions);

  return(
    <main className="flex min-h-screen max-sm:flex-col items-start justify-start basis-4 pt-4 md:pt-14 mb-8">
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
        <h1 className="text-2xl py-4">
          {artist} - {title} ({releaseData?.basic_information.year})
        </h1>
        <h2>
          Original Year: {releaseData?.notes[1].value}
        </h2>
        <h2>
          Format: {format}
        </h2>
        <h2>
          Acquired: {releaseData?.notes[0].value}
        </h2>
        <h2 className="mt-4">Tracklist:</h2>
        <div>
          <Table>
            <TableBody>
            {
              // @ts-ignore
              parentRelease?.tracklist.map((item) => {
                const duration = item.duration ? `(${item.duration})` : '';
                return (
                  <TableRow key={item.position}>
                    <TableCell>
                      {item.position}
                    </TableCell>
                    <TableCell>{item.title}</TableCell>
                    <TableCell>{duration}</TableCell>
                  </TableRow>
                );
              })
            }
            </TableBody>
          </Table>
        </div>
        <div className="rounded-md border w-full hidden">
          <pre>{JSON.stringify(parentRelease, null, 2)}</pre>
        </div>
        <div className="rounded-md border w-full hidden">
          <pre>{JSON.stringify(releaseData, null, 2)}</pre>
        </div>
      </div>
    </main>
  );
}
