import React, {Fragment} from 'react';
import { ResponsiveLine } from '@nivo/line';

import renderCampaignData from './renderCampaignData';
import PropTypes from "prop-types";
import ErrorMessage from "../../ErrorMessage";

const Campaigns = ({ data, graphWidth }) => {
  const isMobile = graphWidth !== 900;

  return(
    <Fragment>
      {Object.keys(data).length ?
        <ResponsiveLine
          data={renderCampaignData(data)}
          margin={{ top: 50, right: 110, bottom: 50, left: 60 }}
          xScale={{ type: 'point' }}
          yScale={{ type: 'linear' }}
          width={graphWidth}
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
          legends={[
            {
              anchor: 'top-left',
              direction: isMobile ? 'column' : 'row',
              justify: false,
              translateX: -37,
              translateY: isMobile ? -50 : -40,
              itemsSpacing: isMobile ? 1 : 15,
              itemDirection: 'left-to-right',
              itemWidth: 120,
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
        /> :
        <ErrorMessage />}
    </Fragment>
  )
}

Campaigns.propTypes = {
  data: PropTypes.object.isRequired,
}

export default Campaigns;