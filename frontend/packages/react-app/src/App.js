import React, { useState, useEffect } from 'react';
import { addresses, abis } from '@project/contracts';
//import { gql } from 'apollo-boost';
//import { useQuery } from '@apollo/react-hooks';
import { ethers } from 'ethers';
import { Curve } from './Curve';
import './App.css';

import AppBar from '@material-ui/core/AppBar';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CssBaseline from '@material-ui/core/CssBaseline';
import Grid from '@material-ui/core/Grid';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import TextField from '@material-ui/core/TextField';

//import Link from '@material-ui/core/Link';

const daoUrl = "https://alchemy-staging-rinkeby.herokuapp.com/dao/0xb46715c7fc2b537dbf55f2c59d01a1f080e07149";


const useStyles = makeStyles(theme => ({
  icon: {
    marginRight: theme.spacing(2),
  },
  heroContent: {
    backgroundColor: theme.palette.background.paper,
    padding: theme.spacing(8, 0, 6),
  },
  heroButtons: {
    marginTop: theme.spacing(4),
  },
  cardGrid: {
    paddingTop: theme.spacing(8),
    paddingBottom: theme.spacing(8),
  },
  card: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
  },
  cardMedia: {
    paddingTop: '56.25%', // 16:9
  },
  cardContent: {
    flexGrow: 1,
  },
  footer: {
    backgroundColor: theme.palette.background.paper,
    padding: theme.spacing(6),
  },
  hatchOpen: {
    color: 'orange',
  },
}));


const overrides = {
  gasLimit: 1123000,
  gasPrice: ethers.utils.parseUnits('9.0', 'gwei'),
};


