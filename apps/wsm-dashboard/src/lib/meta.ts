import bizSdk from 'facebook-nodejs-business-sdk';
export const initMetaApi = () => bizSdk.FacebookAdsApi.init(process.env.META_ACCESS_TOKEN || '');
