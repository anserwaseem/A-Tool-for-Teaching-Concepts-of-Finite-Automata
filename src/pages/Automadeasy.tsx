import { Box, Button, Divider, Grid, Link, Typography } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import {
  Timeline,
  TimelineItem,
  TimelineSeparator,
  TimelineDot,
  TimelineConnector,
  TimelineContent,
} from "@mui/lab";
import {
  StyledGridOverlay,
  StyledSvg,
} from "../features/components/transitionTable/NoRowsOverlay";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { homeBackgroundColor } from "../consts/Colors";
import "./css/Automadeasy.css";
import { Pages } from "../enums/Pages";
import { HelpHeaders } from "../enums/HelpHeaders";

export const Automadeasy = () => {
  console.log("re rendering Automadeasy");

  return (
    <>
      <Grid
        container
        direction="row"
        justifyContent="space-evenly"
        className="hero-section-1"
        columnSpacing={10}
        alignItems="center"
        p={"7rem"}
        sx={{
          backgroundColor: homeBackgroundColor,
        }}
      >
        <Grid item sm={3}>
          <Box
            component="img"
            alt="logo"
            src="/logo512.png"
            maxWidth={"100px"}
          />
        </Grid>

        <Grid item sm>
          <Typography fontSize={"3rem"} fontWeight={"bold"} color={"black"}>
            Automata made easy
          </Typography>
          <Typography variant="h6" color={"black"}>
            Learning theory of automata is hard, Automadeasy makes it easy, fun
            and interactive.
          </Typography>
        </Grid>
      </Grid>

      <Grid
        container
        direction="row"
        justifyContent="space-evenly"
        className="hero-section-2"
        columnSpacing={10}
        rowSpacing={{
          xs: 5,
          sm: 0,
        }}
        alignItems="center"
        p={"7rem"}
        sx={{
          backgroundColor: homeBackgroundColor,
        }}
      >
        <Grid item sm>
          <Typography
            variant="h4"
            fontWeight={"bold"}
            color={"black"}
            textAlign={"right"}
            py={"2rem"}
          >
            Start learning
          </Typography>
          <Typography variant="h6" color={"black"} textAlign={"right"}>
            Automadeasy is a platform that allows you to learn and practice the
            concepts of automata theory in a fun and interactive way.
          </Typography>
          <Box
            sx={{
              display: "flex",
              justifyContent: "flex-end",
              paddingTop: "2rem",
            }}
          >
            <Button
              variant="text"
              color="secondary"
              endIcon={<ChevronRightIcon />}
              href="/editor"
              sx={{
                paddingRight: "0",
              }}
            >
              Get Started
            </Button>
          </Box>
        </Grid>

        <Grid item sm={4}>
          <StyledGridOverlay>
            <Box sx={{ transform: "scale(1.5)" }}>
              <StyledSvg />
            </Box>
          </StyledGridOverlay>
        </Grid>
      </Grid>

      <Grid
        container
        direction={{
          xs: "column",
          md: "row",
        }}
        justifyContent="space-evenly"
        paddingTop={"7rem"}
      >
        <Grid item xs>
          <Link
            component={RouterLink}
            to={`${process.env.PUBLIC_URL}/${Pages.Help}`}
            state={{ defaultExpandedHeader: HelpHeaders.HowToCreateAutomaton }}
            sx={{
              textDecoration: "none",
            }}
          >
            <Typography variant="h6" color={"black"} align={"center"}>
              Creating Automaton
            </Typography>
          </Link>
          <Divider
            variant={"inset"}
            sx={{
              width: "50%",
              margin: "0 auto",
              height: "2px",
            }}
          />
          <Timeline position="alternate">
            <TimelineItem>
              <TimelineSeparator>
                <TimelineDot color="secondary" />
                <TimelineConnector />
              </TimelineSeparator>
              <TimelineContent>DFA</TimelineContent>
            </TimelineItem>
            <TimelineItem>
              <TimelineSeparator>
                <TimelineDot color="success" />
              </TimelineSeparator>
              <TimelineContent>NFA</TimelineContent>
            </TimelineItem>
          </Timeline>
        </Grid>

        <Grid item xs>
          <Link
            component={RouterLink}
            to={`${process.env.PUBLIC_URL}/${Pages.Help}`}
            state={{ defaultExpandedHeader: HelpHeaders.HowToConvertNFAtoDFA }}
            sx={{
              textDecoration: "none",
            }}
          >
            <Typography variant="h6" color={"black"} align={"center"}>
              Converting NFA to DFA
            </Typography>
          </Link>
          <Divider
            variant={"inset"}
            sx={{
              width: "50%",
              margin: "0 auto",
              height: "2px",
            }}
          />
          <Timeline position="alternate">
            <TimelineItem>
              <TimelineSeparator>
                <TimelineDot color="warning" />
                <TimelineConnector />
              </TimelineSeparator>
              <TimelineContent>Null Closure</TimelineContent>
            </TimelineItem>
            <TimelineItem>
              <TimelineSeparator>
                <TimelineDot color="success" />
                <TimelineConnector />
              </TimelineSeparator>
              <TimelineContent>Modified Table</TimelineContent>
            </TimelineItem>
            <TimelineItem>
              <TimelineSeparator>
                <TimelineDot color="secondary" />
              </TimelineSeparator>
              <TimelineContent>Resultant DFA</TimelineContent>
            </TimelineItem>
          </Timeline>
        </Grid>

        <Grid item xs>
          <Link
            component={RouterLink}
            to={`${process.env.PUBLIC_URL}/${Pages.Help}`}
            state={{ defaultExpandedHeader: HelpHeaders.HowToMinimizeDFA }}
            sx={{
              textDecoration: "none",
            }}
          >
            <Typography variant="h6" color={"black"} align={"center"}>
              Minimizing DFA
            </Typography>
          </Link>
          <Divider
            variant={"inset"}
            sx={{
              width: "50%",
              margin: "0 auto",
              height: "2px",
            }}
          />
          <Timeline position="alternate">
            <TimelineItem>
              <TimelineSeparator>
                <TimelineDot color="secondary" />
                <TimelineConnector />
              </TimelineSeparator>
              <TimelineContent>Equivalence States</TimelineContent>
            </TimelineItem>
            <TimelineItem>
              <TimelineSeparator>
                <TimelineDot color="success" />
              </TimelineSeparator>
              <TimelineContent>Minimized DFA</TimelineContent>
            </TimelineItem>
          </Timeline>
        </Grid>
      </Grid>
    </>
  );
};
