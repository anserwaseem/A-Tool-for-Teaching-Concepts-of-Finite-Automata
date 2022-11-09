import { useEffect, useState } from "react";
import { EditableLabelProps } from "./props/EditableLabelProps";

const possibleTransitionValues = ["a", "b", "^"];

export const EditableLabel = (props: EditableLabelProps) => {
  const [sourceState, setSourceState] = useState("");
  const [targetState, setTargetState] = useState("");

  useEffect(() => {
    console.log("EditableLabel useEffect", props);
  }, [props.transitionValue]);

  return (
    <div
      contentEditable
      suppressContentEditableWarning={true}
      onInput={(e) => {
        // e.stopPropagation();
        console.log("onInput", e.currentTarget.textContent);
        if (
          e.currentTarget.textContent
            .split("")
            .every((r: string) => possibleTransitionValues.includes(r))
        ) {
          console.log("onInput save", e.currentTarget.textContent, props);
          console.log(
            "setting source: ",
            props.selected.id,
            "target: ",
            props.box.id
          );
          setTargetState(props.box.id);
          setSourceState(props.selected.id as string);
          // props.setLines((lines: TransitionModel[]) => {
          //   const line = lines.find(
          //     (line) =>

          // });
          props.setOldTransitionValue(props.transitionValue);
          props.setTransitionValue(e.currentTarget.textContent);
        } else {
          prompt(
            `Please enter a valid transition value ${possibleTransitionValues.join(
              ", "
            )}`
          );
        }
        // e.preventDefault();
        // props.setTransitionValue(
        //   (val) => e.currentTarget.textContent ?? val
        // );
      }}
      style={{
        fontSize: "1.5em",
        padding: "0.4em 0.4em 0",
        color: "purple",
        marginBottom: "1em",
        borderRadius: "1.5em",
      }}
    >
      {props.transitionValue}
    </div>
  );
};
