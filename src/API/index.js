import axios from 'axios';

const apiKey = 'GMUZIIH5AJYQDVIZJTH5M96I9IFKCJUTTP';

const getBlockByTimestamp = timestamp => {
    const url = `https://api.etherscan.io/api?module=block&action=getblocknobytime&timestamp=${timestamp}&closest=before&apikey=${apiKey}`;

    return axios.get(url)
        .then(({ data }) => data.result)
}

export const getBlocksByTimestamp = arr => {
    const promises = arr.map(timestamp => getBlockByTimestamp(timestamp))

    return Promise.all(promises);
}

const getCampaignsCounter = blockNumber => {
    const GET_CAMPAIGNS_QUERY = `{
          metas(block: { number: ${+blockNumber} }) {
            id
            _donationCampaignCreatedCounter
            _acquisitionCampaignCreatedCounter
            _cpcCampaignCreatedCounter
          }
        }
    `;

    return axios({
        url: 'https://api.thegraph.com/subgraphs/name/2key/prod',
        method: 'post',
        data: {
            query: GET_CAMPAIGNS_QUERY,
        }
    }).then(({ data: { data: { metas } } }) => metas[0])
}

export const getCampaignsPerMonth = arr => Promise.all(arr.map(blockNumber => getCampaignsCounter(blockNumber)));

const getUniqUsersCounter = blockNumber => {
  const GET_UNIQ_USERS_QUERY = `{
    metas(block: { number: ${+blockNumber} }) {
      _visitCounter
      _plasmaToHandleCounter
    }
  }`

  return axios({
    url: 'https://prod.api.graph.plasma.2key.net/subgraphs/name/plasma',
    method: 'post',
    data: {
      query: GET_UNIQ_USERS_QUERY,
    }
  })
  .then(({ data: { data: { metas } } }) => metas[0])
}

export const getUniqUsersPerMonth = monthArr =>
  Promise.all(monthArr.map(blockNumber => getUniqUsersCounter(blockNumber)));