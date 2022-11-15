import { Button, MenuItem } from "@mui/material";
import { useContext } from "react";
import { DataContext } from "../components/Editor";
import FileDownloadRoundedIcon from "@mui/icons-material/FileDownloadRounded";

export const Download = ({
  handleCloseToolsMenu,
}: {
  handleCloseToolsMenu: () => void;
}) => {
  const dataContext = useContext(DataContext);

  return (
    <MenuItem
      onClick={() => {
        handleCloseToolsMenu();
        if (!dataContext) {
          console.log("no data.");
          return;
        }
        if (dataContext?.states?.length === 0) {
          alert("no data to download.");
          return;
        }
        const element = document.createElement("a");
        const file = new Blob([JSON.stringify(dataContext)], {
          type: "application/json",
        });
        element.href = URL.createObjectURL(file);
        element.download = "data.json";
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
