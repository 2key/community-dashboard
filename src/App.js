import React, { useEffect, useState, useCallback, useRef } from 'react';

import Campaigns from './Graphs/Campaigns';
import UniqUsers from './Graphs/UniqUsers';
import { initMonth, getMonth } from './utils';
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
    const blockNumbers = await getBlocksByTimestamp(monthArr);
    const uniqUsers = await getUniqUsersPerMonth(blockNumbers);

    const convertedUniqUsersData = uniqUsers.reverse().reduce(
      (acc, item, index) => {
        const {
          _plasmaToHandleCounter: registerUsers,
          _visitCounter: uniqueVisitors,
        } = item;
        const month = getMonth(monthArr, index);

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

    const campaignData = await getCampaignsPerMonth(blockNumbers);

    const convertedCampaignData = campaignData.reverse().reduce((acc, data, index) => {
      const {
        _acquisitionCampaignCreatedCounter: token,
        _cpcCampaignCreatedCounter: cpc,
        _donationCampaignCreatedCounter: donation
      } = data;

      const month = getMonth(monthArr, index);

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
          Metrics
        </span>
      </header>
      <div className="main">
        <div className="container grey">
          <h2>Unique visitors</h2>
          <div className="graph">
            {isUniqUsersLoaded && <UniqUsers data={uniqVisitors} isVisitors />}
          </div>
        </div>
        <div className="container">
          <h2>Number of campaigns</h2>
          <div className="graph">
            {isCampaignLoaded && <Campaigns data={campaignsData} />}
          </div>
        </div>
        <div className="container grey">
          <h2>Register users</h2>
          <div className="graph">
            {isRegisterUsersLoaded && <UniqUsers data={registerUsers} />}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
