import { Post } from './post';
import { Media } from './media';

export interface Campaign {
  user_id: string,
  campaign_id: string,
  creationDate: string,
  subscriptionPlan: number,
  status: string,
  title: string,
  description: string,
  startDate: string,
  endDate: string,
  profileKeys: string,
  platforms: string[],
  links: string[],
  postsPerDay: number,
  postText: string[],
  morphLevel: number,
  useMorph: boolean,
  hashTagPool: string[],
  autoHashTag: boolean,
  smartSchedule: boolean,
  startTime: string,
  endTime: string,
  timezone: string,
  scheduleDays: string[],
  watermarkText: string,
  watermarkPos: string,
  watermarkImg: string,
  autoRepost: boolean,
  repostRepeat: number,
  repostDays: number,
  igLocation: string[],
  igUsers: string[],
  igUsersToTag: number,
  subreddits: string[],
  uniqueDistro: boolean,
  posts: string[],
  media: []
}
