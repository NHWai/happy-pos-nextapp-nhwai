import Button from "@mui/material/Button";
import React from "react";

interface Props {
  delBtnClick: () => void;
}

export default function DelBtn({ delBtnClick }: Props) {
  return (
    <Button
      color="error"
      variant="contained"
      onClick={delBtnClick}
      size="small"
    >
      Delete
    </Button>
  );
}
