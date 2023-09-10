import Button from "@mui/material/Button";
import React from "react";

interface Props {
  createBtnDisabled: boolean;
}

export default function CreateBtn({ createBtnDisabled }: Props) {
  return (
    <Button
      disabled={createBtnDisabled}
      variant="contained"
      type="submit"
      sx={{ alignSelf: "end" }}
      size="small"
    >
      Create
    </Button>
  );
}
