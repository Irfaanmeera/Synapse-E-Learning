import { useState,useEffect} from "react";
import { useRef } from "react";
import Card from "@mui/material/Card";
import Typography from "@mui/material/Typography";
import { Box, Avatar, Badge, Button,LinearProgress } from "@mui/material";
import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";
import { useDispatch,useSelector} from "react-redux";
import { userActions } from "../../../redux/userSlice";
import { RootState } from "../../../redux/store";
import { updateImage } from "../../../api/studentApi";

// STYLES
const styles = {
  details: {
    padding: "0.5rem",
    borderTop: "1px solid #e1e1e1",
  },
  value: {
    padding: "0.5rem 2rem",
    borderTop: "1px solid #e1e1e1",
    color: "#899499",
  },
};

export default function ProfileCard() {
    const user = useSelector((store: RootState) => store.user.user);
    const dispatch= useDispatch()
    const [err, setErr] = useState("");
    const [loading,setLoading]= useState(false)
    const [progress, setProgress] = useState(0); 
    

    const fileInputRef = useRef<HTMLInputElement | null>(null);

  
  const handleIconClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click(); 
    }
  };

    const handleFileChange = async (
      event: React.ChangeEvent<HTMLInputElement>
    ) => {
      const file = event.target.files && event.target.files[0];
      if (file) {
        setLoading(true)
        try {
         
          const response = await updateImage(file, (progressEvent) => {
            if (progressEvent.total) {
              const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
              setProgress(percentCompleted);
            }
          });

          console.log("Update Image Response: " + response);
          if (response && response.image){
            dispatch(userActions.updateUserImage(response.image))
            setLoading(false)
          }
        } catch (error) {
          setErr("Fail to update image");
          setTimeout(() => {
            setErr("");
          }, 1000);
        }
      }
    };
    useEffect(() => {
      console.log("Redux user state updated:");
    }, [dispatch]);
    
  return (
    <Card variant="outlined" sx={{marginTop:8, marginLeft:3}}>
      <Box display="flex" flexDirection="column" alignItems="center" >
      
        <Box sx={{ p: '1rem 1rem', textAlign: 'center', position: 'relative' }}>
  
  {loading ? (
    <Box sx={{ position: 'relative', width: 100, height: 100 }}>
    
      <Avatar
        sx={{
          width: 100,
          height: 100,
          borderRadius: '50%',
          backgroundColor: '#f0f0f0',
          position: 'absolute',
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <LinearProgress
          variant="determinate"
          value={progress}
          sx={{
            width: '80%',
            height: 8,
            borderRadius: '4px',
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            zIndex: 1,
          }}
        />
        <Typography
          variant="body2"
          color="textSecondary"
          sx={{
            zIndex: 2,
            position: 'absolute',
            color: 'white',
            fontWeight: 'bold',
          }}
        >
          {`${progress}%`}
        </Typography>
      </Box>
    </Box>
  ) : (
    <Badge
      overlap="circular"
      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      badgeContent={
        <PhotoCameraIcon
          sx={{
            border: '5px solid white',
            backgroundColor: '#5349CC',
            borderRadius: '50%',
            padding: '.2rem',
            width: 35,
            height: 35,
            color: 'white',
            cursor: 'pointer',
          }}
          onClick={handleIconClick} 
        />
      }
    >
      <Avatar sx={{ width: 100, height: 100, mb: 1.5 }} src={user?.image} />
    </Badge>
  )}

  <input
    type="file"
    ref={fileInputRef}
    style={{ display: 'none' }} 
    onChange={handleFileChange} 
    accept="image/*" 
  />

  {/* DESCRIPTION */}
  <Typography variant="h6">{user?.name}</Typography>
</Box>

        {/* CARD HEADER END */}

        {/* DETAILS */}
        <Box display="flex" justifyContent="space-between" width="100%">
          <Box>
            <Typography style={styles.details}>Email</Typography>
            <Typography style={styles.details}>Phone No</Typography>
            <Typography style={styles.details}>Courses</Typography>
          </Box>
          <Box sx={{ textAlign: "end" }}>
            <Typography style={styles.value}>{user?.email}</Typography>
            <Typography style={styles.value}>{user?.mobile}</Typography>
            <Typography style={styles.value}>{user?.courses?.length}</Typography>
          </Box>
        </Box>

        {/* BUTTON */}
        <Box style={styles.details} sx={{ width: "100%" }}>
          <Button
            
            
            sx={{ width: "99%", p: 1, my: 2,
                backgroundColor: "white",
                color:"white" 
          }}
          >
            View Public Profile
          </Button>
        </Box>
      </Box>
    </Card>
  );
}
