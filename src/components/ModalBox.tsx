import CancelPresentationIcon from "@mui/icons-material/CancelPresentation";
import { Box, Modal, Typography } from "@mui/material";
import React from "react";

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
            width: "fit-content",
            padding: "0px !important",
            marginLeft: "auto",
            display: "inline-flex",
            justifyContent: "right",
            cursor: "pointer",
          }}
        >
          <CancelPresentationIcon />
        </Typography>
        <Typography my={2} align="center" color="secondary" variant="h5">
          {heading}
        </Typography>
        {children}
      </Box>
    </Modal>
  );
};

export default ModalBox;
