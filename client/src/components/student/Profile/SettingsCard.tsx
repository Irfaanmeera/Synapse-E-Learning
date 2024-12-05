// IMPORTS
import React, { useState } from "react";
import Card from "@mui/material/Card";
import Divider from "@mui/material/Divider";
import InputAdornment from "@mui/material/InputAdornment";
import CardContent from "@mui/material/CardContent";
import Box from "@mui/material/Box";
import FormControl from "@mui/material/FormControl";
import Button from "@mui/material/Button";
import CustomInput from "./CustomInput";
import { useDispatch, useSelector } from "react-redux";
import { userActions } from "../../../redux/userSlice";
import { RootState } from "../../../redux/store";
import { updateUser } from "../../../api/studentApi";
import { toast } from "react-hot-toast";

const validateName = (name: string) => {
  if (!name.trim()) {
    return "Name should not be empty";
  }
  if (!/^[A-Za-z ]+$/.test(name)) {
    return "Name should only contain alphabets and spaces";
  }
  if (name.length < 2) {
    return "Name must be at least 2 characters long";
  }
  if (name.length > 50) {
    return "Name must be less than 50 characters";
  }
  return "";
};

const validateMobile = (mobile: string) => {
  if (!/^\d+$/.test(mobile)) {
    return "Mobile number should contain only numbers after the '+'";
  }
  return "";
};

// APP
export default function SettingsCard() {
  const dispatch = useDispatch();

  // Form states
  const user = useSelector((store: RootState) => store.user.user);
  const [formData, setFormData] = useState({
    name: user?.name || "",
    mobile: user?.mobile || "",
  });
  const [errors, setErrors] = useState<{ name?: string; mobile?: string }>({});
  const [edit, update] = useState({
    required: true,
    disabled: true,
    isEdit: true,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));

    if (name === "name") {
      const nameError = validateName(value);
      setErrors((prevErrors) => ({
        ...prevErrors,
        name: nameError || undefined,
      }));
    }

    if (name === "mobile") {
      const mobileError = validateMobile(value);
      setErrors((prevErrors) => ({
        ...prevErrors,
        mobile: mobileError || undefined,
      }));
    }
  };

  const handleSubmit = async () => {
    const nameError = validateName(formData.name);
    const mobileError = validateMobile(formData.mobile);

    if (nameError || mobileError) {
      setErrors({ name: nameError, mobile: mobileError });
      return;
    }

    try {
      const response = await updateUser(formData);
      if (response) {
        dispatch(userActions.saveUser({ ...response, role: "student" }));
        toast.success("Username updated successfully");
      }
    } catch (error) {
      console.error("Update failed", error);
      toast.error("Failed to update the user.");
    }
  };

  return (
    <Card variant="outlined" sx={{ height: "100%", width: "100%", marginTop:8, marginLeft:3}}>
      <Divider />

      {/* MAIN CONTENT CONTAINER */}
      <form>
        <CardContent
          sx={{
            p: 3,
            maxHeight: { md: "40vh" },
            textAlign: { xs: "center", md: "start" },
          }}
        >
          <FormControl fullWidth>
            <Box
              display="flex"
              flexDirection={{ xs: "column", md: "row" }}
              gap={3}
              mb={3}
            >
              {/* Name Field */}
              <Box component="form" flex={1}>
                <CustomInput
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  title="Name"
                  error={!!errors.name}
                  helperText={errors.name}
                />
              </Box>

              {/* Phone Field */}
              <Box flex={1}>
                <CustomInput
                  id="phone"
                  name="mobile"
                  value={formData.mobile}
                  onChange={handleChange}
                  title="Phone Number"
                  error={!!errors.mobile}
                  helperText={errors.mobile}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">+</InputAdornment>
                    ),
                  }}
                />
              </Box>
            </Box>

            {/* Email Field */}
            <Box display="flex" gap={3} mb={3}>
              <Box flex={1}>
                <CustomInput
                  type="email"
                  id="email"
                  name="email"
                  value={user?.email}
                  title="Email Address"
                  dis={edit.disabled}
                />
              </Box>
            </Box>

            {/* Submit Button */}
            <Box
              display="flex"
              justifyContent={{ xs: "center", md: "flex-end" }}
            >
              <Button
                sx={{
                  p: "0.8rem 2rem",
                  my: 1,
                  height: "2.5rem",
                  backgroundColor: "#5349CC",
                  "&:hover": {
                    backgroundColor: "#8a2be2",
                  },
                }}
                variant="contained"
                onClick={handleSubmit}
              >
                Update
              </Button>
            </Box>
            <Box mt={2}>
              {errors.name && <Box color="error.main">{errors.name}</Box>}
              {errors.mobile && <Box color="error.main">{errors.mobile}</Box>}
            </Box>
          </FormControl>
        </CardContent>
      </form>
    </Card>
  );
}
