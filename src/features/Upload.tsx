import { useContext } from "react";
import { Button, MenuItem } from "@mui/material";
import FileUploadRoundedIcon from "@mui/icons-material/FileUploadRounded";
import { AutomataData } from "../components/types/AutomataData";
import { DataContext } from "../components/Editor";
import { TransitionModel } from "../models";
import { StyledTransitionLabel } from "./components/playground/StyledTransitionLabel";
import { UploadProps } from "./props/UploadProps";
import { StateMaxSize, StateMinSize } from "../consts/StateSizes";
import { PossibleTransitionValues } from "../consts/PossibleTransitionValues";

export const Upload = (props: UploadProps) => {
  console.log("re rendering Upload: props", props);

  const dataContext = useContext(DataContext);

  const handleSetTransitions = (transitions: TransitionModel[]) => {
    transitions.forEach((transition) => {
      transition.labels =
        transition.value === "" ? (
          ""
        ) : (
          <StyledTransitionLabel label={transition.value} />
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
        if (!e?.target?.result) {
          props.setAlertMessage("Failed reading file.");
          return;
        }

        let data: AutomataData;
        try {
          data = JSON.parse(e.target?.result as string);
          // freeze the data to avoid mutating it
          Object.freeze(data);
        } catch (e) {
          props.setAlertMessage("Failed parsing data.");
          return;
        }
        console.log("raw data", data);

        if (
          !data?.rowId ||
          !data?.rows ||
          !data?.states ||
          !data?.transitions ||
          !data?.stateSize ||
          data?.rowId < 0 ||
          data?.rows?.length <= 0 ||
          data?.states?.length <= 0 ||
          data?.transitions?.length <= 0 ||
          data?.stateSize < StateMinSize ||
          data?.stateSize > StateMaxSize
        ) {
          props.setAlertMessage("Data is corrupted.");
          return;
        }

        const stateIds = data?.states?.map((state) => state?.id);
        if (new Set(stateIds)?.size !== stateIds?.length) {
          props.setAlertMessage("State ids are not unique. Data is corrupted.");
          return;
        }

        const rowIds = data?.rows?.map((row) => row?.id);
        if (new Set(rowIds)?.size !== rowIds?.length) {
          props.setAlertMessage("Row ids are not unique. Data is corrupted.");
          return;
        }

        const transitionValues = data?.transitions?.map(
          (transition) => transition?.value
        );
        if (
          !transitionValues?.every(
            (value) =>
              // there should be no empty values
              value !== "" &&
              // there should be no values that are not in the PossibleTransitionValues
              value
                ?.split("")
                ?.every((val) => PossibleTransitionValues?.includes(val))
          )
        ) {
          props.setAlertMessage(
            "Transition values are not valid. Data is corrupted."
          );
          return;
        }

        data?.rows?.forEach((row) => {
          PossibleTransitionValues?.concat("state")?.forEach((value) => {
            row[value === "^" ? "nul" : value] = row[
              value === "^" ? "nul" : value
            ]
              ?.toString()
              ?.trim();
          });
        });

        data?.states?.forEach((state) => {
          state.id = state?.id?.toString()?.trim();
          state.x = Math.abs(state?.x);
          state.y = Math.abs(state?.y);
        });

        data?.transitions?.forEach((transition) => {
          transition.start = transition?.start?.toString()?.trim();
          transition.end = transition?.end?.toString()?.trim();
          transition.value = transition?.value?.toString()?.trim();
        });

        dataContext?.setRowId(data?.rowId);
        dataContext?.setRows(data?.rows);
        dataContext?.setStates(data?.states);
        handleSetTransitions(data?.transitions);
        dataContext?.setTransitions(data?.transitions);
        dataContext?.setStateSize(data?.stateSize);
        console.log("Successfuly uploaded data.");
      };
      reader.readAsText(newFile);
      // clear file input (cache)
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
