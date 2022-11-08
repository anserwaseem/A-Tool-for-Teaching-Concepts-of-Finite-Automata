import { Box, Button } from "@mui/material";
import { DataGrid, GridColumns, GridActionsCellItem } from "@mui/x-data-grid";
import { darken, lighten } from "@mui/material/styles";
import { TransitionTableProps } from "./props/TransitionTableProps";

const getBackgroundColor = (color: string, mode: string) =>
  mode === "dark" ? darken(color, 0.6) : lighten(color, 0.6);

const TransitionTable = (props: TransitionTableProps) => {
  // const [selectedIndex, setSelectedIndex] = useState(1);
  // const [boxes, setBoxes] = useState<DraggableStateModel[]>([]);
  // const boxez = [
  //   { id: "box1", x: 50, y: 20, reference: useRef(null) },
  //   { id: "box2", x: 20, y: 250, reference: useRef(null) },
  //   { id: "box3", x: 350, y: 80, reference: useRef(null) },
  // ];
  // const [lines] = useState([
  //   {
  //     start: "box1",
  //     end: "box2",
  //     headSize: 14,
  //     labels: { end: "endLabel" },
  //   },
  //   {
  //     start: "box2",
  //     end: "box3",
  //     color: "red",
  //     labels: {
  //       middle: (
  //         <div
  //           contentEditable
  //           suppressContentEditableWarning={true}
  //           style={{ font: "italic 1.5em serif", color: "purple" }}
  //         >
  //           Editable label
  //         </div>
  //       ),
  //     },
  //     headSize: 0,
  //     strokeWidth: 15,
  //   },
  //   {
  //     start: "box3",
  //     end: "box1",
  //     color: "green",
  //     path: "grid",
  //     // endAnchor: ["right", {position: "left", offset: {y: -10}}],
  //     dashness: { animation: 1 },
  //   },
  // ]);

  // function handleListItemClick(event: any, index: number) {
  //   setSelectedIndex(index);
  // }

  return (
    <>
      <Button size="small" onClick={props.handleAddRow}>
        Add a row
      </Button>
      <Box
        sx={{
          "& .super-app-theme--Both": {
            bgcolor: (theme) =>
              `${getBackgroundColor(
                theme.palette.error.main,
                theme.palette.mode
              )} !important`,
          },

          "& .super-app-theme--Initial": {
            bgcolor: (theme) =>
              `${getBackgroundColor(
                theme.palette.info.main,
                theme.palette.mode
              )} !important`,
          },

          "& .super-app-theme--Final": {
            bgcolor: (theme) =>
              `${getBackgroundColor(
                theme.palette.success.main,
                theme.palette.mode
              )} !important`,
          },
        }}
      >
        <DataGrid
          rows={props.gridData}
          columns={props.gridColumns}
          autoHeight
          hideFooter
          experimentalFeatures={{ newEditingApi: true }}
          getRowClassName={(params) =>
            `super-app-theme--${
              params?.row?.isInitial && params?.row?.isFinal
                ? "Both"
                : params?.row?.isInitial
                ? "Initial"
                : params?.row?.isFinal && "Final"
            }`
          }
        ></DataGrid>
      </Box>
    </>
  );
};
export default TransitionTable;
