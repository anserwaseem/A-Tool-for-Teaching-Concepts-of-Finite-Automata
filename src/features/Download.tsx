import { Button, Tooltip, Menu, MenuItem } from "@mui/material";
import { useContext } from "react";
import { DataContext } from "../components/Editor";

export const Download = ({
  handleCloseUserMenu,
}: {
  handleCloseUserMenu: () => void;
}) => {
  const data = useContext(DataContext);

  return (
    <MenuItem
      onClick={() => {
        handleCloseUserMenu();
        if (!data) {
          console.log("no data.");
          return;
        }
        if (data?.states?.length === 0) {
          alert("no data to download.");
          return;
        }
        const element = document.createElement("a");
        const file = new Blob([JSON.stringify(data)], {
          type: "application/json",
        });
        element.href = URL.createObjectURL(file);
        element.download = "data.json";
        document.body.appendChild(element); // Required for this to work in FireFox
        element.click();
      }}
    >
      Download
    </MenuItem>
  );
};
