import React from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { setUser } from "../../store/action/user";
import { Box, Typography, Button, IconButton } from "@mui/material";
import { VerifiedUserRounded, EventNoteRounded } from "@mui/icons-material";
import axios from "axios";
import MySwitch from "../../components/MySwitch/MySwitch";
import Logo from "../../assets/logo/logo.svg";
import Typewriter from "typewriter-effect";
import BarChart from "../../components/BarChart/BarChart";

const Users = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const usersInfo = useSelector((state) => state.multiUsers.users);

  const [usersData, setUsersData] = React.useState([]);
  const [staus, setStatus] = React.useState([]);

  const gotoUser = (payload) => {
    dispatch(setUser(payload));
    navigate("/user/single");
  };

  const getUsersDetails = async () => {
    if (usersInfo.length > 1) {
      const users = await axios.all(
        usersInfo.map((user_) => axios.get(`https://aitweets.herokuapp.com/getuser/${user_.id}`))
      );

      const usersArrData = users.map((responce) => {
        let img = responce.data.profile_image_url_https.replace(
          "normal",
          "200x200"
        );
        const t = new Date(responce.data.created_at).toDateString().split(" ");
        return {
          name: responce.data.name,
          id: responce.data.screen_name,
          profilImg: img,
          followers_count: responce.data.followers_count,
          following_count: responce.data.friends_count,
          join: `${t[2]} ${t[1]}  ${t[3]}`,
          verified: responce.data.verified,
        };
      });

      setUsersData(usersArrData);
    }
  };

  const getUsersTweets = async () => {
    const allTweets = await axios.all(
      usersInfo.map((user) => axios.get(`https://aitweets.herokuapp.com/tweets/${user.user_id}`))
    );

    const tweets = await allTweets.map((tweet) =>
      tweet.data.data.map((item) => item.text)
    );

    const tweetsanalyze = await axios.all(
      tweets.map((tweetsArr) =>
        axios
          .post(`https://aitweets.herokuapp.com/tweetsanalyze`, tweetsArr)
          .then((responce) => responce.data)
      )
    );

    const score = tweetsanalyze.map((item) => {
      const arr0 = item.map((e) => e.score[0]);
      const arr1 = item.map((e) => e.score[1]);
      const arr2 = item.map((e) => e.score[2]);

      // return {
      //   positive: arr0.reduce((a, b) => a + b) / arr0.length,
      //   neutral: arr1.reduce((a, b) => a + b) / arr1.length,
      //   nagative: arr2.reduce((a, b) => a + b) / arr2.length,
      // };

      const statusArr = [
        arr0.reduce((a, b) => a + b) / arr0.length,
        arr1.reduce((a, b) => a + b) / arr1.length,
        arr2.reduce((a, b) => a + b) / arr2.length,
      ];
      return statusArr;
    });
    // const status = tweetsanalyze.map((item) => item.map((e) => e.sentiment));
    setStatus(score);
  };

  React.useEffect(async () => {
    await getUsersDetails();
    await getUsersTweets();
    return true;
  }, []);

  return (
    <>
      {usersInfo.length > 1 ? (
        <Box>
          <MySwitch page={"user"} />

          {usersData.length > 1 && (
            <Box
              mx={2}
              mt={5}
              sx={{
                display: "flex",
                flexDirection: { xs: "column", md: "row" },
                justifyContent: "space-evenly",
                gridGap: "20px",
              }}
            >
              {usersData.map((userData, index) => (
                <Box key={userData.id} className="user">
                  <img
                    src={userData.profilImg}
                    onClick={() => gotoUser(usersInfo[index])}
                  />
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
                    <a
                      href={`https://twitter.com/${userData.id}`}
                      target="_blank"
                    >
                      @{userData.id}
                    </a>
                  </Button>

                  <Box
                    my={3}
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
                    <BarChart score={staus[index]} status={null} />
                  </Box>
                </Box>
              ))}
            </Box>
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
          <Button className="Btn" onClick={() => navigate("/search/multi")}>
            Click
          </Button>
        </Box>
      )}
    </>
  );
};

export default Users;
