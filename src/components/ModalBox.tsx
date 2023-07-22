import { ModalClose, ModalDialog, ModalOverflow } from "@mui/joy";
import Modal from "@mui/joy/Modal";
import { Typography } from "@mui/material";
import React from "react";

interface Props {
  children: React.ReactNode;
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  heading: string;
}

const ModalBox = ({ children, open, setOpen, heading }: Props) => {
  return (
    <>
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          overflow: "auto",
        }}
      >
        <ModalOverflow>
          <ModalDialog layout="center" size="lg">
            <ModalClose />
            <Typography my={2} align="center" variant="h5">
              {heading}
            </Typography>
            {children}
          </ModalDialog>
        </ModalOverflow>
      </Modal>
    </>
  );
};

export default ModalBox;
