import "./css/Playground.css";
import { Xwrapper } from "react-xarrows";
import { StateCoreProps } from "./components/playground/props/StateProps";
import { TopBarProps } from "./components/playground/props/TopBarProps";
import TopBar from "./components/playground/TopBar";
import { PlaygroundProps } from "./props/PlaygroundProps";
import State from "./components/playground/State";
import Xarrow from "./components/playground/Xarrow";
import useElementSize from "./hooks/useElementSize";
import { useEffect } from "react";
import { XarrowCoreProps } from "./components/playground/props/XarrowProps";
import { DataContext } from "../components/Editor";
import { useContext } from "react";
import { Box, Grid } from "@mui/material";
import {
  stateFinalColor,
  stateInitialColor,
  stateInitialFinalColor,
} from "../consts/Colors";
import { ToolboxStateSize } from "../consts/ToolboxStateSize";

const Playground = (props: PlaygroundProps) => {
  console.log("re rendering Playground: props", props);

  const dataContext = useContext(DataContext);

  const [boxRef, { width, height }] = useElementSize(
    dataContext.stateSize,
    dataContext.setStates
  );
  const { setPlaygroundSize } = props;

  useEffect(() => {
    setPlaygroundSize({ width, height });
  }, [width, height, setPlaygroundSize]);

  const topBarprops: TopBarProps = {
    selected: props.selected,
    setSelected: props.setSelected,
    handleSelect: props.handleSelect,
    actionState: props.actionState,
    setActionState: props.setActionState,
    handleDeleteRow: props.handleDeleteRow,
    toggleInitialState: props.toggleInitialState,
    toggleFinalState: props.toggleFinalState,
  };

  const stateProps: StateCoreProps = {
    selected: props.selected,
    handleSelect: props.handleSelect,
    actionState: props.actionState,
  };

  const xarrowProps: XarrowCoreProps = {
    selected: props.selected,
    setSelected: props.setSelected,
  };

  return (
    <div>
      <Xwrapper>
        <div
          className="canvasStyle"
          id="canvas"
          onClick={(event) => {
            console.log("canvas clicked", event);
            // reset selected state if clicked outside topbarDialog 
            if (
              !(
                (event.target as any)?.id?.includes("topbarDialog") ||
                (event.target as any)?.nextElementSibling?.id?.includes(
                  "topbarDialog"
                )
              )
            )
              props.handleSelect(null);
          }}
        >
          <div
            id="statesContainer"
            className="statesContainer"
            onDragOver={(e) => e.preventDefault()}
            onDrop={props.handleDropDynamic}
            ref={boxRef}
          >
            <TopBar {...topBarprops} />

            {dataContext.states.map((state) => (
              <State core={stateProps} key={state.id} state={state} />
            ))}
          </div>
          {/* xarrow connections*/}
          {dataContext.transitions.map((transition, i) => (
            <Xarrow
              core={xarrowProps}
              key={transition.start + "-" + transition.end + i}
              transition={transition}
            />
          ))}

          <div className="toolboxMenu">
            <Box>Drag & drop me!</Box>
            {/* <div className="toolboxTitle">Drag & drop me!</div> */}
            <hr />
            <div className="toolboxContainer">
              <Grid
                container
                direction="column"
                justifyContent="space-between"
                alignItems="center"
                sx={{ height: "100%" }}
              >
                <Grid item>
                  <Box
                    className="state"
                    draggable
                    style={{
                      width: `${dataContext?.stateSize}px`,
                      height: `${dataContext?.stateSize}px`,
                      borderRadius: `${dataContext?.stateSize}px`,
                      touchAction: "none",
                    }}
                    // enable touch events for mobile devices
                    onTouchMove={props.handleDropDynamic}
                  >
                    state
                  </Box>
                </Grid>

                <Grid
                  container
                  item
                  direction="column"
                  justifyContent="center"
                  alignItems="center"
                  spacing={1}
                >
                  <Grid item>
                    <Box
                      className="state"
                      sx={{
                        width: `${ToolboxStateSize}px`,
                        height: `${ToolboxStateSize}px`,
                        borderRadius: `${ToolboxStateSize}px`,
                        backgroundColor: stateInitialColor,
                      }}
                    >
                      Initial
                    </Box>
                  </Grid>
                  <Grid item>
                    <Box
                      className="state"
                      sx={{
                        width: `${ToolboxStateSize}px`,
                        height: `${ToolboxStateSize}px`,
                        borderRadius: `${ToolboxStateSize}px`,
                        backgroundColor: stateFinalColor,
                      }}
                    >
                      Final
                    </Box>
                  </Grid>
                  <Grid item>
                    <Box
                      className="state"
                      sx={{
                        width: `${ToolboxStateSize}px`,
                        height: `${ToolboxStateSize}px`,
                        borderRadius: `${ToolboxStateSize}px`,
                        backgroundColor: stateInitialFinalColor,
                      }}
                    >
                      Initial Final
                    </Box>
                  </Grid>
                </Grid>
              </Grid>
            </div>
          </div>
        </div>
      </Xwrapper>
    </div>
  );
};
export default Playground;
