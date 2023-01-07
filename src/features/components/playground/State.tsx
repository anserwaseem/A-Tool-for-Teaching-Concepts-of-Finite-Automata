import Draggable from "react-draggable";
import { useXarrow } from "react-xarrows";
import { RowModel, TransitionModel } from "../../../models";
import { DataContext } from "../../../pages/Editor";
import { useContext } from "react";
import { StateProps } from "./props/StateProps";
import { Box } from "@mui/material";
import {
  stateFinalColor,
  stateHoverColor,
  stateInitialColor,
  stateInitialFinalColor,
  stateOperationColor,
  stateSelectedColor,
} from "../../../consts/Colors";

export const State = (props: StateProps) => {
  console.log("re rendering State: props", props);

  const dataContext = useContext(DataContext);

  const updateXarrow = useXarrow();
  const handleClick = (e: any) => {
    e.stopPropagation(); // so that click/touch event will be fired on the state only and not on the container itself

    if (props?.core?.actionState === "Normal") props?.core?.handleSelect(e);
    else if (props?.core?.actionState === "Add Transition") {
      // restrict adding of new transition between states where a transition already exists
      if (
        !dataContext?.transitions.find(
          (transition: TransitionModel) =>
            transition.start === props?.core?.selected?.id &&
            transition.end === props.state.id
        )
      ) {
        const isSelfTransition = props?.core?.selected?.id === props.state.id;

        dataContext?.setTransitions((transitions: TransitionModel[]) => [
          ...transitions,
          new TransitionModel({
            start: props?.core?.selected?.id as string,
            end: props.state.id,
            labels: "",
            value: "",
            strokeWidth: dataContext?.stateSize / 10,
            animateDrawing: true,
            _extendSVGcanvas: isSelfTransition ? 25 : 0,
            _cpx1Offset: isSelfTransition ? -50 : 0,
            _cpy1Offset: isSelfTransition ? -50 : 0,
            _cpx2Offset: isSelfTransition ? 50 : 0,
            _cpy2Offset: isSelfTransition ? -50 : 0,
          }),
        ]);
      }
    } else if (props?.core?.actionState === "Remove Transitions")
      dataContext?.setTransitions((transitions: TransitionModel[]) =>
        transitions.filter(
          (transition) =>
            !(
              transition.start === props?.core?.selected?.id &&
              transition.end === props.state.id
            )
        )
      );
  };

  let background = null;
  if (props?.core?.selected && props?.core?.selected?.id === props.state.id) {
    background = stateSelectedColor;
  } else if (
    (props?.core?.actionState === "Add Transition" &&
      dataContext?.transitions.filter(
        (transition: TransitionModel) =>
          transition.start === props?.core?.selected?.id &&
          transition.end === props.state.id
      ).length === 0) ||
    (props?.core?.actionState === "Remove Transitions" &&
      dataContext?.transitions.filter(
        (transition: TransitionModel) =>
          transition.start === props?.core?.selected?.id &&
          transition.end === props.state.id
      ).length > 0)
  ) {
    background = stateOperationColor;
  } else if (
    dataContext?.rows.find(
      (row: RowModel) =>
        row.state === props.state.id && row.isInitial && row.isFinal
    )
  ) {
    background = stateInitialFinalColor;
  } else if (
    dataContext?.rows.find(
      (row: RowModel) => row.state === props.state.id && row.isInitial
    )
  ) {
    background = stateInitialColor;
  } else if (
    dataContext?.rows.find(
      (row: RowModel) => row.state === props.state.id && row.isFinal
    )
  ) {
    background = stateFinalColor;
  }

  return (
    <>
      <Draggable
        // prevent the state from being dragged outside the container
        bounds="parent"
        onDrag={updateXarrow}
      >
        <Box
          className="state"
          sx={{
            left: props.state.x,
            top: props.state.y,
            background: background ?? undefined,
            width: `${dataContext?.stateSize}px`,
            height: `${dataContext?.stateSize}px`,
            borderRadius: `${dataContext?.stateSize}px`,
            position: "absolute",
            "&:hover": {
              background: stateHoverColor,
            },
          }}
          onClick={handleClick}
          onTouchMove={handleClick}
          id={props.state.id}
        >
          {props.state.id}
        </Box>
      </Draggable>
    </>
  );
};

export default State;
