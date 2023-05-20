import { Box, Button, Typography } from "@mui/material";
import { useRouter } from "next/router";

export const ErrorElement = () => {
  const router = useRouter();
  const { query } = router;

  if (query.errmsg) {
    const [status, msg] = query.errmsg[0].split("-");
    return (
      <Box
        sx={{
          height: window.innerHeight - 64,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Typography variant="h3">Error: {status}</Typography>
        <Typography variant="h4" align="center">
          {msg}
        </Typography>
        <Button onClick={() => router.back()}>Go Back</Button>
      </Box>
    );
  }

  return <div>Error</div>;
};
