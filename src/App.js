import axios from 'axios';
import { endsWith, range, forEach } from 'lodash';
import { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Box, Card, CardContent, Grid, Typography } from '@material-ui/core';
import {
  Area,
  AreaChart,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

import { API_HOST } from './const';

const prepareChartData = (data) => {
  let timeNow = Math.round(new Date().getTime() / 1000);
  timeNow = timeNow - (timeNow % 60);
  const timeStart = timeNow - 86400;

  let timeseries = data.map((datum) => {
    const val = JSON.parse(datum);
    if (endsWith(String(val.timestamp), '1')) val.timestamp = val.timestamp - 1;
    if (endsWith(String(val.timestamp), '2')) val.timestamp = val.timestamp - 2;
    if (endsWith(String(val.timestamp), '3')) val.timestamp = val.timestamp - 3;
    return val;
  });

  const returnArr = [];
  let idx = 0;
  // loop through the data and if there's any missing data fill it in
  forEach(range(timeStart, timeNow, 60), function (time) {
    let nextVal = timeseries[idx];

    if (nextVal.timestamp === time) {
      returnArr.push(nextVal);
      idx += 1;
    }
    if (nextVal.timestamp < time) {
      returnArr.push(nextVal);
      idx += 1;
    } else {
      returnArr.push({ timestamp: time, download: 0, upload: 0, ping: 0 });
    }
  });
  return returnArr;
};

const formatTimestamp = (timestamp) => {
  const date = new Date(timestamp * 1000).toLocaleTimeString();
  return `${date.slice(0, date.lastIndexOf(':'))} ${date.slice(-2)}`;
};

const useStyles = makeStyles(() => ({
  root: {
    flexGrow: 1,
    backgroundColor: '#212529',
    width: '100%',
  },
  card: {},
}));

export default function App() {
  const classes = useStyles();
  const [data, setData] = useState();

  useEffect(() => {
    function getData() {
      return axios
        .get(`${API_HOST}/tests/past-day`)
        .then((response) => {
          setData(prepareChartData(response.data['payload']));
        })
        .catch((error) => console.error(error));
    }
    getData();
  }, []);

  console.log('data: ', data);
  return (
    <div className={classes.root}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Card className={classes.card}>
            <CardContent>
              <Typography className={classes.title} gutterBottom>
                Internet Speed
              </Typography>
              <Box height={400} position='relative'>
                <ResponsiveContainer minHeight='250' minWidth='250'>
                  <AreaChart width={500} height={500} data={data}>
                    <XAxis
                      dataKey='timestamp'
                      padding={{ right: 40 }}
                      tickFormatter={formatTimestamp}
                      angle={45}
                      tickMargin={3}
                      textAnchor='begin'
                      height={60}
                    />
                    <YAxis />
                    <Tooltip
                      labelFormatter={formatTimestamp}
                      formatter={(value, name, props) => {
                        if (['download', 'upload'].includes(name))
                          return `${value} Mbps`;
                        return `${value} ms`;
                      }}
                    />
                    <Area
                      dot={false}
                      type='monotone'
                      dataKey='download'
                      stroke='#8884d8'
                    />
                    <Area
                      dot={false}
                      type='monotone'
                      dataKey='upload'
                      stroke='#fca311'
                    />
                    <Area
                      dot={false}
                      type='monotone'
                      dataKey='ping'
                      stroke='#941c2f'
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </div>
  );
}
