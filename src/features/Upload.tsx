import { useContext } from "react";
import { Button, MenuItem } from "@mui/material";
import FileUploadRoundedIcon from "@mui/icons-material/FileUploadRounded";
import { AutomataData } from "../components/types/AutomataData";
import { DataContext } from "../components/Editor";
import { TransitionModel } from "../models";
import { StyledTransitionLabel } from "./components/playground/StyledTransitionLabel";
import { UploadProps } from "./props/UploadProps";

export const Upload = (props: UploadProps) => {
  const dataContext = useContext(DataContext);

  const handleSetTransitions = (transitions: TransitionModel[]) => {
    transitions.forEach((transition) => {
      transition.props.labels =
        transition.props.value === "" ? (
          ""
        ) : (
          <StyledTransitionLabel label={transition.props.value} />
        );
    });
  };

  const handleFileChange = (event: any) => {
    event.preventDefault();
    console.log("handleFileChange event", event);
    if (event?.target?.files?.length > 0) {
      const newFile: File = event?.target?.files[0];

      const reader = new FileReader();
      reader.onload = (e) => {
        // if no result, return
        if (!e?.target?.result) {
          props.setAlertMessage("Failed reading data.");
          return;
        }

        const rawData = JSON.parse(e.target?.result as string);
        console.log("raw data", rawData);

        // data is corrupted if there is no rowId, rows, states, transitions
        if (
          !rawData?.rowId ||
          !rawData?.rows ||
          !rawData?.states ||
          !rawData?.transitions
        ) {
          props.setAlertMessage("Data is corrupted.");
          return;
        }

        const data = rawData as AutomataData;
        if (!data?.rows || data?.rows?.length <= 0) {
          // if no rows found in data, return
          props.setAlertMessage("No data found");
          return;
        }

        dataContext?.setRowId(data.rowId);
        dataContext?.setRows(data.rows);
        dataContext?.setStates(data.states);
        handleSetTransitions(data.transitions);
        dataContext?.setTransitions(data.transitions);
        console.log("Successfuly uploaded data.");
      };
      reader.readAsText(newFile);
      //clear file input (cache)
      event.target.value = "";
    }
    props.handleCloseToolsMenu();
  };

  return (
    <MenuItem>
      <Button
        variant="text"
        component="label"
        startIcon={<FileUploadRoundedIcon />}
      >
        Upload
        <input
          hidden
          accept="application/json"
          type="file"
          onChange={handleFileChange}
        />
      </Button>
    </MenuItem>
  );
};
