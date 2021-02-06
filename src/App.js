import axios from 'axios';
import { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Box, Card, CardContent, Grid, Typography } from '@material-ui/core';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

import { API_HOST } from './const';

const prepareChartData = (data) => {
  return data.map((datum) => {
    return JSON.parse(datum);
  });
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

const App = () => {
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
                  <LineChart width={500} height={500} data={data}>
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
                    <Line
                      dot={false}
                      type='monotone'
                      dataKey='download'
                      stroke='#8884d8'
                    />
                    <Line
                      dot={false}
                      type='monotone'
                      dataKey='upload'
                      stroke='#fca311'
                    />
                    <Line
                      dot={false}
                      type='monotone'
                      dataKey='ping'
                      stroke='#941c2f'
                    />
                  </LineChart>
                </ResponsiveContainer>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </div>
  );
};

export default App;
