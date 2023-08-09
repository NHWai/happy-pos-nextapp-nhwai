// import { ModalClose, ModalDialog, ModalOverflow } from "@mui/joy";
// import Modal from "@mui/joy/Modal";
import { Box, Modal, Typography } from "@mui/material";
import React from "react";
import CancelPresentationIcon from "@mui/icons-material/CancelPresentation";

interface Props {
  children: React.ReactNode;
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  heading: string;
}

const style1 = {
  backgroundColor: "white",
  padding: "1rem",
  borderRadius: "1rem",
  width: "fit-content",
  minWidth: "240px",
  maxWidth: "800px",
  display: "flex",
  flexDirection: "column",
  maxHeight: "80vh",
  overflowY: "auto",
  scrollbarWidth: "none", // Hide scrollbar on Firefox
  "&::-webkit-scrollbar": {
    display: "none", // Hide scrollbar on Chrome, Safari, and Edge
  },
};

const ModalBox = ({ children, open, setOpen, heading }: Props) => {
  return (
    <Modal
      open={open}
      onClose={() => setOpen(false)}
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Box sx={style1}>
        <Typography
          onClick={() => setOpen(false)}
          color="error"
          sx={{
            padding: "0px !important",
            margin: "0px !important",
            display: "inline-flex",
            justifyContent: "right",
            cursor: "pointer",
          }}
        >
          <CancelPresentationIcon />
        </Typography>
        <Typography my={2} align="center" variant="h5">
          {heading}
        </Typography>
        {children}
      </Box>
    </Modal>
  );
};

export default ModalBox;
