import {
  Container,
  TextField,
  Typography,
  Button,
  Box,
  AlertColor,
} from "@mui/material";
import { useState } from "react";
import { ErrorSnackbar } from "../common/ErrorSnackbar";
import { Email } from "../consts/Email";

export const Contact = () => {
  console.log("re rendering Contact");

  const [subject, setSubject] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState<AlertColor>("error");

  const handleSubmit = (e: any) => {
    if (subject !== "" && email !== "" && message !== "") {
      e.preventDefault();
      try {
        // check email validity
        if (e?.currentTarget?.form?.reportValidity()) {
          window?.location?.assign(
            `mailto:${Email}?subject=${subject}&body=${message}`
          );
          setSnackbarMessage("Email sent successfully.");
          setSnackbarSeverity("success");
        } else {
          setSnackbarMessage("Invalid email.");
          setSnackbarSeverity("warning");
        }
      } catch (e) {
        setSnackbarMessage("Email failed to send.");
        console.log(e);
      }
    } else setSnackbarMessage("Please fill all fields.");
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
          severity={snackbarSeverity}
        />
      )}

      <Container maxWidth={"md"}>
        <Typography
          variant="h4"
          fontWeight={"bold"}
          p={"2rem 0 1rem"}
          textAlign={"center"}
        >
          We'd Love to Hear From You
        </Typography>

        <Typography variant="body2" textAlign={"center"}>
          Whether you're curious about features, have a question, or just want
          to say hi — we're ready to answer any and all questions.
        </Typography>

        <Box
          component="form"
          autoComplete={"true"}
          onSubmit={handleSubmit}
          className="contact-form"
          pt={"4rem"}
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            bgcolor: "#44444",
            "& .MuiInputBase-root, .MuiButton-root": {
              boxShadow: "0px 0px 10px 0px rgba(0.5,0,0,0.1)",
              borderRadius: "50px !important",
            },
          }}
        >
          <TextField
            id="subject"
            label="Subject"
            required
            autoFocus
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
            color="success"
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