function App() {
  const classes = useStyles();

  const [contract, setContract] = useState(undefined);

  const [tokenInfo, setTokenInfo] = useState({
    buyPrice: '',
    sellPrice: '',
    totalSupply: '',
    myBalance: '',
    myDividends: '',
    daoBalance: '',
  });

  const [buyPrice, setBuyPrice] = useState('');
  const [sellPrice, setSellPrice] = useState('');

  const [values, setValues] = useState({buy: '', sell: ''});
  const [prov, setProv] = useState({provider: undefined, signer: undefined});
  const [txHash, setTxHash] = useState(undefined);

  const updateBuyPriceFor = async (eth) => {
    try {
      const ethAmt = ethers.utils.parseEther(eth);
      const buyPrice = await contract.calculateTokensReceived(ethAmt);
      setBuyPrice(ethers.utils.formatEther(buyPrice, 18).toString());
    } catch (err) {
      console.log(err);
      return;
    }
  };
  const updateSellPriceFor = async (eth) => {
    try {
      const ethAmt = ethers.utils.parseEther(eth);
      const sellPrice = await contract.calculateEthereumReceived(ethAmt);
      setSellPrice(ethers.utils.formatEther(sellPrice, 18).toString());
    } catch (err) {
      console.log(err);
      return;
    }
  };

  const handleChange = (event) => {
    setValues({
      ...values,
      [event.target.name]: event.target.value
    });

    if (event.target.value === '' || event.target.value == '0') { return; }
    if (event.target.name === 'buy') {
      setBuyPrice('');
      updateBuyPriceFor(event.target.value);
    }
    if (event.target.name === 'sell') {
      setSellPrice('');
      updateSellPriceFor(event.target.value);
    }

  };

  const handleBuy = async () => {
    const params = [{
      from: prov.signer._address,
      to: addresses.token,
      value: ethers.utils.parseUnits(values.buy, 'ether').toHexString()
    }];

    const transactionHash = await prov.provider.send('eth_sendTransaction', params)
    setTxHash(transactionHash);
  };

  const handleWithdraw = async () => {
    const transactionHash = await contract.withdraw(overrides);
    setTxHash(transactionHash.hash);
  };

  const handleReinvest = async () => {
    const transactionHash = await contract.reinvest(overrides);
    setTxHash(transactionHash.hash);
  };

  const handleSell = async () => {
    const transactionHash = await contract.sell(ethers.utils.parseUnits(values.sell, 18).toHexString());
    setTxHash(transactionHash.hash);
  };

  useEffect(() => {
    (async function() {

      const p = new ethers.providers.Web3Provider(window.web3.currentProvider);
      const s = p.getSigner();

      setProv({provider: p, signer: s});

      const token = new ethers.Contract(addresses.token, abis.token, s);
      console.log(' TOKEN :::: ', token);
      setContract(token);

      const totalSupply = await token.totalSupply();
      const myBal = (await token.balanceOf(p.provider.selectedAddress)).toString();
      const myDivs = (await token.myDividends()).toString();
      const sellPrice = (await token.sellPrice()).toString();
      const buyPrice = (await token.buyPrice()).toString();
      const hatchOpen = (await token.hatchOpen());

      const daoBal = (await token.daoDividends()).toString();

      setTokenInfo({
        buyPrice:  parseFloat(1 / ethers.utils.formatEther(buyPrice.toString(), {comify: true}).toString()),
        sellPrice: ethers.utils.formatEther(sellPrice.toString(), {comify: true}).toString(),
        totalSupply: ethers.utils.formatEther(totalSupply.toString(), {comify: true}).toString(),
        myBalance: ethers.utils.formatEther(myBal, {comify: true}),
        daoBalance: ethers.utils.formatEther(daoBal, {comify: true}),
        myDividends: ethers.utils.formatEther(myDivs, {comify: true}),
        hatchOpen,
      });

    })();
  }, []);


  return (
    <React.Fragment>
      <CssBaseline />
      <AppBar position="relative">
        <Toolbar>
          <Typography variant="h6" color="inherit" noWrap>
            Castle DAO
          </Typography>
        </Toolbar>
      </AppBar>
      <main>
        <div className={classes.heroContent}>
          <Container maxWidth="sm">
            <Typography component="h1" variant="h2" align="center" color="textPrimary" gutterBottom>
              Castle DAO
            </Typography>
            <Typography variant="h5" align="center" color="textSecondary" paragraph>
              DAO managed housing
            </Typography>
            <div className={classes.heroButtons}>
              <Grid container spacing={2} justify="center">
                <Grid item>
                  <Button variant="contained" color="primary" component="a" href={daoUrl} target="_blank">
                    DAO Managment
                  </Button>
                </Grid>
                <Grid item>
                  <Button variant="outlined" color="primary">
                    More info
                  </Button>
                </Grid>
              </Grid>
            </div>
          </Container>
        </div>
        <Container className={classes.cardGrid} maxWidth="md">

          <Grid container>

            <Grid item md={12}>
              <Typography variant="h5" align="center" color="textSecondary" paragraph>
                Token supply: { tokenInfo.totalSupply }
              </Typography>
            </Grid>
            <Grid item md={12}>
              <Typography variant="h5" align="center" color="textSecondary" paragraph>
                My balance: { tokenInfo.myBalance }
              </Typography>
            </Grid>

            <Grid item md={12}>
              <Typography variant="h5" align="center" color="textSecondary" paragraph>
                DAO operation balance: { tokenInfo.daoBalance }
              </Typography>
            </Grid>

            { txHash ? (
              <Grid item md={12}>
                <Typography variant="h5" align="center" color="textSecondary" paragraph>
                  <a href={`https://rinkeby.etherscan.io/tx/${txHash}`} target="_blank">{ txHash }</a>
                </Typography>
              </Grid>
            ) : undefined }

          </Grid>

          <br />
          <br />

          <Grid container spacing={4}>

            <Grid item xs={12} sm={4} md={4}>
              <Card className={classes.card}>
                <CardContent className={classes.cardContent}>
                  <Typography gutterBottom variant="h5" component="h2">
                    Buy Token
                  </Typography>
                  <Typography>
                    { values.buy } ETH = { buyPrice } tokens
                  </Typography>

                  <TextField
                    label="ETH"
                    id="margin-none"
                    defaultValue=""
                    className={classes.textField}
                    helperText="Amount of ETH to invest"
                    name="buy"
                    onChange={handleChange}

                  />


              </CardContent>
              <CardActions>
                <Button size="small" color="primary" onClick={handleBuy} disabled={values.buy === ''}>
                  Buy
                </Button>
              </CardActions>
            </Card>
          </Grid>

          <Grid item xs={12} sm={4} md={4}>
            <Card className={classes.card}>
              <CardContent className={classes.cardContent}>
                <Typography gutterBottom variant="h5" component="h2">
                  Dividends
                </Typography>
                <Typography>
                  My dividend balance: { tokenInfo.myDividends }
                </Typography>

                { tokenInfo.hatchOpen ? (
                  <Typography className={classes.hatchOpen}>
                    Dividend withdraws are disabled during the initial token hatch period.
                  </Typography>
                ) : undefined }

              </CardContent>
              <CardActions>
                <Button size="small" color="primary" onClick={handleWithdraw} disabled={tokenInfo.hatchOpen}>
                  Withdraw
                </Button>
                <Button size="small" color="primary" onClick={handleReinvest} disabled={tokenInfo.hatchOpen}>
                  Reinvest
                </Button>
              </CardActions>
            </Card>
          </Grid>

          <Grid item xs={12} sm={4} md={4}>
            <Card className={classes.card}>
              <CardContent className={classes.cardContent}>
                <Typography gutterBottom variant="h5" component="h2">
                  Sell Token
                </Typography>
                <Typography>
                  { values.sell } Tokens = { sellPrice } ETH
                </Typography>

                <TextField
                  label="Tokens"
                  id="margin-none"
                  defaultValue=""
                  className={classes.textField}
                  helperText="Amount of tokens to sell"
                  name="sell"
                  onChange={handleChange}
                />

            </CardContent>
            <CardActions>
              <Button size="small" color="primary" onClick={handleSell} disabled={values.sell === ''}>
                Sell
              </Button>
            </CardActions>
          </Card>
        </Grid>

      </Grid>


      <Grid container>
        <Grid item xs={12}>
          <Curve contract={contract} />
        </Grid>
      </Grid>


    </Container>
  </main>
  {/* Footer */}
  <footer className={classes.footer}>
    <Typography variant="h6" align="center" gutterBottom>
    </Typography>
    <Typography variant="subtitle1" align="center" color="textSecondary" component="p">
      Built for ETHDenver 2020
    </Typography>
  </footer>
  {/* End footer */}
</React.Fragment>
  );
}

export default App;
