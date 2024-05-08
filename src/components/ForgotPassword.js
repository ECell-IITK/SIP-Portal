import { Container, TextField, Button, Alert } from "@mui/material";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useUserAuth } from "./contexts/userAuthContext";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const { passwordReset } = useUserAuth();
  const textArea = {
    width: "100%",
    margin: "5px",
    // maxWidth: "300px",
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setError("");
      setLoading(true);
      await passwordReset(email);
    } catch (err) {
      console.log(err.message);
      setError(err.message);
    }
    setMessage("Check your inbox for further instructions");
    setLoading(false);
  };
  return (
    <>
      <div
        style={{
          textAlign: "right",
          position: "fixed",
          top: "0",
          zIndex: "2",
          width: "100%",
          padding: "20px",
          boxSizing: "border-box",
        }}
      >
        <Link
          to={"/"}
          style={{ textDecoration: "none", color: "#3d52a0", margin: "5px" }}
        >
          Login
        </Link>
        <Link
          to={"/signup"}
          style={{ textDecoration: "none", color: "#3d52a0", margin: "5px" }}
        >
          Sign Up
        </Link>
        <Link
          to={"/"}
          style={{ textDecoration: "none", color: "#3d52a0", margin: "5px" }}
        >
          Contact Us
        </Link>
      </div>
      <Container
        sx={{
          height: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <form
          action="submit"
          style={{ maxWidth: "400px" }}
          onSubmit={handleSubmit}
        >
          {error && <Alert severity="error">{error}</Alert>}
          {!error && message && <Alert severity="success">{message}</Alert>}
          <TextField
            required
            label="Email"
            variant="outlined"
            sx={textArea}
            type="email"
            onChange={(e) => setEmail(e.target.value)}
          />
          <Button
            variant="contained"
            sx={{
              width: "100%",
              backgroundColor: "#3d52a0",
              "&:hover": { backgroundColor: "#3d52a0" },
              margin: "5px",
            }}
            type="submit"
            disabled={loading}
          >
            Request for Password Reset
          </Button>
        </form>
      </Container>
    </>
  );
};

export default ForgotPassword;
