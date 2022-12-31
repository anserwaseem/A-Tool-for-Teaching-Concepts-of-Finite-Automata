import { Button, MenuItem } from "@mui/material";
import { useContext } from "react";
import { DataContext } from "../components/Editor";
import FileDownloadRoundedIcon from "@mui/icons-material/FileDownloadRounded";
import { DownloadProps } from "./props/DownloadProps";
import { TransitionModel } from "../models";
import { AutomataData } from "../components/types/AutomataData";

export const Download = (props: DownloadProps) => {
  console.log("re rendering Download: props", props);
  
  const dataContext = useContext(DataContext);

  return (
    <MenuItem
      onClick={() => {
        props.handleCloseToolsMenu();

        if (!dataContext) {
          console.log("No data.");
          return;
        }

        if (dataContext?.states?.length === 0) {
          props.setAlertMessage("No data to download.");
          return;
        }
        const element = document.createElement("a");

        // make a copy of dataContext to avoid mutating the original dataContext
        // remove lables prop from all transitions before downloading
        const dataContextCopy = JSON.parse(
          JSON.stringify(dataContext)
        ) as AutomataData;
        dataContextCopy.transitions.forEach((transition: TransitionModel) => {
          delete transition.labels;
        });
        // remove unnecessary data before downloading
        delete dataContextCopy.columns;
        delete dataContextCopy.playgroundSize;

        const file = new Blob([JSON.stringify(dataContextCopy)], {
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
