import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  Container,
  Typography,
  TextField,
  Button,
  Grid,
  Link as MuiLink,
} from "@mui/material";
import { styled } from "@mui/system";
import axios from "axios";

const SignupContainer = styled(Container)({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  textAlign: "center",
  marginTop: "87px",
  minHeight: "100vh",
});

const FormContainer = styled("form")({
  width: "100%",
  maxWidth: "400px",
  padding: "20px",
  border: "1px solid #ccc",
  borderRadius: "10px",
  backgroundColor: "#fff",
  boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
});

const InputContainer = styled("div")({
  marginBottom: "15px",
});

const Signup = () => {
  const [firstname, setFirstName] = useState("");
  const [lastname, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        "http://localhost:4000/api/v1/register",
        {
          firstname,
          lastname,
          email,
          phone,
          password,
        }
      );

      // Store the token in cookies
      document.cookie = `token=${response.data.token}; path=/`;

      // Redirect to profile page
      window.location.href = "/profile";
    } catch (error) {
      console.error("Registration failed", error.response.data);
    }
  };

  return (
    <SignupContainer>
      <FormContainer onSubmit={handleSubmit}>
        <Typography variant="h4" gutterBottom>
          Signup
        </Typography>
        <InputContainer>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <TextField
                fullWidth
                type="text"
                label="First Name"
                value={firstname}
                onChange={(e) => setFirstName(e.target.value)}
                required
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                type="text"
                label="Last Name"
                value={lastname}
                onChange={(e) => setLastName(e.target.value)}
                required
              />
            </Grid>
          </Grid>
        </InputContainer>
        <InputContainer>
          <TextField
            fullWidth
            type="email"
            label="E-Mail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </InputContainer>
        <InputContainer>
          <TextField
            fullWidth
            type="tel"
            label="Phone Number"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
          />
        </InputContainer>
        <InputContainer>
          <TextField
            fullWidth
            type="password"
            label="Create Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </InputContainer>
        <Button variant="contained" color="primary" fullWidth type="submit">
          Sign Up
        </Button>
        <div style={{ marginTop: "10px" }}>
          <MuiLink component={Link} to="/">
            Already have an account? Login
          </MuiLink>
        </div>
      </FormContainer>
    </SignupContainer>
  );
};

export default Signup;
