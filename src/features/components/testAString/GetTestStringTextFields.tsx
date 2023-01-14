import { TextField } from "@mui/material";
import { startingStateColor, stateSelectedColor } from "../../../consts/Colors";

export const GetTestStringTextFields = (
  testString: string,
  testStringIndex: number
) => {
  return testString
    .replaceAll("^", "")
    .split("")
    .map((char, index) => (
      <TextField
        key={index}
        id={`testString${index}`}
        value={char}
        variant="standard"
        InputProps={{
          readOnly: true,
          sx: {
            textAlignLast: "center",
          },
        }}
        sx={{
          backgroundColor:
            Math.floor((testStringIndex - 1) / 2) === index
              ? startingStateColor
              : "inherit",
          flexDirection: "inherit",
          borderRadius: "20px",
          border: `1px solid ${stateSelectedColor}`,
          borderWidth: "0 1px 0 1px",
        }}
      />
    ));
};
