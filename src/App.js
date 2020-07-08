import React, { useEffect, useState, useCallback, useRef } from 'react';
import Web3 from 'web3'

import Loader from './Loader';
import Campaigns from './Graphs/Campaigns';
import Users from './Graphs/Users';
import { initMonth, getMonth, getBlocksNumberPlasma } from './utils';
import {
  getBlocksByTimestamp,
  getCampaignsPerMonth,
  getUniqUsersPerMonth,
} from './API'
import TwoKeyLogo from '../src/img/logo.svg';

import './App.css';

function App() {
  const isDidMount = useRef(true);
  const [campaignsData, setCampaignsData] = useState({});
  const [isCampaignLoaded, setIsCampaignLoaded] = useState(false);

  const [uniqVisitors, setUniqVisitors] = useState([]);
  const [isUniqUsersLoaded, setIsUniqUsersLoaded] = useState(false);

  const [registerUsers, setRegisterUsers] = useState([]);
  const [isRegisterUsersLoaded, setIsRegisterUsersLoaded] = useState(false);

  const monthArr = initMonth();

  const gettingData = useCallback(async () => {
    const web3 = new Web3(process.env.REACT_APP_WEB3_PROVIDER)

    const { number: latestBlock } = await web3.eth.getBlock('latest')
    const plasmaBlockNumbers = getBlocksNumberPlasma(monthArr, (latestBlock - 60))

    const blockNumbers = await getBlocksByTimestamp(monthArr);

    const uniqUsers = await getUniqUsersPerMonth(plasmaBlockNumbers)
      .catch(err => {
        console.warn(err);
        setIsRegisterUsersLoaded(true);
        setIsUniqUsersLoaded(true);
        return [];
      });

    if(!uniqUsers.length) {
      const convertedUniqUsersData = uniqUsers.reverse().reduce(
        (acc, item, index) => {
          const {
            _plasmaToHandleCounter: registerUsers,
            _visitCounter: uniqueVisitors,
          } = item;
          const month = getMonth(monthArr, 4 - index);

          return {
            uniqueVisitors: [
              ...acc.uniqueVisitors,
              {
                y: uniqueVisitors,
                x: month,
              }
            ],
            registerUsers: [
              ...acc.registerUsers,
              {
                y: registerUsers,
                x: month,
              }
            ]
          }
        }, { uniqueVisitors: [], registerUsers: [] })

      setUniqVisitors(convertedUniqUsersData.uniqueVisitors);
      setRegisterUsers(convertedUniqUsersData.registerUsers);
    }

    const campaignData = await getCampaignsPerMonth(blockNumbers)
      .catch(err => {
        console.warn(err);

        setIsCampaignLoaded(true);
        return [];
      });

    if(campaignData.length) {
      const convertedCampaignData = campaignData.reverse().reduce((acc, data, index) => {
        const {
          _acquisitionCampaignCreatedCounter: token,
          _cpcCampaignCreatedCounter: cpc,
          _donationCampaignCreatedCounter: donation
        } = data;

        const month = getMonth(monthArr, 4 - index);

        return {
          token: [
            ...acc.token,
            {
              y: token,
              x: month,
            }
          ],
          cpc: [
            ...acc.cpc,
            {
              y: cpc,
              x: month,
            }
          ],
          donation:[
            ...acc.donation,
            {
              y: donation,
              x: month,
            }
          ]
        };
      }, { token:[], cpc: [], donation: [] })

      setCampaignsData(convertedCampaignData);
      setIsCampaignLoaded(true);
    }
  }, [monthArr])

  useEffect(() => {
    gettingData();
  }, [])

  useEffect(() => {
    if(isDidMount.current) {
      isDidMount.current = false;
    } else {
      if(uniqVisitors.length && !isUniqUsersLoaded) setIsUniqUsersLoaded(true);
      if(campaignsData.length && !isCampaignLoaded) setIsCampaignLoaded(true);
      if(registerUsers.length && !isRegisterUsersLoaded) setIsRegisterUsersLoaded(true);
    }
  }, [uniqVisitors, campaignsData, registerUsers])

  return (
    <div className="two-key-metrics">
      <header>
        <img src={TwoKeyLogo} alt="2key logo"/>
        <span className="header-metrics">
          Community Dashboard
        </span>
      </header>
      <div className="main">
        <div className="container grey">
          <h2>Unique visitors in 2key campaigns</h2>
          <div className="graph">
            {isUniqUsersLoaded
              ? <Users data={uniqVisitors} isVisitors />
              : <Loader />
            }
          </div>
        </div>
        <div className="container">
          <h2>Number of Created Campaigns</h2>
          <div className="graph">
            {isCampaignLoaded
              ? <Campaigns data={campaignsData} />
              : <Loader />
            }
          </div>
        </div>
        <div className="container grey">
          <h2>Registered users</h2>
          <div className="graph">
            {isRegisterUsersLoaded
              ? <Users data={registerUsers} />
              : <Loader />
            }
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
