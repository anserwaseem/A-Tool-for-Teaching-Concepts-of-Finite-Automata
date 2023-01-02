import { useState } from "react";
import {
  Accordion,
  AccordionSummary,
  Typography,
  AccordionDetails,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { HelpHeaders } from "../enums/HelpHeaders";
import { HelpDetails } from "../enums/HelpDetails";
import { HelpCard } from "../common/HelpCard";

const videoSrc =
  "https://github.com/anserwaseem/automadeasy-videos/raw/main/help/";

const headers = Object.values(HelpHeaders);
const details = Object.values(HelpDetails);

export const Help = () => {
  const [expanded, setExpanded] = useState<string | false>(false);

  const handleChange =
    (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
      setExpanded(isExpanded ? panel : false);
    };

  return (
    <div>
      {headers.map((header, index) => (
        <Accordion
          key={header}
          expanded={expanded === header}
          onChange={handleChange(header)}
        >
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            id={header}
            sx={{
              "& .MuiAccordionSummary-content": {
                marginRight: 5,
              },
            }}
          >
            <Typography
              width="33%"
              flexShrink={0}
              mr={5}
              fontSize={
                expanded.toString() === header.toString() ? "1.3rem" : "1.1rem"
              }
              fontWeight={
                expanded.toString() === header.toString() ? "bold" : "normal"
              }
            >
              {header}
            </Typography>

            {expanded.toString() !== header.toString() && (
              <Typography
                color="text.secondary"
                overflow="hidden"
                textOverflow="ellipsis"
                display="-webkit-box"
                sx={{
                  WebkitLineClamp: "1",
                  WebkitBoxOrient: "vertical",
                }}
              >
                {details[index]}
              </Typography>
            )}
          </AccordionSummary>
          <AccordionDetails>
            <HelpCard
              title={header}
              description={details[index]}
              videoSource={videoSrc + Object.keys(HelpHeaders)[index] + ".mp4"}
            />
          </AccordionDetails>
        </Accordion>
      ))}
    </div>
  );
};
