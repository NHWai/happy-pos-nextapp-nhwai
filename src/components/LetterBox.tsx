import { Box, Typography } from "@mui/material";

interface Props {
  label: string;
  value: string;
}

export default function LetterBox({ label, value }: Props) {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "baseline",
        minWidth: "240px",
        maxWidth: "300px",
      }}
    >
      <Typography
        textAlign={"end"}
        width={"45%"}
        variant="body2"
        color="secondary"
      >
        {label}
      </Typography>
      <Typography
        fontWeight="bold"
        color="secondary"
        textAlign={"center"}
        width="5%"
      >
        :
      </Typography>
      <Typography width={"50%"} fontStyle={"italic"} color="secondary">
        {value}
      </Typography>
    </Box>
  );
}
