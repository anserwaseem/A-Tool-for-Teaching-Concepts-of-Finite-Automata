import { useState } from "react";
import { MuiFileInput } from "mui-file-input";
import { Button, MenuItem } from "@mui/material";
import FileUploadRoundedIcon from "@mui/icons-material/FileUploadRounded";
import { RowModel, DraggableStateModel, TransitionModel } from "../models";
import { AutomataData } from "../components/types/AutomataData";

export const Upload = ({
  handleCloseToolsMenu,
}: {
  handleCloseToolsMenu: () => void;
}) => {
  const [data, setData] = useState<AutomataData>({} as AutomataData);

  const handleFileChange = (event: any) => {
    console.log("handleFileChange");
    const newFile: File = event?.target?.files[0];

    // if any error occurs, return
    if (!newFile || newFile?.size <= 0) {
      alert("Upload failed.");
      return;
    }

    const reader = new FileReader();
    reader.readAsText(newFile);
    reader.onload = (e) => {
      // if no result, return
      if (!e?.target?.result) {
        alert("Failed reading data.");
        return;
      }

      const rawData = JSON.parse(e.target?.result as string);
      console.log("raw data", rawData);

      // data is corrupted if there are more or less arrays
      if (Object.keys(rawData)?.length !== 3) {
        alert("Data is corrupted.");
        return;
      }

      const data = rawData as AutomataData;
      if (!data.rows || data?.rows?.length <= 0) {
        // if no rows found in data, return
        alert("No data found");
        return;
      }

      console.log("Successfuly uploaded data.");
      setData(data);
    };
    handleCloseToolsMenu();
  };

  //   const handleChange = (newFile: File) => {
  //     console.log("newFile", newFile);
  //     setFile(newFile);
  //   };

  return (
    <MenuItem
    //   onClick={() => {
    //     // handleCloseToolsMenu();
    //   }}
    >
      {/* <MuiFileInput value={file} onChange={handleChange} />
      Upload */}
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
