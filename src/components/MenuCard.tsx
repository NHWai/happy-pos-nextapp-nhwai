import * as React from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import { CardActionArea } from "@mui/material";

interface Props {
  name: string;
  url: string;
}

export default function MenuCard({ name, url }: Props) {
  return (
    <Card sx={{ maxWidth: 345, minWidth: 25 }}>
      <CardActionArea>
        <CardMedia
          component="img"
          height="140"
          image={url}
          alt="green iguana"
        />
        <CardContent>
          <Typography
            gutterBottom
            variant="caption"
            align="center"
            component="div"
            fontWeight={"bold"}
          >
            {name}
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}
