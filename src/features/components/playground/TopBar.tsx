import "./css/TopBar.css";
import { TopBarProps } from "./props/TopBarProps";
import { DraggableStateModel, TransitionModel } from "../../../models";
import { selectedElementTypeId } from "../../props/SelectedElementType";
// import MaterialIcon from "material-icons-react";

const actions = {
  box: ["Edit Name", "Add Transition", "Remove Transitions", "Delete"],
  arrow: ["Edit Properties", "Remove Transition"],
};

const enterNewName = (boxes: DraggableStateModel[]) => {
  var newName = prompt("Enter new name: ");
  while (
    !newName ||
    (newName && [...boxes].map((b) => b.id).includes(newName)) ||
    newName.length > 4
  ) {
    if (!newName)
      newName = prompt("Name cannot be empty, choose another one: ");
    else if (newName && [...boxes].map((b) => b.id).includes(newName))
      newName = prompt("Name already taken, choose another one: ");
    else if (newName.length > 4)
      newName = prompt("Name cannot be longer than 4 characters: ");
  }
  return newName;
};

export const TopBar = (props: TopBarProps) => {
  const handleEditAction = (action: any) => {
    console.log("handleEditAction", action);
    switch (action) {
      case "Edit Name":
        props.setBoxes((boxes: DraggableStateModel[]) => {
          var newName = enterNewName(boxes);
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

          console.log("boxes before", boxes);
          console.log(
            "boxes after",
            boxes.map((box) =>
              props.selected && box.id === props.selected.id
                ? { ...box, id: newName }
                : { ...box }
            )
          );

          return boxes.map((box) =>
            props.selected && box.id === props.selected.id
              ? { ...box, id: newName }
              : { ...box }
          );
        });
        break;
      case "Add Transition":
        props.setActionState(action);
        break;
      case "Remove Transitions":
        props.setActionState(action);
        break;
      case "Remove Transition":
        console.log("remove transition triggered", props);
        props.setLines((lines: TransitionModel[]) => {
          const start = (props.selected!.id as selectedElementTypeId).start;
          const end = (props.selected!.id as selectedElementTypeId).end;
          console.log("start", start, "end", end);
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
          // first remove any lines connected to the node.
          props.setLines((lines: TransitionModel[]) => {
            return lines.filter(
              (line) =>
                !(
                  props.selected &&
                  (line.props.start === props.selected.id ||
                    line.props.end === props.selected.id)
                )
            );
          });
          // if its a box remove from boxes
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
