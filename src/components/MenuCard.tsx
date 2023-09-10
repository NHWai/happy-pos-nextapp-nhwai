import * as React from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import { CardActionArea } from "@mui/material";
import RouteLink from "next/link";

interface Props {
  name: string;
  url: string;
  href: string;
  price: number;
}

export default function MenuCard({ name, url, href, price }: Props) {
  return (
    <Card
      component={RouteLink}
      href={href}
      sx={{ maxWidth: 345, minWidth: 25, textDecoration: "none" }}
    >
      <CardActionArea>
        <CardMedia component="img" height="140" image={url} />
        <CardContent>
          <Typography
            gutterBottom
            variant="caption"
            align="center"
            component="div"
            fontWeight={"bold"}
            color="primary"
          >
            {name}
          </Typography>
          <Typography
            gutterBottom
            variant="caption"
            align="center"
            component="div"
            fontWeight={"bold"}
            color="secondary"
          >
            {price + " MMK"}
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}
