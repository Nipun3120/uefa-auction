import React, { useEffect, useState } from "react";
import { db } from "../../config/Firebase";
import firebase from "firebase";
import BiddingHistory from "./BiddingHistory";
import FlipMove from "react-flip-move";

import { Button, Container, Grid, Typography } from "@material-ui/core";
import "../../assets/css/liveBidding.css";
import { makeStyles } from "@material-ui/core";
import theme from "../../assets/js/DarkTheme";
import "../../assets/css/liveBidding.css";

const useStyles = makeStyles((theme) => ({
  heading: {
    color: 'goldenrod'
  },

  leftGrid: {
    padding: "20px",
  },
  bidButton: {
    border: "2px solid black",
    padding: "5px 20px",
    borderRadius: "5px",
    margin: "10px 0 30px 0",
  },
}));

const LiveBiddingHelper = ({ player, playerId, teamId }) => {
  const classes = useStyles();

  const [biddingValue, setbiddingValue] = useState(parseInt(player.maxbid));
  const [bidDisplay, setbidDisplay] = useState([]);
  const [balance, setBalance] = useState(0);
  //const [Display, setDisplay] = useState("false");
  //console.log(teamId);

  const sendBid = (e) => {
    e.preventDefault();

    db.collection("players").doc(playerId).collection("Bids").add({
      teamId: teamId,
      biddingprice: biddingValue,
      timestamp: firebase.firestore.Timestamp.now(),
    });

    //console.log("Maxbid:", player.maxbid);
    //console.log("Price:", biddingValue);
    if (
      parseInt(player.maxbid) < parseInt(biddingValue) ||
      parseInt(player.maxbid) === parseInt(player.baseprice)
    ) {
      db.collection("players").doc(playerId).update({
        maxbid: biddingValue,
        maxbidBy: teamId,
      });
    }
    //const ref2 = db.collection("players").doc(playerId);
    if (parseInt(biddingValue) < 100 && parseInt(biddingValue) >= 0)
      setbiddingValue(parseInt(biddingValue) + 5);
    else if (parseInt(biddingValue) < 200 && parseInt(biddingValue) >= 100) {
      setbiddingValue(parseInt(biddingValue) + 10);
    } else if (parseInt(biddingValue) < 500 && parseInt(biddingValue) >= 200) {
      setbiddingValue(parseInt(biddingValue) + 20);
    } else {
      setbiddingValue(parseInt(biddingValue) + 25);
    }
  };

  // console.log("ID:", playerId);
  useEffect(() => {
    ///setting bidding value
    db.collection("players")
      .where("display", "==", "true")
      .where("category", "==", "live")
      .onSnapshot({ includeMetadataChanges: true }, (snapshot) => {
        snapshot.docs.map((doc) => {
          // console.log(doc.id, "=>", doc.data());

          if (
            parseInt(doc.data().baseprice) === parseInt(doc.data().maxbid) &&
            player.maxbidBy === ""
          ) {
            console.log("equal");
            // setbiddingValue(parseInt(doc.data().baseprice));
          } else if (
            parseInt(doc.data().baseprice) === parseInt(doc.data().maxbid) &&
            player.maxbidBy !== ""
          ) {
            if (
              parseInt(doc.data().maxbid) < 100 &&
              parseInt(doc.data().maxbid) >= 0
            )
              setbiddingValue(parseInt(doc.data().maxbid) + 5);
          } else {
            if (
              parseInt(doc.data().maxbid) < 100 &&
              parseInt(doc.data().maxbid) >= 0
            )
              setbiddingValue(parseInt(doc.data().maxbid) + 5);
            else if (
              parseInt(doc.data().maxbid) < 200 &&
              parseInt(doc.data().maxbid) >= 100
            ) {
              setbiddingValue(parseInt(doc.data().maxbid) + 10);
            } else if (
              parseInt(doc.data().maxbid) < 500 &&
              parseInt(doc.data().maxbid) >= 200
            ) {
              setbiddingValue(parseInt(doc.data().maxbid) + 20);
            } else {
              setbiddingValue(parseInt(doc.data().maxbid) + 25);
            }
          }
        });
      });
  }, [player.maxbidBy]);
  useEffect(() => {
    db.collection("users")
      .doc(teamId)
      .onSnapshot((snapshot) => {
        if (snapshot.exists) {
          setBalance(parseInt(snapshot.data().teamBalance));
        }
      });
  }, []);
  useEffect(() => {
    //fetch bids from database
    db.collection("players")
      .doc(playerId)
      .collection("Bids")
      .orderBy("timestamp", "desc")
      .limit(15)
      .onSnapshot((snapshot) => {
        setbidDisplay(
          snapshot.docs.map((doc) => ({ id: doc.id, data: doc.data() }))
        );
      });
  }, [player.maxbid]);

  //console.log(bidDisplay);
  // console.log(biddingValue);
  //console.log(Display);
  //useEffect(() => {}, [Status]);

  return (
    <Container style={{ marginTop: "50px", width: "100%" }}>
        <Typography
          variant="h3"
          className={classes.heading}
          color="primary"
          align="center"
        >
          LIVE AUCTION
        </Typography>

      <Grid container justify="center" spacing={3}>
        <Grid item xs={11} sm={10} md={6} lg={6} display="inline">
          <div className={classes.leftGrid}>
            <div className="leftGridStyle">
              <div className="leftGridBack"></div>

              <div className="leftGridTop">
                <Typography
                  variant="h2"
                  align="center"
                  color="primary"
                  style={{
                    fontWeight: "bold",
                    fontSize: "3em",
                    textTransform: "uppercase",
                    marginTop: "10px",
                  }}
                  className="playername"
                >
                  {player.name}({player.age})
                </Typography>
                <div
                  style={{
                    marginTop: "30px",
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-around",
                  }}
                >
                  <img
                    src={player.Image}
                    className="playerCard"
                    alt="No Image"
                    style={{
                      // margin: '0 auto'
                      // marginLeft: '-10%',
                      borderRadius: "10px",
                    }}
                  ></img>

                  <div
                    style={{ display: "block", justifyContent: "space-around" }}
                    className={classes.playerDetailsWrapper}
                  >
                    {/* <Grid item xs={3}> */}
                    <div>
                      <Typography
                        className="playerDetails"
                        variant="h6"
                        style={{fontWeight: '600', color: 'goldenrod'}}
                      >
                        {" "}
                        National Team: {player.nationalTeam}
                      </Typography>
                      <Typography
                        className="playerDetails"
                        variant="h6"
                        style={{fontWeight: '600', color: 'goldenrod'}}
                      >
                        {" "}
                        Club: {player.club}
                      </Typography>
                      <Typography
                        className="playerDetails"
                        variant="h6"
                        style={{fontWeight: '600', color: 'goldenrod'}}
                      >
                        {" "}
                        Position: {player.position}
                      </Typography>
                    </div>

                    {/* </Grid> */}
                    {/* <Grid item xs={3}> */}

                    <div>
                      <Typography
                        className="playerDetails"
                        variant="h6"
                        style={{fontWeight: '600', color: 'goldenrod'}}
                      >
                        {" "}
                        Rating: {player.rating}
                      </Typography>
                      <Typography
                        className="playerDetails"
                        variant="h6"
                        style={{fontWeight: '600', color: 'goldenrod'}}
                      >
                        {" "}
                        Wage: € {player.wage} M
                      </Typography>
                    </div>
                  </div>
                  {/* </Grid> */}
                </div>

                <div className="bidSection">
                  <div className="bidButtonStyle">
                    <Typography
                      color="primary"
                      variant="h4"
                      style={{fontWeight: '600', color: 'goldenrod'}}
                    >
                      {" "}
                      Base Price: € {player.baseprice} M{" "}
                    </Typography>
                    {/* {player.maxbidBy === teamId ? <h3>WINNING</h3> : console.log("False")} */}
                    <form>
                      {balance >= biddingValue ? (
                        [
                          player.maxbidBy !== teamId ? (
                            <button
                              type="submit"
                              onClick={sendBid}
                              className={classes.bidButton}
                              style={{ backgroundColor: "#3160fd" }}
                            >
                              <Typography variant="h6" color="primary">
                              € {biddingValue}M Bid{" "}
                              </Typography>
                            </button>
                          ) : (
                            <button
                              type="submit"
                              disabled
                              className={classes.bidButton}
                              style={{ backgroundColor: "#555" }}
                            >
                              <Typography
                                variant="h6"
                                style={{ color: "#fff" }}
                              >
                                € {biddingValue}M Bid{" "}
                              </Typography>
                            </button>
                          ),
                        ]
                      ) : (
                        <button
                          type="submit"
                          disabled
                          className={classes.bidButton}
                          style={{ backgroundColor: "#0255c25b" }}
                        >
                          Not Enough Balance
                        </button>
                      )}
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Grid>

        <Grid item xs={11} sm={10} md={6} lg={6}>
          <div className="rightGridStyle">
            <div className="rightGridBack"></div>
            <div className="rightGridTop">
              <Container
                className={classes.rightGrid}
                style={{ marginTop: "10px", padding: "30px 0 50px 30px" }}
              >
                <Typography
                  variant="h3"
                  color="primary"
                  align='center'
                  style={{
                    fontWeight: "bold",
                    fontSize: "2em",
                    textTransform: "uppercase",
                    // marginTop: "10px",
                    marginBottom: '10px'
                  }}
                >
                  Bidding History
                </Typography>
                <FlipMove>
                  {bidDisplay ? (
                    bidDisplay.map((bid) => {
                      return <BiddingHistory key={bid.id} bid={bid.data} />;
                    })
                  ) : (
                    <Typography variant="h3" color="primary">
                      No Bids
                    </Typography>
                  )}
                </FlipMove>
              </Container>
            </div>
          </div>
        </Grid>
      </Grid>
    </Container>
  );
};

export default LiveBiddingHelper;
