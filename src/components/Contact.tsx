import {
  FormControl,
  Container,
  TextField,
  Typography,
  Button,
} from "@mui/material";
import { useState } from "react";
import { Email } from "../consts/Email";

export const Contact = () => {
  const [subject, setSubject] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = (e: any) => {
    if (subject !== "" && email !== "" && message !== "") {
      e.preventDefault();
      window.location.assign(
        `mailto:${Email}?subject=${subject}&body=${message}`
      );
    }
  };

  return (
    <Container maxWidth={false}>
      <Typography
        variant="h4"
        fontWeight={"bold"}
        color={"black"}
        sx={{ p: "1rem 0 3rem" }}
      >
        Contact Us
      </Typography>
      <FormControl fullWidth onSubmit={handleSubmit}>
        {/* <Grid container direction={"column"}>
          <Grid item> */}
        <TextField
          id="subject"
          label="Subject"
          value={subject}
          onChange={(e) => setSubject(e?.target?.value || "")}
          sx={{ pb: "1rem" }}
        />
        {/* </Grid>
          <Grid item> */}
        <TextField
          id="email"
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e?.target?.value || "")}
          sx={{ pb: "1rem" }}
        />
        {/* <InputLabel htmlFor="email">Email address</InputLabel>
          <Input id="email" aria-describedby="email" />
          <FormHelperText id="email">
            We'll never share your email.
          </FormHelperText> */}
        {/* </Grid>
          <Grid item> */}
        <TextField
          id="message"
          label="Message"
          multiline
          value={message}
          onChange={(e) => setMessage(e?.target?.value || "")}
          sx={{ pb: "1rem" }}
        />
        {/* </Grid>
        </Grid> */}
        <Button variant="contained" type="submit" onClick={handleSubmit}>
          Submit
        </Button>
      </FormControl>
    </Container>
  );
};
