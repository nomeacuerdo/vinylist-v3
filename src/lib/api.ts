import { Release, PaginationType, FolderType } from '@/lib/types';

function getDiscogsRequestInit(): RequestInit {
  const token = process.env.DISCOGS_TOKEN;

  if (!token) {
    throw new Error('Missing DISCOGS_TOKEN');
  }

  return {
    cache: 'no-store',
    headers: {
      Authorization: `Discogs token=${token}`,
      'user-agent': 'Vinylist/3.3 +https://discos.nomeacuerdo.co',
    },
  };
}

function withDiscogsToken(url: string): string {
  const token = process.env.DISCOGS_TOKEN;

  if (!token) {
    throw new Error('Missing DISCOGS_TOKEN');
  }

  const parsedUrl = new URL(url);
  parsedUrl.searchParams.set('token', token);
  return parsedUrl.toString();
}

export async function getReleaseData(url: string): Promise<Release> {
  const res = await fetch(url, getDiscogsRequestInit());

  if (!res.ok) {
    throw new Error('Failed to fetch data')
  }
  const data = await res.json();
  return data.releases ? data.releases[0] : data;
}

export async function getParentReleaseData(url: string): Promise<Release> {
  const res = await fetch(url, getDiscogsRequestInit());

  if (!res.ok) {
    throw new Error('Failed to fetch data')
  }

  return await res.json();
}

export async function getFolders(
  url: string = `https://api.discogs.com/users/${process.env.USERNAME}/collection/folders`
): Promise<any[]> {
  const res = await fetch(withDiscogsToken(url), getDiscogsRequestInit());
  const { folders } = await res.json();

  if (!res.ok) {
    throw new Error('Failed to fetch data')
  }
  return folders;
}

export async function getFolderData(url: string): Promise<FolderType> {
  const res = await fetch(url, getDiscogsRequestInit());
  const folder = await res.json();

  if (!res.ok) {
    throw new Error('Failed to fetch data')
  }

  return folder;
}

export async function getWantlistData(
  url: string = `https://api.discogs.com/users/${process.env.USERNAME}/wants?per_page=100`
): Promise<[Release[], PaginationType]> {
  const res = await fetch(url, getDiscogsRequestInit());
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
  const res = await fetch(url, getDiscogsRequestInit());
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
