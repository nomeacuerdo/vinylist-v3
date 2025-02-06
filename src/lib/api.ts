import { Release, PaginationType, FolderType } from '@/lib/types';

export async function getReleaseData(url: string): Promise<Release> {
  const res = await fetch(url, {
    headers: {
      Authorization: `Discogs token=${process.env.DISCOGS_TOKEN}`,
      'user-agent': 'Vinylist/3.1 +https://discos.nomeacuerdo.co',
    }
  });

  if (!res.ok) {
    throw new Error('Failed to fetch data')
  }
  const { releases } = await res.json();

  return releases[0];
}

export async function getParentReleaseData(url: string): Promise<Release> {
  const res = await fetch(url, {
    headers: {
      Authorization: `Discogs token=${process.env.DISCOGS_TOKEN}`,
      'user-agent': 'Vinylist/3.1 +https://discos.nomeacuerdo.co',
    }
  });

  if (!res.ok) {
    throw new Error('Failed to fetch data')
  }

  return await res.json();
}

export async function getFolders(
  url: string = `https://api.discogs.com/users/${process.env.USERNAME}/collection/folders`
): Promise<any[]> {
  const res = await fetch(url, {
    headers: {
      Authorization: `Discogs token=${process.env.DISCOGS_TOKEN}`,
      'user-agent': 'Vinylist/3.1 +https://discos.nomeacuerdo.co',
    }
  });
  const { folders } = await res.json();

  if (!res.ok) {
    throw new Error('Failed to fetch data')
  }
  return folders;
}

export async function getFolderData(url: string): Promise<FolderType> {
  const res = await fetch(url, {
    headers: {
      Authorization: `Discogs token=${process.env.DISCOGS_TOKEN}`,
      'user-agent': 'Vinylist/3.1 +https://discos.nomeacuerdo.co',
    }
  });
  const folder = await res.json();

  if (!res.ok) {
    throw new Error('Failed to fetch data')
  }

  return folder;
}

export async function getWantlistData(
  url: string = `https://api.discogs.com/users/${process.env.USERNAME}/wants?per_page=100`
): Promise<[Release[], PaginationType]> {
  const res = await fetch(url, {
    headers: {
      Authorization: `Discogs token=${process.env.DISCOGS_TOKEN}`,
      'user-agent': 'Vinylist/3.1 +https://discos.nomeacuerdo.co',
    }
  });
  const { wants, pagination } = await res.json();

  if (!res.ok) {
    throw new Error('Failed to fetch data')
  }

  if (pagination.page < pagination.pages) {
    const nextData = await getData(pagination.urls.next);
    return [wants.concat(nextData[0]), pagination];
  } else {
    return [wants, pagination];
  }
}

export async function getData(
  url: string = `https://api.discogs.com/users/${process.env.USERNAME}/collection/folders/0/releases?per_page=100`
): Promise<any[]> {
  const res = await fetch(url, {
    headers: {
      Authorization: `Discogs token=${process.env.DISCOGS_TOKEN}`,
      'user-agent': 'Vinylist/3.1 +https://discos.nomeacuerdo.co',
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
