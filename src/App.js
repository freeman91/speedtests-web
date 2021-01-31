import { useState, useEffect } from 'react';
import axios from 'axios';

const prepareChartData = (data) => {
  return data.map((datum) => {
    return JSON.parse(datum);
  });
};

const App = () => {
  const [data, setData] = useState();

  useEffect(() => {
    function getData() {
      return axios
        .get('http://192.168.0.42:9000/tests/past-day')
        .then((response) => {
          setData(prepareChartData(response.data['payload']));
        })
        .catch((error) => console.error(error));
    }
    getData();
  }, []);

  console.log('data: ', data);

  return <div className='App'></div>;
};

export default App;
