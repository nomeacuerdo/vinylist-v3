import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { Format } from '@/lib/types';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


export const getFormat = (formats: Format[]): string => {
  const allowedStrings = ['3"', '7"', '7\"', '10"', '12"', 'LP', 'CD'];
  const format = formats.map((item) => {
    switch(item.name) {
      case 'Vinyl':
        const descriptions = item.descriptions.filter(item2 => allowedStrings.includes(item2));
        return descriptions.length > 0 ? descriptions[0] : item.name;
      default:
        return item.name;
    }
  });
  
  const uniqueFormats = format.filter((item, index) => {
    return format.indexOf(item) === index && item !== 'All Media' && item !== 'Box Set';
  });

  const formatsString = uniqueFormats.join(', ');
  return formatsString;
};

export const stupidSpecificArtistNamingCriteria = (diskInfo: any, multi: boolean) => {
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
