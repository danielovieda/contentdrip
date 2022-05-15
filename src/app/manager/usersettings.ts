export interface UserSettings {

  subscriptionPlan: number,  //free plan = 0, basic plan = 1, influencer = 2, mega influencer = 3
  expirationDate: string, //subscription plan expiration.. +30 days from successful payment date

  maxSocialNetworks: number, //1, 2, 3, 5
  maxProfiles: number, //1, 1, 3, 5
  maxPostsPerDay: number, //2, 5, 15, 24
  maxLinksPerCampaign: number, //2, 5, 10, 99
  maxCampaigns: number, //2, 5, 10, 99
  maxImages: number, //30, 50, 75, 100
  maxVideos: number, //0, 15, 30, 99
  maxIgUsers: number, //30, 75, 150
  maxTextPerCampaign: number, //10, 30, 50, 75
  maxHashTagsPerCampaign: number, //30, 60, 120, 500
  maxMorphLevel: number, //0, 2, 3, 3
  maxAutoRepost: number, //0, 2, 5, 10
  maxSubreddits: number, //1, 5, 15, 30

  hasAutoHashTag: boolean, //false, true, true, true
  hasAutoRepost: boolean, //false, true, true, true
  hasSmartSchedule: boolean, //false, false, true, true
  hasLinkAnalytics: boolean, //false, false, true, true
  hasAdvancedOptions: boolean, //false, true, true, true
  hasProgrammableDescription: boolean, //false, false, false, true
  hasUniqueDistribution: boolean, //false, false, true, true
  hasBulkDelete: boolean, //false, false, true, true
  hasCustomWatermark: boolean, //false, true, true, true

  defaultWatermark: string, //default for all: 'via contentdrip.io'
  defaultWatermarkTextOptions: string, //default for all: 'otbg-00000075,otc-FFFFFF,ots-24'
  defaultWatermarkPosition: string, //default for all: 'xo-N10,oy-N10'
  defaultWatermarkImg: string, //default for all: ''
  defaultStartHour: number, //default for all: 9
  defaultStartMinute: number, //default for all: 05
  defaultEndHour: number, //default for all: 21
  defaultEndMinute: number, //default for all: 35
  defaultScheduleDays: string[], //default for all: ['0','1','2','3','4','5','6']
  defaultTimezone: string, //default for all: 'America/Los_Angeles'

  ayrshare_profiles?: [{ status: string, title: string, refId: string, profileKey: string, profile_name: string}]
}
