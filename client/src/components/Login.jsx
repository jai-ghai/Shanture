// Login Component
import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  Container,
  Typography,
  TextField,
  Button,
  FormControlLabel,
  Checkbox,
  Link as MuiLink,
} from "@mui/material";
import { styled } from "@mui/system";
import axios from "axios";

const LoginContainer = styled(Container)({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  textAlign: "center",
  marginTop: "87px", // Adjusted margin top
  minHeight: "100vh",
});

const FormContainer = styled("form")({
  width: "100%",
  maxWidth: "400px",
  padding: "20px", // Increased padding
  border: "1px solid #ccc",
  borderRadius: "10px",
  backgroundColor: "#fff",
  boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
});

const InputContainer = styled("div")({
  marginBottom: "15px",
});

const RememberForgotContainer = styled("div")({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: "15px",
  color: "#333",
});

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("http://localhost:4000/api/v1/login", {
        email,
        password,
      });

      // Store the token in cookies
      document.cookie = `token=${response.data.token}; path=/`;

      // Redirect to profile page
      window.location.href = "/profile";
    } catch (error) {
      console.error("error logging in:", error);
    }
  };

  return (
    <LoginContainer>
      <FormContainer onSubmit={handleSubmit}>
        <Typography variant="h4" gutterBottom>
          Login
        </Typography>
        <InputContainer>
          <TextField
            fullWidth
            type="email"
            label="User E-Mail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </InputContainer>
        <InputContainer>
          <TextField
            fullWidth
            type="password"
            label="User Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </InputContainer>
        <RememberForgotContainer>
          <FormControlLabel
            control={<Checkbox />}
            label="Remember me"
            style={{ marginRight: "0" }}
          />
          <MuiLink component={Link} to="#">
            Forgot Password?
          </MuiLink>
        </RememberForgotContainer>
        <Button variant="contained" color="primary" fullWidth type="submit">
          Login
        </Button>
        <div style={{ marginTop: "10px" }}>
          <Link to="/signup">Don't have an account? Sign up</Link>
        </div>
      </FormContainer>
    </LoginContainer>
  );
};

export default Login;
