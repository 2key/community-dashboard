import axios from 'axios';

const getCampaignsCounter = blockNumber => {
    const GET_CAMPAIGNS_QUERY = `{
          metas(block: { number: ${+blockNumber} }) {
            id
            _n_campaigns
            _visitCounter
            _plasmaToHandleCounter
          }
        }
    `;

    return axios({
        url: 'https://api.2key.network/subgraphs/name/plasma',
        method: 'post',
        data: {
            query: GET_CAMPAIGNS_QUERY,
        }
    }).then((res) => {

        const { data: { data: { metas } } } = res;
        return metas[0];
    })
};

export const getCampaignsPerMonth = arr => Promise.all(arr.map(blockNumber => getCampaignsCounter(blockNumber)));

export const getLatestSyncedBlock = () => {
    const GET_LATEST_BLOCKS_QUERY = `{
indexingStatuses{
    chains{
      latestBlock{
        number
      }
    }
  }
}`;

    return axios({
        url: 'https://api.2key.network/subgraphs/plasma',
        method: 'post',
        data: {
            query: GET_LATEST_BLOCKS_QUERY,
        }
    })
        .then((res) => {
            return parseInt(res.data.data.indexingStatuses[0].chains[0].latestBlock.number, 10) - 80;
        })
};


