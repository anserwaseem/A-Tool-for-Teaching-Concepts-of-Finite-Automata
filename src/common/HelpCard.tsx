import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import { HelpCardProps } from "./props/HelpCardProps";

export const HelpCard = (props: HelpCardProps) => {
  return (
    <Card>
      <CardContent>
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
