export type Release = {
  id: number;
  date_added: string;
  rating: number;
  basic_information: {
    id: number;
    master_url: string;
    resource_url: string;
    thumb: string;
    cover_image: string;
    title: string;
    year: number;
    genres: string[];
    artists: {
      name: string;
    }[];
    formats: {
      descriptions: string[];
    }[];
  };
  notes: {
    field_id: number;
    value: string;
  }[];
};

export type FolderType = {
  id: number;
  count: number;
  name: string;
  resource_url: string;
};

// {
//   "folders": [
//     {
//       "id": 0,
//       "count": 23,
//       "name": "All",
//       "resource_url": "https://api.discogs.com/users/example/collection/folders/0"
//     },
//     {
//       "id": 1,
//       "count": 20,
//       "name": "Uncategorized",
//       "resource_url": "https://api.discogs.com/users/example/collection/folders/1"
//     }
//   ]
// }

// {
//   id: 10886115,
//   instance_id: 667160083,
//   date_added: '2021-04-07T21:11:41-07:00',
//   rating: 0,
//   basic_information: {
//     id: 10886115,
//     master_id: 16797,
//     master_url: 'https://api.discogs.com/masters/16797',
//     resource_url: 'https://api.discogs.com/releases/10886115',
//     thumb: 'https://i.discogs.com/dJazyq1LKeRfSzH0wwa56onxXdBrm1P6blEqEz1Cq58/rs:fit/g:sm/q:40/h:150/w:150/czM6Ly9kaXNjb2dz/LWRhdGFiYXNlLWlt/YWdlcy9SLTEwODg2/MTE1LTE1MTkxNzEy/NDQtNDM0MC5qcGVn.jpeg',
//     cover_image: 'https://i.discogs.com/7UTi-tJIyQNxAPvSo5Y8bXE3NSRTLrlZM1_OEN2fUQQ/rs:fit/g:sm/q:90/h:596/w:600/czM6Ly9kaXNjb2dz/LWRhdGFiYXNlLWlt/YWdlcy9SLTEwODg2/MTE1LTE1MTkxNzEy/NDQtNDM0MC5qcGVn.jpeg',
//     title: 'Trompe Le Monde',
//     year: 2017,
//     formats: [ [Object] ],
//     artists: [ [Object] ],
//     labels: [ [Object] ],
//     genres: [ 'Rock' ],
//     styles: [ 'Alternative Rock' ]
//   },
//   notes: [
//     { field_id: 1, value: '2021-04-07' },
//     { field_id: 2, value: '1991' }
//   ]
// }
