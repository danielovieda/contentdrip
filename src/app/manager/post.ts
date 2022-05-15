export interface Post {
  id: number,
  status: string,
  ayrId: string,
  ayrResponse: object,
  profileKeys: string[],
  platforms: string[],
  mediaIds: string[],
  link: object,
  scheduledDate: string,
  autoSchedule: boolean,
  autoHashtag: object,
  instagramOptions: object,
  faceBookOptions: object,
  redditOptions: object,
  youTubeOptions: object,
  autoRepost: object,
  tikTokOptions: object
}
