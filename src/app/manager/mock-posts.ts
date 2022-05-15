import { Post } from './post';

export const POSTS: Post[] = [
  { id: 94949,
    status: 'pending',
    ayrId: 'someAyrID123',
    ayrResponse: { data: 'some data'},
    profileKeys: ['someKey1', 'someKey2'],
    platforms: ['facebook', 'twitter'],
    mediaIds: ['mediaId1','mediaId2'],
    link: {data: 'some link data'},
    scheduledDate: '6/15/2021',
    autoSchedule: false, //remove
    autoHashtag: {},
    instagramOptions: {},
    faceBookOptions: {},
    redditOptions: {},
    youTubeOptions: {},
    autoRepost: {},
    tikTokOptions: {}
  },
    { id: 686868,
      status: 'pending',
      ayrId: 'someAyrID123',
      ayrResponse: { data: 'some data'},
      profileKeys: ['someKey1', 'someKey2'],
      platforms: ['facebook'],
      mediaIds: ['mediaId1','mediaId2'],
      link: {data: 'some link data'},
      scheduledDate: '6/15/2021',
      autoSchedule: false,
      autoHashtag: {},
      instagramOptions: {},
      faceBookOptions: {},
      redditOptions: {},
      youTubeOptions: {},
      autoRepost: {},
      tikTokOptions: {}
    }
]
