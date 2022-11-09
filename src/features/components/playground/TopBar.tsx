import "./css/TopBar.css";
import { TopBarProps } from "./props/TopBarProps";
import {
  DraggableStateModel,
  RowModel,
  TransitionModel,
} from "../../../models";
import { selectedElementTypeId } from "../../props/SelectedElementType";
import { promptNewStateName } from "../../../utils/PromptNewStateName";
// import MaterialIcon from "material-icons-react";

const actions = {
  box: ["Edit Name", "Add Transition", "Remove Transitions", "Delete"],
  arrow: ["Edit Properties", "Remove Transition"],
};

export const TopBar = (props: TopBarProps) => {
  const handleEditAction = (action: any) => {
    console.log("handleEditAction", action);
    switch (action) {
      case "Edit Name":
        const newName = promptNewStateName(props.boxes, "");

        props.setGridData((rows: RowModel[]) => {
          const row = rows.find(
            (row) => props.selected && row.node === props.selected.id
          );
          if (row) row.node = newName;
          return rows;
        });

        console.log("lines before", props.lines);
        console.log(
          "lines after",
          props.lines.map((line: any, i: number) => {
            // console.log("line", i, line.props);
            var lineProps = line.props;
            if (props.selected && lineProps.start === props.selected.id)
              return { ...line, props: { ...lineProps, start: newName } };
            if (props.selected && line.props.end === props.selected.id)
              return { ...line, props: { ...lineProps, end: newName } };
            return { ...line };
          })
        );

        props.setLines((lines: TransitionModel[]) =>
          lines.map((line: any, i: number) => {
            var lineProps = line.props;
            if (props.selected && lineProps.start === props.selected.id)
              return { ...line, props: { ...lineProps, start: newName } };
            if (props.selected && line.props.end === props.selected.id)
              return { ...line, props: { ...lineProps, end: newName } };
            return { ...line };
          })
        );

        console.log("boxes before", props.boxes);
        console.log(
          "boxes after",
          props.boxes.map((box) =>
            props.selected && box.id === props.selected.id
              ? { ...box, id: newName }
              : { ...box }
          )
        );

        props.setBoxes((boxes: DraggableStateModel[]) =>
          boxes.map((box) =>
            props.selected && box.id === props.selected.id
              ? { ...box, id: newName }
              : { ...box }
          )
        );
        break;

      case "Add Transition":
        console.log("TopBar Add Transition", props);
        // props.setGridData((rows: RowModel[]) => {
        //   const row = rows.find(
        //     (row) => props.selected && row.node === props.selected.id
        //   );
        //   if (row) {
        //     // props.lines.forEach((line) => {

        //   }
        //   return rows;
        // });
        props.setActionState(action);
        break;

      case "Remove Transitions":
        console.log("remove transitions triggered", props);
        if (
          props.selected &&
          window.confirm(
            `Are you sure you want to remove all transitions of ${props.selected.id}?`
          )
        )
          props.setLines((lines: TransitionModel[]) =>
            lines.filter(
              (line: TransitionModel) =>
                !(
                  props.selected &&
                  (line.props.start === props.selected.id ||
                    line.props.end === props.selected.id)
                )
            )
          );

        props.setActionState(action);
        break;

      case "Remove Transition":
        console.log("remove transition triggered", props);
        props.setLines((lines: TransitionModel[]) => {
          return lines.filter(
            (line) =>
              !(
                props.selected &&
                line.props.start ===
                  (props.selected.id as selectedElementTypeId).start &&
                line.props.end ===
                  (props.selected.id as selectedElementTypeId).end
              )
          );
        });
        console.log(
          "lines after",
          props.lines.filter(
            (line) =>
              !(
                props.selected &&
                line.props.start ===
                  (props.selected.id as selectedElementTypeId).start &&
                line.props.end ===
                  (props.selected.id as selectedElementTypeId).end
              )
          )
        );
        break;

      case "Edit Properties":
        props.setLines((lines: TransitionModel[]) =>
          lines.map((line) =>
            props.selected &&
            line.props.start === props.selected.id &&
            line.props.end === props.selected.id
              ? {
                  ...line,
                  menuWindowOpened: true,
                }
              : line
          )
        );
        break;

      case "Delete":
        if (
          props.selected &&
          window.confirm(
            `are you sure you want to delete ${props.selected.id}?`
          )
        ) {
          // first remove any transitions connected to the state.
          props.setLines((lines: TransitionModel[]) =>
            lines.filter(
              (line) =>
                !(
                  props.selected &&
                  (line.props.start === props.selected.id ||
                    line.props.end === props.selected.id)
                )
            )
          );
          // then remove that state.
          if (
            props.selected &&
            props.boxes
              .map((box) => box.id)
              .includes(props.selected.id as string)
          ) {
            props.setBoxes((boxes: DraggableStateModel[]) =>
              boxes.filter(
                (box) => props.selected && !(box.id === props.selected.id)
              )
            );
          }
          props.handleSelect(null);
          if (props.selected) {
            console.log(
              "selected id slice",
              props.selected.id.toString().slice(1)
            );
            props.handleDeleteRow(
              Number(props.selected.id.toString().slice(1))
            );
          }
        }
        break;

      default:
    }
  };

  var returnTopBarApearnce = () => {
    let allowedActions: any[] = [];
    if (props.selected)
      allowedActions = actions[props.selected.type as keyof typeof actions];
    console.log("allowedActions", allowedActions);
    console.log("returnTopBarApearnce", props);
    switch (props.actionState) {
      case "Normal":
        return (
          <div className="actionBubbles">
            {allowedActions.map((action: any, i: number) => (
              <div
                className="actionBubble"
                key={i}
                onClick={() => handleEditAction(action)}
              >
                {action}
              </div>
            ))}
          </div>
        );
      case "Edit Name":
        return (
          <div className="actionBubbles">
            <div
              className="actionBubble"
              onClick={() => handleEditAction("Edit Name")}
            >
              Edit Name
            </div>
          </div>
        );
      case "Add Transition":
        return (
          <div className="actionBubbles">
            <p>To where connect new transition?</p>
            <div
              className="actionBubble"
              onClick={() => props.setActionState("Normal")}
            >
              finish
            </div>
          </div>
        );

      case "Remove Transitions":
        return (
          <div className="actionBubbles">
            <p>Which connection to remove?</p>
          </div>
        );
      default:
    }
  };

  return (
    <div
      className="topBarStyle"
      style={{ height: props.selected === null ? "0" : "60px" }}
      onClick={(e) => e.stopPropagation()}
    >
      <div className="topBarLabel" onClick={() => props.handleSelect(null)}>
        {/*<MaterialIcon*/}
        {/*  size={30}*/}
        {/*  icon="keyboard_arrow_up"*/}
        {/*  className="material-icons topBarToggleIcon"*/}
        {/*/>*/}
        {/* <p>Edit Menu</p> */}
      </div>
      {returnTopBarApearnce()}
    </div>
  );
};

export default TopBar;
