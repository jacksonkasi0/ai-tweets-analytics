import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Box } from "@mui/material";
import { ArrowBackIosNew } from "@mui/icons-material";
import Switch from "react-switch";
import "./Switch.css";

const MySwitch = ({ page }) => {
  const navigate = useNavigate();
  const { type } = useParams();

  const [checked, setChecked] = React.useState(type === "multi" ? true : false);

  const isPage = page === "search";

  const handleSwitch = (nextChecked) => {
    setChecked(nextChecked);
    if (page === "search") {
      if (checked) {
        navigate("/search/single");
      } else {
        navigate("/search/multi");
      }
    } else {
      if (checked) {
        navigate("/user/single");
      } else {
        navigate("/users/multi");
      }
    }
  };

  return (
    <Box className="container">
      <Box
        className="Btn arr"
        onClick={() => {
          navigate(isPage ? "/" : `/search/${type}`);
        }}
      >
        <ArrowBackIosNew />
      </Box>
      <Switch
        onChange={handleSwitch}
        checked={checked}
        className="react-switch"
        handleDiameter={28}
        offColor="#000"
        onColor="#757575"
        offHandleColor="#fff"
        // onHandleColor="#000"
        height={48}
        width={80}
        borderRadius={6}
        uncheckedIcon={
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "100%",
              fontSize: 25,
              fontWeight: "bold",
              marginTop: "-1px",
              color: "#fff",
            }}
          >
            S
          </div>
        }
        checkedIcon={
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "100%",
              fontSize: 25,
              fontWeight: "bold",
              marginTop: "-2.6px",
              color: "#000",
            }}
          >
            M
          </div>
        }
      />
    </Box>
  );
};

export default MySwitch;
