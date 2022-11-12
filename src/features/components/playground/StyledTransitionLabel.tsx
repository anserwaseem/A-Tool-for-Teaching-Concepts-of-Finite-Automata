import { Box } from "@mui/material";

export const StyledTransitionLabel = (props: { label: string }) => {
  return (
    <Box
      style={{
        backgroundColor: "white",
        border: "3px solid coral",
        borderRadius: "5px",
        padding: "5px",
        margin: "5px",
        fontWeight: "bolder",
        boxShadow: "0px 0px 5px 0px rgba(0,0,0,0.3)",
      }}
    >
      {props.label}
    </Box>
  );
};
