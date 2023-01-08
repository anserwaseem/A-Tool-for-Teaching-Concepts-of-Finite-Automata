import { Container, Typography } from "@mui/material";
import { homeBackgroundColor } from "../../consts/Colors";

export const Footer = () => {
  return (
    <Container
      maxWidth={false}
      component="footer"
      sx={{
        py: "1rem",
        backgroundColor: homeBackgroundColor,
      }}
    >
      <Typography
        variant="subtitle1"
        color={"black"}
        align={"center"}
        fontWeight={"bold"}
      >
        Copyright © {new Date().getFullYear()} Automadeasy
      </Typography>
    </Container>
  );
};
