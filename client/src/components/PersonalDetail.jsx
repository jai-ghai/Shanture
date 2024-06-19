import { useState, useEffect } from "react";
import {
  Typography,
  TextField,
  Button,
  Container,
  Box,
  Link as MuiLink,
} from "@mui/material";
import axios from "axios";

const PersonalDetail = () => {
  const [user, setUser] = useState(null);
  const [panNumber, setPanNumber] = useState("");
  const [panFile, setPanFile] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [showDownload, setShowDownload] = useState(false);

  useEffect(() => {
    setShowDownload(user?.panFile ? true : false);
  }, [user]);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get("http://localhost:4000/api/v1/load", {
          withCredentials: true, // Include credentials in the request
          headers: {
            Authorization: `Bearer ${getCookie("token")}`, // Get the token from cookies
          },
        });
        const userData = response.data;
        console.log(userData.user);
        setUser(userData.user);
        setPanNumber(userData.user?.panNumber || ""); // Use optional chaining
        setLoading(false);
      } catch (error) {
        setError("Error fetching user data. Please try again.");
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);
  console.log(showDownload);
  const handlePanNumberChange = (e) => {
    setPanNumber(e.target.value);
  };

  const handlePanFileChange = (e) => {
    setPanFile(e.target.files[0]);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();
      formData.append("panNumber", panNumber);
      formData.append("panFile", panFile);

      await axios.post("http://localhost:4000/api/v1/addUserPAN", formData, {
        withCredentials: true, // Include credentials in the request
        headers: {
          Authorization: `Bearer ${getCookie("token")}`, // Get the token from cookies
        },
      });
      setShowDownload(true);

      // Success message or redirect
    } catch (error) {
      setError("Error saving PAN details. Please try again.");
    }
  };

  const handleDownloadFile = async () => {
    try {
      const response = await axios.get(
        "http://localhost:4000/api/v1/download",
        {
          responseType: "blob",
          withCredentials: true, // Include credentials in the request
          headers: {
            Authorization: `Bearer ${getCookie("token")}`, // Get the token from cookies
          },
        }
      );
      const blob = new Blob([response.data], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${user.pancardNumber}.pdf`;
      a.click();
    } catch (error) {
      setError("Error downloading PAN file. Please try again.");
    } finally {
      setError("");
    }
  };

  // Helper function to get cookie by name
  const getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(";").shift();
  };

  return (
    <Container maxWidth="md">
      <Typography variant="h4" gutterBottom>
        Personal Details
      </Typography>
      {loading ? (
        <Typography>Loading user data...</Typography>
      ) : (
        <Box
          component="form"
          onSubmit={handleFormSubmit}
          sx={{
            "& .MuiTextField-root": { mb: 2 },
            "& .MuiButton-root": { mt: 2 },
          }}
        >
          {user?.panNumber ? (
            <>
              <Typography variant="h5">PAN Card Details:</Typography>
              <Typography>PAN Number: {user.panNumber}</Typography>
              <Box mt={2}>
                <MuiLink onClick={handleDownloadFile}>
                  Download PAN Card
                </MuiLink>
              </Box>
            </>
          ) : (
            <>
              <Typography variant="h5">Personal Information:</Typography>
              <Typography>
                Name: {user.firstname} {user.lastname}
              </Typography>
              <Typography>Email: {user.email}</Typography>
              <Typography>Phone Number: {user.phone}</Typography>

              {showDownload ? (
                <>
                  <Typography>Pan Number: {user.pancardNumber}</Typography>
                  <Button onClick={handleDownloadFile}>Download</Button>
                </>
              ) : (
                <>
                  <TextField
                    fullWidth
                    label="PAN Number"
                    value={panNumber}
                    onChange={handlePanNumberChange}
                    required
                  />
                  <input
                    type="file"
                    accept=".pdf"
                    onChange={handlePanFileChange}
                    required={!panFile}
                  />
                  <Button variant="contained" color="primary" type="submit">
                    Save PAN Details
                  </Button>
                </>
              )}
            </>
          )}
        </Box>
      )}
      {error && <Typography color="error">{error}</Typography>}
    </Container>
  );
};

export default PersonalDetail;
