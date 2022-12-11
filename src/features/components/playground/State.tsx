import Draggable from "react-draggable";
import { useXarrow } from "react-xarrows";
import { RowModel, TransitionModel } from "../../../models";
import { DataContext } from "../../../components/Editor";
import { useContext } from "react";
import { StateAllProps } from "./props/StateProps";
import { Box } from "@mui/material";
import { stateFinalColor, stateHoverColor, stateInitialColor, stateInitialFinalColor, stateOperationColor, stateSelectedColor } from "../../../consts/Colors";

export const State = (props: StateAllProps) => {
  console.log("re rendering Box: props", props);

  const dataContext = useContext(DataContext);

  const updateXarrow = useXarrow();
  const handleClick = (e: any) => {
    console.log("Box handleClick", props);
    e.stopPropagation(); //so only the click event on the state will fire on not on the container itself

    if (props.stateProps.actionState === "Normal") {
      console.log("Box handleClick Normal", props);
      props.stateProps.handleSelect(e);
    } else if (props.stateProps.actionState === "Add Transition") {
      console.log("Box handleClick Add Transition", props);

      // restrict adding of new transition between states where a transition already exists
      if (
        !dataContext?.transitions.find(
          (transition: TransitionModel) =>
            transition.props.start === props.stateProps.selected?.id &&
            transition.props.end === props.state.id
        )
      ) {
        console.log("Box handleClick Add Transition setTransitions", props);
        const isSelfTransition =
          props.stateProps.selected?.id === props.state.id;
        dataContext?.setTransitions((transitions: TransitionModel[]) => [
          ...transitions,
          {
            props: {
              labels: "",
              value: "",
              start: props.stateProps.selected?.id as string,
              end: props.state.id,
              animateDrawing: true,
              _extendSVGcanvas: isSelfTransition ? 25 : 0,
              _cpx1Offset: isSelfTransition ? -50 : 0,
              _cpy1Offset: isSelfTransition ? -50 : 0,
              _cpx2Offset: isSelfTransition ? 50 : 0,
              _cpy2Offset: isSelfTransition ? -50 : 0,
            },
          },
        ]);
      }
    } else if (props.stateProps.actionState === "Remove Transitions") {
      console.log("Box handleClick Remove Transitions", props);
      dataContext?.setTransitions((transitions: TransitionModel[]) =>
        transitions.filter(
          (transition) =>
            !(
              transition.props.start === props.stateProps.selected?.id &&
              transition.props.end === props.state.id
            )
        )
      );
    }
  };

  console.log("changing background color now", props.stateProps.actionState);
  let background = null;
  if (
    props.stateProps.selected &&
    props.stateProps.selected?.id === props.state.id
  ) {
    background = stateSelectedColor;
  } else if (
    (props.stateProps.actionState === "Add Transition" &&
      dataContext?.transitions.filter(
        (transition: TransitionModel) =>
          transition.props.start === props.stateProps.selected?.id &&
          transition.props.end === props.state.id
      ).length === 0) ||
    (props.stateProps.actionState === "Remove Transitions" &&
      dataContext?.transitions.filter(
        (transition: TransitionModel) =>
          transition.props.start === props.stateProps.selected?.id &&
          transition.props.end === props.state.id
      ).length > 0)
  ) {
    background = stateOperationColor;
  }
  
  else if (
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
      <Draggable onDrag={updateXarrow}>
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
          id={props.state.id}
        >
          {props.state.id}
        </Box>
      </Draggable>
    </>
  );
};

export default State;
