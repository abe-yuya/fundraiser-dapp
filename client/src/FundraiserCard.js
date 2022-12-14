import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardActionArea from "@material-ui/core/CardActionArea";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
import Typography from "@material-ui/core/Typography";
import FundraiserContract from "./contracts/Fundraiser.json";
import Web3 from "web3";
import detectEthereumProvider from "@metamask/detect-provider";
import FundraiserFactoryContract from "./contracts/FundraiserFactory.json";

const useStyles = makeStyles(theme => ({
  card: {
    maxWidth: 450,
    height: 400,
  },
  media: {
    height: 140,
  },
}));

const FundraiserCard = (props) => {
  const classes = useStyles();

  const [ web3, setWeb3 ] = useState(null);
  const [ contract, setContract ] = useState(null);
  const [ accounts, setAccounts ] = useState(null);
  const [ fundName, setFundname ] = useState(null);
  const [ description, setDescription ] = useState(null);
  const [ totalDonations, setTotalDonations ] = useState(null);
  const [ donationCount, setDonationCount ] = useState(null);
  const [ imageURL, setImageURL ] = useState(null);
  const [ url, setURL ] = useState(null);


  const { fundraiser } = props;

  useEffect(() => {
    if (fundraiser) {
      init(fundraiser);
    }
  }, [fundraiser]);

  const init = async (fundraiser) => {
    try {
      const fund = fundraiser;
      const provider = await detectEthereumProvider();
      const web3 = new Web3(provider);
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = FundraiserContract.networks[networkId];
      const accounts = await web3.eth.getAccounts();
      const instance = new web3.eth.Contract(
        FundraiserContract.abi,
        fund
      );
      console.log('instance');
      console.log(instance);
      setWeb3(web3);
      setContract(instance);
      setAccounts(accounts);
      // ?????????????????????????????????????????????????????????
      const name = instance.methods.name().call();
      const description = await instance.methods.description().call();
      const totalDonations = await instance.methods.totalDonations().call();
      const imageURL = await instance.methods.imageURL().call();
      const url = await instance.methods.url().call();

      setFundname(name);
      setDescription(description);
      setImageURL(imageURL);
      setTotalDonations(totalDonations);
      setURL(url);
    } catch(error) {
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`,
      );
      console.error(error)
    }
  }


  return (
    <div className="fundraiser-card-container">
      <Card className={classes.card}>
        <CardActionArea>
          <CardMedia
            className={classes.media}
            image={imageURL}
            title="Fundraiser Image"
          />
          <CardContent>
            <Typography 
              gutterBottom 
              variant="h5"
              component="h2"
            >
              {fundName}
            </Typography>
            <Typography  
              variant="body2"
              color="textSecondary"
              component="p"
            >
              <p>{description}</p>
            </Typography>
          </CardContent>
        </CardActionArea>
      </Card>
    </div>
  );
}

export default FundraiserCard;