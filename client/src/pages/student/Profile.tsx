// IMPORTS
import React, { useState } from "react";
import { Grid2 } from "@mui/material";
import CssBaseline from "@mui/material/CssBaseline";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import ProfileCard from "../../components/student/Profile/ProfileCard";
import SettingsCard from "../../components/student/Profile/SettingsCard";
import Navbarin from "../../components/student/Common/Navbar";


// STYLE & THEME
const theme = createTheme();

// APP
export default function Profile() {
  const [text, setText] = useState('');

  

  return (
   
    <ThemeProvider theme={theme}>
         <Navbarin/>
      <CssBaseline>
        {/* BACKGROUND */}
        
        <Grid2 container direction="column" sx={{ overflowX: "hidden" }}>
          <Grid2 item xs={12} md={8}>
            <img
              alt="avatar"
              style={{
                width: "100vw",
                height: "35vh",
                objectFit: "cover",
                objectPosition: "50% 50%",
                position: "relative",
                
              }}
              src="https://img.freepik.com/premium-vector/abstract-modern-blue-black-background-vector-illustration-design-presentation-banner-cover-web-flyer-card-poster-wallpaper-texture-slide-magazine-powerpoint_249611-4122.jpg"
            />
          </Grid2>

          {/* COMPONENTS */}
          <Grid2
            container
            direction={{ xs: "column", md: "row" }}
            spacing={3}
            sx={{
              position: "absolute",
              top: "25vh",
              px: { xs: 0, md: 7 },
           
            }}
          >
            {/* PROFILE CARD */}
            <Grid2 item md={4}>
              <ProfileCard/>
            </Grid2>

            {/* SETTINGS CARD */}
            <Grid2 item md={7}>
              <SettingsCard/>
            </Grid2>
          </Grid2>
        </Grid2>
      </CssBaseline>
    </ThemeProvider>
  );
}
