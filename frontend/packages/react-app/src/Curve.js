import React, { useState, useEffect }  from 'react';
import { ethers } from 'ethers';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';

import { Chart, ArgumentAxis, ValueAxis, LineSeries, Title } from "@devexpress/dx-react-chart-material-ui";
import { HoverState } from '@devexpress/dx-react-chart';

const dataPoints = [
  //'0.001',
  //'0.01',
  //'0.025',
  '0.05',
  '0.1',
  '0.25',
  '0.50',
  '1.00',
  '10',
  '100',
  '1000',
  //'10000',
  //'100000',
  //'1000000',
  //'10000000',
  //'100000000',
];

const titleStyles = {
  title: {
    textAlign: 'center',
    width: '100%',
    marginBottom: '10px',
  },
};
const Text = withStyles(titleStyles)((props) => {
  const { text, classes } = props;
  const [mainText, subText] = text.split('\\n');
  return (
    <div className={classes.title}>
      <Typography component="h3" variant="h5">
        {mainText}
      </Typography>
      <Typography variant="subtitle1">{subText}</Typography>
    </div>
  );
});

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

        <Title
          text="Bonding Curve Visualization"
          textComponent={Text}
        />
      </Chart>


    </div>
  );

};
