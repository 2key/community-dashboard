import React from 'react';
import { ResponsiveLine } from '@nivo/line';

import renderCampaignData from './renderCampaignData';
import PropTypes from "prop-types";
import Users from "../Users";

const Campaigns = ({ data }) => (
  <ResponsiveLine
    data={renderCampaignData(data)}
    margin={{ top: 50, right: 110, bottom: 50, left: 60 }}
    xScale={{ type: 'point' }}
    yScale={{ type: 'linear' }}
    width={925}
    axisBottom={{
      orient: 'bottom',
      tickSize: 5,
      tickPadding: 5,
      tickRotation: 0,
      legend: 'Months 2020',
      legendOffset: 36,
      legendPosition: 'middle'
    }}
    axisLeft={{
      orient: 'left',
      tickSize: 5,
      tickPadding: 5,
      tickRotation: 0,
      legend: 'Number of campaigns',
      legendOffset: -50,
      legendPosition: 'middle'
    }}
    curve="catmullRom"
    colors={{ scheme: 'category10' }}
    pointSize={7}
    lineWidth={4}
    areaOpacity={0.1}
    pointColor={{ theme: 'background' }}
    pointBorderWidth={2}
    pointBorderColor={{ from: 'serieColor' }}
    pointLabel="y"
    pointLabelYOffset={-12}
    animate={true}
    useMesh={true}
    motionStiffness={135}
    // enableArea={true}
    legends={[
      {
        anchor: 'top-left',
        direction: 'row',
        justify: false,
        translateX: -37,
        translateY: -40,
        itemsSpacing: 15,
        itemDirection: 'left-to-right',
        itemWidth: 130,
        itemHeight: 20,
        itemOpacity: 0.75,
        symbolSize: 13,
        symbolShape: 'circle',
        symbolBorderColor: 'rgba(0, 0, 0, .5)',
        effects: [
          {
            on: 'hover',
            style: {
              itemBackground: 'rgba(0, 0, 0, .03)',
              itemOpacity: 1
            }
          }
        ]

      }
    ]}
  />
)

Users.propTypes = {
  data: PropTypes.array.isRequired,
}

export default Campaigns;