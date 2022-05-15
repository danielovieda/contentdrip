const host = window.location.hostname;
const port = 3000;
let https = false;
let str = "http://";
let web_host = host;

if (host === "localhost") {
  https = false;
  str = "http://";
  web_host = host + ":4200";
}

// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

// export const environment = {
//   production: false
// };

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
export const environment = {
env: "dev",
production: true,
staging: false,

  publicKey: "public_neHutmRSL48v+MsPNRkWYMvRwZ4=",
  urlEndpoint: "https://ik.imagekit.io/mishow",

  API_URL: "https://d365jxlrgh.execute-api.us-east-2.amazonaws.com/dev/",

  CAMPAIGN_URL: "https://qmxzt0hti9.execute-api.us-east-2.amazonaws.com/api/v1/campaign/",

  CAMPAIGN_V2_URL: "https://x4e18sqe29.execute-api.us-east-2.amazonaws.com/dev/v1/campaign",

  //SETTINGS_URL: "https://9l5h0habdi.execute-api.us-east-2.amazonaws.com/api/v1/settings/",

  SETTINGS_URL: "https://zunqodv9k1.execute-api.us-east-2.amazonaws.com/dev/cd/setting",

  ACTIVE_PROFILES_URL: "https://9l5h0habdi.execute-api.us-east-2.amazonaws.com/api/v1/get_active_accounts",

  LINK_URL: "https://opxrifdgrd.execute-api.us-east-2.amazonaws.com/api/",

  //POST_URL: "https://xjpfjzbzn4.execute-api.us-east-2.amazonaws.com/api/post",

  POST_URL: "https://box9qp2oad.execute-api.us-east-2.amazonaws.com/dev/post/get/", //v2

  MEDIA_URL: "https://tm8l26l8h6.execute-api.us-east-2.amazonaws.com/prod/s3/getpresignurl/upload/",

  //ADDMEDIA_URL: "https://d9hpjn2s51.execute-api.us-east-2.amazonaws.com/api/media/add",

  ADDMEDIA_URL: "https://x4e18sqe29.execute-api.us-east-2.amazonaws.com/dev/media/add",

  //GETMEDIA_URL: "https://d9hpjn2s51.execute-api.us-east-2.amazonaws.com/api/media/newcampaign",

  GETSIGNEDURLS: "https://x4e18sqe29.execute-api.us-east-2.amazonaws.com/dev/media/newcampaign/",

  GETMEDIA_URL: "https://x4e18sqe29.execute-api.us-east-2.amazonaws.com/dev/media/list/",

  //CREATE_PROFILE_URL: "https://u411hoe5fg.execute-api.us-east-2.amazonaws.com/dev/create-profile", //https://u411hoe5fg.execute-api.us-east-2.amazonaws.com/dev/ayr/create-profile/{user_id}/{title}/{profile_name}

  CREATE_PROFILE_URL: "https://stxhl8jalj.execute-api.us-east-2.amazonaws.com/prod/create-profile", // V2
  //GET_LOGIN_URL: "https://u411hoe5fg.execute-api.us-east-2.amazonaws.com/dev/ayr/jwt-url/", //https://u411hoe5fg.execute-api.us-east-2.amazonaws.com/dev/ayr/jwt-url/{profile_key}

  GET_LOGIN_URL: "https://stxhl8jalj.execute-api.us-east-2.amazonaws.com/prod/cd/jwt-url",  //VERSION 2 -- NOW POST -- SEND AUTH

  SECURED_GET_USER_URL: "https://zunqodv9k1.execute-api.us-east-2.amazonaws.com/dev/cd/user",

  SECURED_GET_CAMPAIGN_LIST: "https://x4e18sqe29.execute-api.us-east-2.amazonaws.com/dev/v1/campaign",

  DELETE_AYR_PROFILE_URL: "https://stxhl8jalj.execute-api.us-east-2.amazonaws.com/prod/delete-profile",

  GENERATE_POSTS_URL: "https://box9qp2oad.execute-api.us-east-2.amazonaws.com/dev/post/create",

  DELETE_SINGLE_POST_URL : "https://box9qp2oad.execute-api.us-east-2.amazonaws.com/dev/post/delete/",

  DELETE_CAMPAIGN_URL: "https://x4e18sqe29.execute-api.us-east-2.amazonaws.com/dev/v1/campaign",

  DELETE_MEDIA_URL: "https://x4e18sqe29.execute-api.us-east-2.amazonaws.com/dev/media/remove",

  DELETE_CAMPAIGN_ALL_V2_URL: "https://box9qp2oad.execute-api.us-east-2.amazonaws.com/dev/post/delete-campaign/", //deletes campaign, all posts and links for posts

  GET_SIGNED_URL_V2: "https://x4e18sqe29.execute-api.us-east-2.amazonaws.com/dev/signed_url",

  WATERMARK_SAMPLE_URL_V1: "https://d99grp55c7.execute-api.us-east-2.amazonaws.com/api",

};
