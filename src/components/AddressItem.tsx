import { Box, Typography, Stack } from "@mui/material";
import React from "react";

interface Props {
  title: string;
  children: React.ReactNode;
}

export default function AddressItem({ title, children }: Props) {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
      }}
    >
      <Box>
        <Typography variant="h6" fontWeight={"bold"} marginBottom={"0.5rem"}>
          {title}
        </Typography>
        <Stack gap="0.3rem" sx={{ maxWidth: "150px" }}>
          {children}
        </Stack>
      </Box>
    </Box>
  );
}
