import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import Table from '@/components/Table';
import { Release } from './types';

async function getData(
  url: string = 'https://api.discogs.com/users/no-me-acuerdo/collection/folders/0/releases?per_page=100',
  recursive = false
): Promise<any[]> {
  const res = await fetch(url, {
    headers: {
      Authorization: 'Discogs key=PjNgHzSjSNIULkrCsSmT, secret=zwvQZAPKYBJmNfJxzxtlUfWIbTblEkAf, token=uuIWTZNgdYAOOFhQJRokeWBrTcDsrQYMHwaPJRov',
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

const getFormat = (format: string[]): string => {
  if(format.includes('7"')) {
    return '7"';
  } else if(format.includes('10"')) {
    return '10"';
  } else if(format.includes('12"')) {
    return '12"';
  } else if(format.includes('LP')) {
    return 'LP';
    } else if(format.includes('Album')) {
      return 'Album';
      } else if(format.includes('Compilation')) {
        return 'LP';
  } else {
    return format.join(', ');
  }
};

const stupidSpecificArtistNamingCriteria = (diskInfo: any, multi: boolean) => {
  const namingMatrix = [
    // Style Changes
    ['Молчат Дома = Молчат Дома', 'Molchat Doma (Молчат Дома)'],
    ['Blind Faith (2)', 'Blind Faith'],
    ['Filter (2)', 'Filter'],
    ['Hole (2)', 'Hole'],
    ['Ken Ishii Feat. Pac-Man (2)', 'Ken Ishii Feat. Pac-Man'],
    ['Tool (2)', 'Tool'],

    ['Poison Idea / Pantera', 'Pantera / Poison Idea'],
    ['Prodigy [The] Featuring Sleaford Mods', 'Prodigy [The]'],
    // Who tf is Mick Gordon
    ['Mick Gordon', 'Doom'],
    ['Geinoh Yamashirogumi', 'Akira (Geinoh Yamashirogumi)'],
    ['Yoko Takahashi , Megumi Hayashibara', 'Evangelion (Yoko Takahashi)'],
    ['Seatbelts [The]', 'Cowboy Bebop (Seatbelts)'],
    ['AIR Sung By Gordon Tracks', 'Air'],
    ['Kristofer Maddigan', 'Cuphead'],
    ['Konami Kukeiha Club', 'Castlevania'],
    ['Ramin Djawadi', 'Westworld (Ramin Djawadi)'],
    // The artist formerly known as
    ['JARV IS...', 'Jarvis Cocker (JARV IS...)'],
    ['Trent Reznor And Atticus Ross', 'Watchmen'],

    ['Saturday Morning - Cartoons\' Greatest Hits', 'Saturday Morning (Various)'],
    ['Rodrigo D. No Futuro', 'Rodrigo D. No Futuro (Various)'],
    ['Dust Brothers [The]', 'Fight Club (The Dust Brothers)'],
    // Various Artists now means pretty much soundtracks
    ['Jojo Rabbit Original Motion Picture Soundtrack', 'Various'],
    ['Trainspotting (Music From The Motion Picture)', 'Various'],
    ['Robert Rodriguez', 'Various'],
    ['Kill Bill Vol. 2 (Original Soundtrack)', 'Various'],
    ['Pulp Fiction (Music From The Motion Picture)', 'Various'],
    ['Quentin Tarantino\'s Inglourious Basterds (Motion Picture Soundtrack)', 'Various'],
    ['Quentin Tarantino\'s "Death Proof" (Original Soundtrack)', 'Various'],
    ['Reservoir Dogs (Original Motion Picture Soundtrack)', 'Various'],
    ['The Matrix: Music From The Motion Picture', 'Various'],
    ['The Return Of The Living Dead - Original Soundtrack', 'Various'],
  ];

  let artist = multi
    ? diskInfo.artists.reduce((sum: string, itm: any) => {
      const normalizedName = itm.name.startsWith('The ') ? `${itm.name.substring(3)} [The]` : itm.name;
      return `${sum} ${normalizedName} ${itm.join}`;
    }, '').trim()
    : diskInfo.artists[0].name;

  artist = artist.startsWith('The ') ? `${artist.substring(3)} [The]`.trim() : artist;

  namingMatrix.forEach((dupla) => {
    let returnValue = artist;

    if (returnValue.startsWith('Various')) {
      returnValue = diskInfo.title;
    }

    returnValue = (returnValue === dupla[0]) ? dupla[1] : returnValue;

    artist = returnValue;
  });

  return artist;
};

export default async function Home() {
  const data: Release[] = await getData();
  const formattedData = data.map((item) => {
    const { title, thumb } = item.basic_information;
    const artist = item.basic_information.artists.length > 1
    ? stupidSpecificArtistNamingCriteria(item.basic_information, true)
    : stupidSpecificArtistNamingCriteria(item.basic_information, false);

    const newItem = {
      ...item,
      cover: (
        <Avatar>
          <AvatarImage src={thumb} alt={title} />
          <AvatarFallback>{title.split('').pop()}</AvatarFallback>
        </Avatar>
      ),
      artist,
      format: getFormat(item.basic_information?.formats[0]?.descriptions),
      acquired: item.notes[0]?.value || '',
      year:  item.notes[1]?.value || '',
    };

    return newItem;
  });

  return (
    <main className="flex min-h-screen flex-col items-center justify-start p-24">
      <Table data={formattedData} />
    </main>
  );
}
