import Button from "@mui/material/Button/Button";
import React from "react";

interface Props {
  editBtnDisabled: boolean;
}

export default function EditBtn({ editBtnDisabled }: Props) {
  return (
    <Button
      color="secondary"
      disabled={editBtnDisabled}
      variant="contained"
      type="submit"
      size="small"
    >
      Edit
    </Button>
  );
}
