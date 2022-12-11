import { Button, MenuItem } from "@mui/material";
import { useContext } from "react";
import { DataContext } from "../components/Editor";
import FileDownloadRoundedIcon from "@mui/icons-material/FileDownloadRounded";
import { DownloadProps } from "./props/DownloadProps";

export const Download = (props:DownloadProps) => {
  const dataContext = useContext(DataContext);

  return (
    <MenuItem
      onClick={() => {
        props.handleCloseToolsMenu();
        if (!dataContext) {
          console.log("no data.");
          return;
        }
        if (dataContext?.states?.length === 0) {
          props.setAlertMessage("no data to download.");
          return;
        }
        const element = document.createElement("a");
        const file = new Blob([JSON.stringify(dataContext)], {
          type: "application/json",
        });
        element.href = URL.createObjectURL(file);
        element.download = "automadeasy.json";
        document.body.appendChild(element); // Required for this to work in FireFox
        element.click();
      }}
    >
      <Button
        variant="text"
        component="label"
        startIcon={<FileDownloadRoundedIcon />}
      >
        Download
      </Button>
    </MenuItem>
  );
};
