import React from "react";
import { Box, Typography } from "@mui/material";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";

export const LearningPoints: React.FC = () => {
  const points = [
    "Become an advanced, confident, and modern JavaScript developer",
    "Build beautiful real-world projects for your portfolio",
    "Modern ES6+ JavaScript",
    "Understand complex topics like the 'this' keyword",
  ];

  return (
    <Box>
      <Typography variant="h6" fontWeight="bold" gutterBottom>
        What you'll learn
      </Typography>
      {points.map((point, index) => (
        <Box key={index} display="flex" alignItems="center" mb={1}>
          <CheckCircleOutlineIcon color="primary" />
          <Typography variant="body1" sx={{ ml: 1 }}>
            {point}
          </Typography>
        </Box>
      ))}
    </Box>
  );
};
