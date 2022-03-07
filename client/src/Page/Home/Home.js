import React from "react";
import Style from "./Home.module.css"
import Logo from "../../assets/logo/logo.svg"
import User0 from  "../../assets/home/Girl.svg"
import User1 from  "../../assets/home/Boy-1.svg"
import User2 from  "../../assets/home/Boy-2.svg"

import Typewriter from 'typewriter-effect';
import { AnimationWrapper } from "react-hover-animation"

import { Box, Typography } from "@mui/material";
import {BubbleChartRounded} from '@mui/icons-material';

import { useNavigate } from "react-router-dom"

const Home = () => {

  const navigate = useNavigate();

  return (
    <Box>
      <Box my={5} sx={{display:"flex", alignItems:"center", justifyContent:"center", gridGap:"10px"}}  >
        <img src={Logo} height="30" />
        <Typography variant="h5" textAlign="center" fontSize={{xs:"25px",sm:"30px"}} fontWeight={600}  >
          <Typewriter options={{ strings: ['Ai tweets analytics', 'with Azure...'], autoStart: true, loop: true, }} />
        </Typography>
      </Box>
        
      <Box mt={3} sx={{display:"flex", flexDirection:{xs:"column",md:"row"} ,justifyContent:{xs:"center",md:"space-evenly"}}}  >
        <AnimationWrapper>
          <Box className={Style.Box} onClick={()=>navigate("search/single")} >
            
            <img src={User1} className={Style.memoji1} />
              <Typography variant="h6" mt={4} >User</Typography>
            <Box sx={{display:"flex", alignItems:"center", gridGap:".5rem"}} >
              <BubbleChartRounded  fontSize="small" />
              <p>Understand the user's feelings</p>
            </Box>
          </Box>
        </AnimationWrapper>
        
        <AnimationWrapper>
          <Box className={Style.Box} onClick={()=>navigate("search/multi")} >
            <Box className={Style.memojiBox} sx={{display:"flex", alignItems:"center", gridGap:"30px"}} >
              <img src={User2} />
              <img src={User0} />
            </Box>
            <Typography variant="h6" mt={4} >User vs User</Typography>
            <Box sx={{display:"flex", alignItems:"center", gridGap:".5rem"}} >
              <BubbleChartRounded  fontSize="small" />
              <p>Compare users' feelings</p>
            </Box>
          </Box>
        </AnimationWrapper>
    </Box>

    </Box>
  );
};

export default Home;
