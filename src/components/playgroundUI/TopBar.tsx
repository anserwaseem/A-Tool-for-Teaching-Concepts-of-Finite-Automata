import React from "react";
import "./css/TopBar.css";
// import MaterialIcon from "material-icons-react";

const actions = {
  box: ["Add Transition", "Remove Transitions", "Delete"],
  arrow: ["Edit Properties", "Remove Transition"],
};

export const TopBar = (props: any) => {
  const handleEditAction = (action: any) => {
    switch (action) {
      case "Edit Name":
        props.setBoxes((boxes: any[]) => {
          var newName = prompt("Enter new name: ");
          while (
            [...boxes, ...props.interfaces].map((a) => a.id).includes(newName)
          )
            newName = prompt("Name Already taken,Choose another: ");
          if (!newName) return;
          return boxes.map((box) =>
            box.id === props.selected.id ? { ...box, id: newName } : box
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
        props.setLines((lines: any[]) =>
          lines.filter(
            (line) =>
              !(
                line.props.root === props.selected.id.root &&
                line.props.end === props.selected.id.end
              )
          )
        );
        break;
      case "Edit Properties":
        props.setLines((lines: any[]) =>
          lines.map((line) =>
            line.props.root === props.selected.id.root &&
            line.props.end === props.selected.id.end
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
          window.confirm(
            `are you sure you want to delete ${props.selected.id}?`
          )
        ) {
          // first remove any lines connected to the node.
          props.setLines((lines: any[]) => {
            return lines.filter(
              (line) =>
                !(
                  line.props.root === props.selected.id ||
                  line.props.end === props.selected.id
                )
            );
          });
          // if its a box remove from boxes
          if (
            props.boxes.map((box: any) => box.id).includes(props.selected.id)
          ) {
            props.setBoxes((boxes: any[]) =>
              boxes.filter((box) => !(box.id === props.selected.id))
            );
          }
          // if its a interface remove from interfaces
          else if (
            props.interfaces
              .map((itr: any) => itr.id)
              .includes(props.selected.id)
          ) {
            props.setInterfaces((itrs: any[]) =>
              itrs.filter((itr) => !(itr.id === props.selected.id))
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
