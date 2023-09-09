import { Typography } from "@mui/material";
import React from "react";

interface Props {
  content: string;
}

export default function UsrManualList({ content }: Props) {
  return (
    <li style={{ marginBottom: "1rem" }}>
      <Typography variant="subtitle1" color="secondary.dark">
        {content}
      </Typography>
    </li>
  );
}
