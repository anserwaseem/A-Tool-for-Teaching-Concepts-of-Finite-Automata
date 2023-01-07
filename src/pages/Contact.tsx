import {
  FormControl,
  Container,
  TextField,
  Typography,
  Button,
  Box,
} from "@mui/material";
import { useState } from "react";
import { ErrorSnackbar } from "../common/ErrorSnackbar";
import { Email } from "../consts/Email";

export const Contact = () => {
  const [subject, setSubject] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [snackbarMessage, setSnackbarMessage] = useState("");

  const handleSubmit = (e: any) => {
    if (subject !== "" && email !== "" && message !== "") {
      e.preventDefault();
      try {
        window.location.assign(
          `mailto:${Email}?subject=${subject}&body=${message}`
        );
        setSnackbarMessage("Email sent successfully.");
      } catch (e) {
        setSnackbarMessage("Email failed to send.");
        console.log(e);
      }
    } else setSnackbarMessage("Please fill out all fields.");
  };

  return (
    <>
      {snackbarMessage !== "" && (
        <ErrorSnackbar
          open={snackbarMessage !== ""}
          handleErrorSnackbarClose={function (): void {
            setSnackbarMessage("");
          }}
          titleMessage={snackbarMessage}
          bodyMessage={snackbarMessage}
        />
      )}

      <Container>
        <Typography
          variant="h4"
          fontWeight={"bold"}
          color={"black"}
          sx={{ p: "1rem 0 3rem" }}
        >
          Contact Us
        </Typography>

        <Box
          component="form"
          autoComplete={"true"}
          onSubmit={handleSubmit}
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            bgcolor: "#44444",
          }}
        >
          <TextField
            id="subject"
            label="Subject"
            required
            value={subject}
            onChange={(e) => setSubject(e?.target?.value || "")}
            sx={{ pb: "1rem" }}
          />
          <TextField
            id="email"
            label="Email"
            required
            type="email"
            value={email}
            onChange={(e) => setEmail(e?.target?.value || "")}
            sx={{ pb: "1rem" }}
          />
          <TextField
            id="message"
            label="Message"
            required
            multiline
            value={message}
            onChange={(e) => setMessage(e?.target?.value || "")}
            sx={{ pb: "1rem" }}
          />
          <Button
            variant="contained"
            type="submit"
            fullWidth
            disabled={subject === "" || email === "" || message === ""}
            onClick={handleSubmit}
          >
            Submit
          </Button>
        </Box>
      </Container>
    </>
  );
};
