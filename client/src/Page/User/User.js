import React from "react";
import "./User.css";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  Box,
  Stack,
  Typography,
  Button,
  IconButton,
  Paper,
} from "@mui/material";
import Pagi from "@mui/material/Pagination";
import axios from "axios";
import {
  FavoriteBorderRounded,
  ChatBubbleOutlineRounded,
  VerifiedUserRounded,
  EventNoteRounded,
  LoopRounded,
} from "@mui/icons-material";
import Typewriter from "typewriter-effect";

import MySwitch from "../../components/MySwitch/MySwitch";
import Logo from "../../assets/logo/logo.svg";
import BarChart from "../../components/BarChart/BarChart";

import SwiperCore, { Virtual, Navigation, Pagination } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

const ServerUrl = process.env.REACT_APP_SERVER;

SwiperCore.use([Virtual, Navigation, Pagination]);

const User = () => {
  const navigate = useNavigate();

  const userInfo = useSelector((state) => state.singleUser.user);

  const [userData, setUserData] = React.useState("");
  const [userTweets, setUserTweets] = React.useState([]);
  const [swiperRef, setSwiperRef] = React.useState(null);
  const [count, setCount] = React.useState(0);
  const [analyze, setAnalyze] = React.useState([]);
  const [tweetsWiki1, setTweetsWiki1] = React.useState([]);
  const [tweetsWiki2, setTweetsWiki2] = React.useState([]);

  const handleChange = (evt, value) => {
    swiperRef.slideTo(value - 1, 0);
    setCount(value - 1);
  };

  const getUserDetails = () => {
    if (userInfo.id !== "") {
      axios
        .get(`https://aitweets.herokuapp.com/getuser/${userInfo.id}`)
        .then((responce) => {
          const userDetails = () => {
            let img = responce.data.profile_image_url_https.replace(
              "normal",
              "200x200"
            );

            const t = new Date(responce.data.created_at)
              .toDateString()
              .split(" ");

            return {
              name: responce.data.name,
              id: responce.data.screen_name,
              profilImg: img,
              followers_count: responce.data.followers_count,
              following_count: responce.data.friends_count,
              description: responce.data.description,
              join: `${t[2]} ${t[1]}  ${t[3]}`,
              verified: responce.data.verified,
            };
          };
          setUserData(userDetails);
        });
    }
  };

  const getUserTweets = () => {
    if (userInfo.id !== "") {
      axios
        .get(`https://aitweets.herokuapp.com/tweets/${userInfo.user_id}`)
        .then((responce) => {
          setUserTweets(responce.data.data);
        });
    }
  };

  const tweetAnalyze = async () => {
    if (userTweets.length > 0) {
      const allTweets = userTweets.map((tweet) => {
        return tweet.text;
      });
      axios.defaults.headers.post["Content-Type"] =
        "application/x-www-form-urlencoded";
      await axios
        .post(`https://aitweets.herokuapp.com/tweetsanalyze`, allTweets)
        .then((response) => {
          setAnalyze(response.data);
        });

      await axios
        .post(
          `https://aitweets.herokuapp.com/tweetswiki`,
          allTweets.slice(0, 5)
        )
        .then((responce) => {
          setTweetsWiki1(responce.data);
        });
      await axios
        .post(`https://aitweets.herokuapp.com/tweetswiki`, allTweets.slice(5))
        .then((responce) => {
          setTweetsWiki2(responce.data);
        });
    }
  };

  React.useEffect(() => {
    getUserDetails();
    getUserTweets();
    return true;
  }, []);

  React.useEffect(() => {
    tweetAnalyze();
    return true;
  }, [userTweets]);

  return (
    <Box>
      {userInfo.id !== "" ? (
        <Box>
          <MySwitch page={"user"} />

          <Box className="user" my={4} mx={2}>
            <img src={userData.profilImg} />
            <Box
              mt={2}
              sx={{
                display: "flex",
                alignItems: "center",
                position: "relative",
              }}
            >
              {userData.verified && (
                <IconButton sx={{ position: "absolute", right: "-35px" }}>
                  <VerifiedUserRounded sx={{ color: "#0097D4" }} />
                </IconButton>
              )}
              <Typography variant="h5">{userData.name}</Typography>
            </Box>
            <Box>
              <Box
                sx={{
                  display: "flex",
                  gridGap: "30px",
                  textAlign: "center",
                  justifyContent: "center",
                }}
              >
                <Typography variant="h6">
                  following {userData.following_count}
                </Typography>
                <Typography variant="h6">
                  followers {userData.followers_count}
                </Typography>
              </Box>
              <Typography
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
                variant="h6"
              >
                <EventNoteRounded /> Join: {userData.join}
              </Typography>
            </Box>
            <Typography variant="h6">{userData.description}</Typography>
            <Button className="Btn twLink" variant="text">
              <a href={`https://twitter.com/${userData.id}`} target="_blank">
                @{userData.id}
              </a>
            </Button>
          </Box>

          {userTweets === undefined || userTweets.length === 0 ? (
            <Typography sx={{ mx: 2, textAlign: "center" }} variant="h5">
              Sorry, tweets are not visible :(
            </Typography>
          ) : (
            <>
              <Stack
                spacing={2}
                sx={{ display: "flex", alignItems: "center", my: 2 }}
              >
                <Pagi
                  count={userTweets.length}
                  shape="rounded"
                  onChange={handleChange}
                />
              </Stack>

              <Swiper
                onSwiper={setSwiperRef}
                slidesPerView={1}
                centeredSlides={true}
                navigation={true}
                virtual
              >
                {userTweets.map((tweet) => (
                  <SwiperSlide key={tweet.id} virtualIndex={tweet.id}>
                    <Paper className="tweetCard" elevation={8} mb={1}>
                      <Typography variant="h6">{tweet.text}</Typography>
                      <Box className="comment">
                        <div>
                          <IconButton>
                            <ChatBubbleOutlineRounded />
                          </IconButton>
                          {tweet.public_metrics.reply_count}
                        </div>
                        <div>
                          <IconButton>
                            <FavoriteBorderRounded />
                          </IconButton>
                          {tweet.public_metrics.like_count}
                        </div>
                        <div>
                          <IconButton>
                            <LoopRounded />
                          </IconButton>
                          {tweet.public_metrics.retweet_count}
                        </div>
                      </Box>
                    </Paper>
                  </SwiperSlide>
                ))}
              </Swiper>
              {analyze.length > 0 ? (
                <>
                  <Box
                    mb={2}
                    mx={2}
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      flexDirection: "column",
                      gridGap: "10px",
                    }}
                  >
                    <Typography variant="h5" fontWeight="700">
                      Tweets sentiment analyze
                    </Typography>
                    <BarChart
                      score={analyze[count].score}
                      status={analyze[count].sentiment}
                    />
                  </Box>

                  <Box mt={6}>
                    <Button className="Btn btnWiki">Wikipedia</Button>
                  </Box>

                  <Box
                    className="wikiTitle"
                    sx={{
                      display: "flex",
                      gridGap: "10px",
                      alignItems: "center",
                      textAlign: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <Typography variant="h6">Name</Typography>
                    <Typography variant="h6">Confidence</Typography>
                    <Typography variant="h6">Wiki links</Typography>
                  </Box>

                  <Box mx={2} mb={6} sx={{ display: "contents" }}>
                    {tweetsWiki1.concat(tweetsWiki2).map((data) =>
                      data.map((item, index) => (
                        <Box
                          key={index}
                          className="wiki"
                          sx={{
                            display: "flex",
                            gridGap: "10px",
                            alignItems: "center",
                            textAlign: "start",
                            justifyContent: "space-between",
                          }}
                        >
                          <Typography sx={{ flex: 1 }}>{item.name}</Typography>
                          <Typography sx={{ flex: 1 }}>
                            {item.matches[0].confidenceScore}
                          </Typography>
                          <Typography sx={{ flex: 0 }}>
                            <a href={item.url} target="_blank">
                              Link
                            </a>
                          </Typography>
                        </Box>
                      ))
                    )}
                  </Box>
                </>
              ) : null}
            </>
          )}
        </Box>
      ) : (
        <Box sx={{ display: "flex", flexDirection: "column", gridGap: 20 }}>
          <Box
            mt={10}
            mb={5}
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gridGap: "10px",
            }}
          >
            <img src={Logo} height="30" />
            <Typography
              variant="h5"
              textAlign="center"
              fontSize={{ xs: "25px", sm: "30px" }}
              fontWeight={600}
            >
              <Typewriter
                options={{
                  strings: [
                    "There is no user found",
                    "please go to search page...",
                  ],
                  autoStart: true,
                  loop: true,
                }}
              />
            </Typography>
          </Box>
          <Button className="Btn" onClick={() => navigate("/search/single")}>
            Click
          </Button>
        </Box>
      )}
    </Box>
  );
};

export default User;
