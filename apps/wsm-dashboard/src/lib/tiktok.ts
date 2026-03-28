import axios from 'axios';
export const getTikTokClient = () => axios.create({ baseURL: 'https://business-api.tiktok.com/open_api/v1.3/', headers: { 'Access-Token': process.env.TIKTOK_ACCESS_TOKEN || '', 'Content-Type': 'application/json' } });
export const getTikTokCampaigns = async (advertiserId: string) => { const client = getTikTokClient(); const response = await client.get(`/campaign/get/?advertiser_id=${advertiserId}`); return response.data; };
