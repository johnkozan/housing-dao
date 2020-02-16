import React, { useState, useEffect }  from 'react';
import { ethers } from 'ethers';

import { Chart, ArgumentAxis, ValueAxis, LineSeries } from "@devexpress/dx-react-chart-material-ui";
import { HoverState } from '@devexpress/dx-react-chart';

const dataPoints = [
  //'0.001',
  '0.01',
  '0.1',
  '1.0',
  '10',
  '100',
  '1000',
  '10000',
];


export const Curve = (props) => {
  const { contract } = props;

  const [ loaded, setLoaded ] = useState(false);
  const [ data, setData ] = useState([]);

  useEffect(() => {
    if (!contract) { return; }
    (async function() {

      let results = [];
      for (let i=0; i<dataPoints.length; i++) {

        const ethAmt = ethers.utils.parseEther(dataPoints[i]);
        const buyPrice = await contract.calculateTokensReceived(ethAmt);
        results.push({argument: dataPoints[i], value: ethers.utils.formatEther(buyPrice, 18)});
      }

      setData(results);

      console.log('Curve results: ', results);
      setLoaded(true);

    })();
  }, [contract]);

  if (!loaded || !contract) {
    return <div>Loading Bonding curve...</div>;
  }

  return (
    <div>

      <Chart data={data}>
        <ArgumentAxis />
        <ValueAxis />
        <LineSeries valueField="value" argumentField="argument" />
        <HoverState />
      </Chart>


    </div>
  );

};
