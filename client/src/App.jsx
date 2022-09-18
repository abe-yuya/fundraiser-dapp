import React, { useState, useEffect } from "react";
import FundraiserFactoryContract from "./contracts/FundraiserFactory.json";
import getWeb3 from "./getWeb3";
import { BrowserRouter as Router, Routes, Route, NavLink } from "react-router-dom";
import NewFundraiser from "./NewFundraiser";
import Home from "./Home";
import { makeStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography  from "@material-ui/core/Typography";
import "./App.css";

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1
  }
}));

const App = () => {
  const [state, setState] = useState({ web3: null, accounts: null, contract: null });
  const classes = useStyles;


  useEffect(() => {
    const init = async() => {
      try {
        const web3 = await getWeb3();
        const accounts = await web3.eth.getAccounts();
        const networkId = await web3.eth.net.getId();
        const deployedNetwork = FundraiserFactoryContract.networks[networkId];
        const instance = new web3.eth.Contract(
          FundraiserFactoryContract.abi,
          deployedNetwork && deployedNetwork.address,
        );
        setState({web3, accounts, contract: instance});
      } catch(error) {
        alert(
          `App.js: Failed to load web3, accounts, or contract.
          Check console for details.`,
        );
        console.error(error);
      }
    }
    init();
  }, []);
  const runExample = async () => {
    const { accounts, contract } = state;
  };

  return (
    <Router>
      <div className={classes.root}>
        <AppBar position="static" color="default">
          <Toolbar>
            <Typography variant="h6" color="inherit">
              <NavLink className="nav-link" to="/">Home</NavLink>
            </Typography>
            <NavLink className="nav-link" to="/new/">New</NavLink>
          </Toolbar>
        </AppBar>
        <Routes>
          <Route path="/" exact element={<Home />} />
          <Route path="/new/" element={<NewFundraiser />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;