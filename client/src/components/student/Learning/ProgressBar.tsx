import { Box, LinearProgress, Typography } from "@mui/material";

type ProgressBarProps = {
  progress: number;
};

const ProgressBar: React.FC<ProgressBarProps> = ({ progress }) => {
  console.log("Progress percent:", progress);
  return (
    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
      <LinearProgress
        variant="determinate"
        value={progress}
        sx={{
          width: "100%",
          height: 10,
          borderRadius: 5,
          marginLeft: 1,
          marginBottom: 3,
        }}
      />

      <Typography variant="body2" color="textSecondary">
        {progress}%
      </Typography>
    </Box>
  );
};

export default ProgressBar;
