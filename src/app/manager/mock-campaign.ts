import { Campaign } from './campaign';
import { POSTS } from './mock-posts';
import { MEDIAS } from './mock-media';

export const CAMPAIGNS: Campaign[] = [
  {
    user_id: '441da5b3-82ed-43ab-812d-4d6e5886f86e',
    campaign_id: '0b38abe1-fb37-4e75-a06c-c3e1b7f911a0',
    creationDate: '8/15/2021',
    subscriptionPlan: 0,
    status: 'active',
    title: 'Mock Campaign',
    description: 'Description of Campaign A is amazing.',
    startDate: '6/15/2021',
    endDate: '6/30/2021',
    timezone: 'America/Los Angeles',
    profileKeys: '',
    platforms: [''],
    links: [''],
    postsPerDay: 2,
    postText: ['post description selection 1'],
    morphLevel: 3,
    useMorph: false,
    hashTagPool: ['#one', '#two', '#three'],
    autoHashTag: false,
    smartSchedule: true,
    startTime: "",
    endTime: "",
    scheduleDays: ["1","2","3","4","5"],
    watermarkText: "contentdrip.io",
    watermarkPos: "",
    watermarkImg: "",
    autoRepost: false,
    repostRepeat: 0,
    repostDays: 0,
    igLocation: ["none"],
    igUsers: ["iguser"],
    igUsersToTag: 0,
    subreddits: ["subreddit"],
    uniqueDistro: true,
    posts: [],
    media: []
  },

]
