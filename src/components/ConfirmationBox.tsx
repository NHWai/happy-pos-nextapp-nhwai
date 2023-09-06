import BackOfficeContext from "@/contexts/BackofficeContext";
import { Box, Button, Stack, Typography } from "@mui/material";
import React, { useContext } from "react";

import CancelPresentationIcon from "@mui/icons-material/CancelPresentation";
import Modal from "@mui/material/Modal";

interface Props {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  handleDelete: () => void;
  heading: string;
}

const style = {
  backgroundColor: "white",
  padding: "1.5rem",
  borderRadius: "1rem",
  minWidth: "200px",
  maxWidth: "800px",
  display: "flex",
  flexDirection: "column",
};

const ConfirmationBox = ({ open, setOpen, heading, handleDelete }: Props) => {
  const { app } = useContext(BackOfficeContext);
  return (
    <div>
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Box sx={style}>
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
          <Typography
            my={2}
            align="center"
            variant="body1"
            sx={{ maxWidth: "700px" }}
          >
            {heading}
          </Typography>
          <Stack direction={"row"} justifyContent={"flex-end"} gap={1}>
            <Button
              disabled={app.status === "loading"}
              onClick={handleDelete}
              size="small"
              variant="outlined"
              color="error"
            >
              Delete
            </Button>
            <Button
              disabled={app.status === "loading"}
              onClick={() => setOpen(false)}
              size="small"
              variant="outlined"
            >
              Cancel
            </Button>
          </Stack>
        </Box>
      </Modal>
    </div>
  );
};

export default ConfirmationBox;
