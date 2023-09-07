import { Box } from "@mui/material";
import React from "react";

interface Props {
  children: React.ReactNode;
}

export default function DropFileBox({ children }: Props) {
  return (
    <Box
      sx={{
        width: "180px",
        backgroundColor: "info.main",
        color: "secondary.main",
        padding: "1rem",
        borderRadius: "1rem",
        cursor: "pointer",
        border: " dashed #41644A",
        overflowWrap: "break-word",
      }}
    >
      {children}
    </Box>
  );
}
