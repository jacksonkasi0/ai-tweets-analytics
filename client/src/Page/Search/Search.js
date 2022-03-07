import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { setUser } from "../../store/action/user";
import { setUsers } from "../../store/action/users";
import {
  Box,
  TextField,
  Autocomplete,
  Typography,
  Button,
  IconButton,
} from "@mui/material";
import { Close } from "@mui/icons-material";
import axios from "axios";
import "./Search.css";
import MySwitch from "../../components/MySwitch/MySwitch";

const Search = () => {
  const { type } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [name, setName] = React.useState("");
  const [Value, setValue] = React.useState(null);
  const [multiValue, setMultiValue] = React.useState([]);
  const [usersData, setUsersData] = React.useState([]);

  const singleUserInfo = useSelector((state) => {
    return state.singleUser.user;
  });
  const multiUserInfo = useSelector((state) => {
    return state.multiUsers.users;
  });

  React.useEffect(() => {
    singleUserInfo.name !== null && setValue(singleUserInfo);
    setMultiValue(multiUserInfo);
  }, []);

  const getFromTwitter = () => {
    if (name !== "") {
      axios
        .get(`https://aitweets.herokuapp.com/search/${name}`)
        .then((responce) => {
          const users_data = responce.data.map((data) => {
            let img = data.profile_image_url_https.replace("normal", "200x200");
            return {
              name: data.name,
              user_id: data.id,
              id: data.screen_name,
              profilImg: img,
            };
          });
          setUsersData(users_data);
        });
    }
  };

  React.useEffect(getFromTwitter, [name]);

  const searchUser = (evt, value) => {
    if (type === "multi") {
      const isSame = multiValue.some((user) => user.id === value.id);
      const isLenght = multiValue.length === 2;

      if (value === null || isSame || isLenght) {
        return;
      }
      return setMultiValue((preVal) => {
        return [...preVal, value];
      });
    }
    setValue(value);
    value !== null && dispatch(setUser(value));
  };

  if (multiValue.length > 0) {
    dispatch(setUsers(multiValue));
  }

  const removeUser = (id) => () => {
    setMultiValue((preVal) => preVal.filter((user) => user.id !== id));
    dispatch(setUsers([]));
  };

  const gotoUser = (payload) => {
    if (payload === true) {
      return navigate("/user/single");
    }
    dispatch(setUser(payload));
    navigate("/user/single");
  };

  return (
    <Box mx={2}>
      <MySwitch type={type} page={"search"} />

      <Autocomplete
        value={Value}
        inputValue={name}
        options={usersData}
        getOptionLabel={(option) => option.name}
        onChange={searchUser}
        onInputChange={(evt, value) => {
          setName(value);
        }}
        sx={{
          minWidth: "150px",
          maxWidth: "500px",
          mx: "auto",
          mt: "40px",
          mb: "60px",
        }}
        renderOption={(props, option) => (
          <Box component="li" {...props} key={option.id}>
            <Box my={1} sx={{ display: "flex", gridGap: "10px" }}>
              <img
                className="optImg"
                srcSet={option.profilImg}
                alt={option.name}
              />
              <Typography variant="h6" fontSize="bold">
                {option.name}
              </Typography>
            </Box>
          </Box>
        )}
        renderInput={(value, index) => {
          return (
            <TextField
              {...value}
              key={index}
              label={type === "single" ? "twitter user" : "twitter users"}
              placeholder="search twitter users"
            />
          );
        }}
      />
      {type === "multi" ? (
        <Box
          mt={3}
          sx={{
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            justifyContent: "center",
            alignItems: "center",
            gridGap: { xs: "40px", sm: "140px" },
          }}
        >
          {multiValue.length > 0 ? (
            <Box className="userBox">
              <IconButton
                className="closeIco"
                onClick={removeUser(multiValue[0].id)}
              >
                <Close fontSize="small" />
              </IconButton>
              <img
                src={multiValue[0].profilImg}
                alt={multiValue[0].name}
                onClick={() => gotoUser(multiValue[0])}
              />
              <Typography variant="h6" mt={3}>
                {multiValue[0].name}
              </Typography>
            </Box>
          ) : null}
          {multiValue.length > 1 ? (
            <Box className="userBox">
              <IconButton
                className="closeIco"
                onClick={removeUser(multiValue.slice(-1)[0].id)}
              >
                <Close fontSize="small" />
              </IconButton>
              <img
                src={multiValue[1].profilImg}
                alt={multiValue[1].name}
                onClick={() => gotoUser(multiValue.slice(-1)[0])}
              />
              <Typography variant="h6" mt={3}>
                {multiValue[1].name}
              </Typography>
            </Box>
          ) : null}
        </Box>
      ) : (
        <>
          {Value !== null && type === "single" ? (
            <Box className="userBox2">
              <img
                src={Value.profilImg}
                alt={Value.name}
                onClick={() => gotoUser(true)}
              />
              <Button className="Btn" onClick={() => navigate("/user/single")}>
                {Value.name}
              </Button>
            </Box>
          ) : null}
        </>
      )}

      {multiValue.length === 2 && type === "multi" ? (
        <Button className="Btn" onClick={() => navigate("/users/multi")}>
          click me
        </Button>
      ) : null}
    </Box>
  );
};

export default Search;
