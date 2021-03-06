import React, { useEffect, useState, useCallback, useRef } from 'react';
import Web3 from 'web3'

import Loader from './Loader';
import Campaigns from './Graphs/Campaigns';
import Users from './Graphs/Users';
import { initMonth, getMonth, getBlocksNumberPlasma } from './utils';
import {
  getCampaignsPerMonth,
  getLatestSyncedBlock
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

  const [windowWidth, setWindowWidth] = useState(375);

  const monthArr = initMonth();

  const gettingData = useCallback(async () => {

    const latestIndexedBlock = await getLatestSyncedBlock();

    const plasmaBlockNumbers = getBlocksNumberPlasma(monthArr, (latestIndexedBlock - 60));

    const campaignData = await getCampaignsPerMonth(plasmaBlockNumbers)
      .catch(err => {
        console.warn(err);

        setIsCampaignLoaded(true);
        return [];
      });

    if(campaignData.length) {
      const convertedCampaignData = campaignData.reverse().reduce((acc, data, index) => {
        const {
          _acquisitionCampaignCreatedCounter: token,
          _n_campaigns: cpc,
          _plasmaToHandleCounter: registerUsers,
          _visitCounter: uniqueVisitors,
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
          ],
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
        };
      }, { token:[], cpc: [], donation: [], uniqueVisitors: [], registerUsers: [] })

      setUniqVisitors(convertedCampaignData.uniqueVisitors);
      setRegisterUsers(convertedCampaignData.registerUsers);
      setCampaignsData(convertedCampaignData);
      setIsCampaignLoaded(true);
    }
  }, [monthArr]);

  const getWindowWidth = useCallback(
    () => {
      setWindowWidth(window.innerWidth);
    }, [setWindowWidth]);

  const calcGraphWidth = useCallback(
    () => {
      if (windowWidth <= 768) {
        return windowWidth + 50
      }

      return 900
    }, [windowWidth]
  );

  useEffect(() => {
    gettingData();
    getWindowWidth();

    window.addEventListener('resize', getWindowWidth);

    return () => () => {
      window.removeEventListener('resize', getWindowWidth);
    }
  }, []);

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
              ? (
                <Users
                  data={uniqVisitors}
                  isVisitors
                  graphWidth={calcGraphWidth()}/>
                  )
              : <Loader />
            }
          </div>
        </div>
        <div className="container">
          <h2>Number of Created Campaigns</h2>
          <div className="graph">
            {isCampaignLoaded
              ? <Campaigns data={campaignsData} graphWidth={calcGraphWidth()} />
              : <Loader />
            }
          </div>
        </div>
        <div className="container grey">
          <h2>Registered users</h2>
          <div className="graph">
            {isRegisterUsersLoaded
              ? <Users data={registerUsers} graphWidth={calcGraphWidth()} />
              : <Loader />
            }
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
