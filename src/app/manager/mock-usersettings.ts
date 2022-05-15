import { UserSettings } from './usersettings';

export const userSettings: UserSettings = {
  subscriptionPlan: 1,
  hasAutoHashTag: true, //true = paid feature
  hasAutoRepost: true,
  hasSmartSchedule: true,
  hasLinkAnalytics: false,
  maxTextPerCampaign: 10,
  maxHashTagsPerCampaign: 100,
  maxMorphLevel: 3, // > 2 = paid feature
  hasProgrammableDescription:  false, //true = paid
  hasUniqueDistribution: true, //true = paid feature
  hasCustomWatermark: true,
  defaultWatermark: "contentdrip.io",
  defaultWatermarkPosition: "random",
  defaultWatermarkImg: "",
  hasBulkDelete: false, //true = paid
  maxCampaigns: 5,
  maxImages: 60, //more than 60 = paid feature
  maxVideos: 5, //more than x = paid
  maxIgUsers: 20,
  maxSocialNetworks: 2, //more than 2 = paid
  maxPostsPerDay: 10, //more than 2 = paid
  maxLinksPerCampaign: 5, //more than 1 = paid
  hasAdvancedOptions: true,
  defaultStartHour: 12,
  defaultStartMinute: 15,
  defaultEndHour: 22,
  defaultEndMinute: 55,
  defaultScheduleDays: ["1","2","3","4","5"],
  defaultTimezone: 'PST',
  defaultWatermarkTextOptions: '',
  maxProfiles: 2,
  expirationDate: '',
  maxSubreddits: 2,
  maxAutoRepost: 2,
}
