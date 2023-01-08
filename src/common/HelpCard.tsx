import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import { homeBackgroundColor } from "../consts/Colors";
import { HelpCardProps } from "./props/HelpCardProps";

export const HelpCard = (props: HelpCardProps) => {
  return (
    <Card
      sx={{
        backgroundColor: homeBackgroundColor,
      }}
    >
      <CardContent
        sx={{
          borderRadius: "50px !important",
          borderBottom: "11px solid #e0e0e0",
          backgroundColor: "white",
        }}
      >
        <Typography variant="body2" color="text.secondary" fontSize="1rem">
          {props.description}
        </Typography>
      </CardContent>
      <CardMedia
        component="video"
        src={props.videoSource}
        controls
        muted
        playsInline
        autoPlay
      />
    </Card>
  );
};
