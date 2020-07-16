import React, { Fragment } from 'react';
import { ResponsiveLine } from '@nivo/line';

import ErrorMessage from "../../ErrorMessage";
import PropTypes from 'prop-types';

const Users = ({ data, isVisitors = false }) => (
  <Fragment>
  {data.length ?
      <ResponsiveLine
        data={[{id: isVisitors ? 'Unique Visitors' : 'Registered users', data }]}
        margin={{ top: 50, right: 110, bottom: 50, left: 60 }}
        xScale={{ type: 'point' }}
        yScale={{ type: 'linear' }}
        width={925}
        curve="monotoneX"
        colors={{ scheme: 'dark2' }}
        pointSize={7}
        lineWidth={4}
        areaOpacity={0.6}
        pointColor={{ theme: 'background' }}
        pointBorderWidth={2}
        pointBorderColor={{ from: 'serieColor' }}
        pointLabel="y"
        pointLabelYOffset={-12}
        useMesh={true}
        enableArea={true}
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
      />:
  <ErrorMessage />}
  </Fragment>
)

Users.propTypes = {
  data: PropTypes.array.isRequired,
  isVisitors: PropTypes.bool,
}

export default Users;