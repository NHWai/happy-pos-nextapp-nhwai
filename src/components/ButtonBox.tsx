import Stack from "@mui/material/Stack";
import React from "react";
import EditBtn from "./EditBtn";
import DelBtn from "./DelBtn";

interface Props {
  delBtnClick: () => void;
  editBtnDisabled: boolean;
}

export default function ButtonBox({ delBtnClick, editBtnDisabled }: Props) {
  return (
    <Stack direction="row" justifyContent={"space-between"} width="100%">
      <DelBtn delBtnClick={delBtnClick} />
      <EditBtn editBtnDisabled={editBtnDisabled} />
    </Stack>
  );
}
