import BackOfficeContext from "@/contexts/BackofficeContext";
import { ModalClose, ModalDialog, ModalOverflow } from "@mui/joy";
import Modal from "@mui/joy/Modal";
import { Button, Stack, Typography } from "@mui/material";
import React, { useContext } from "react";

interface Props {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  handleDelete: () => void;
  heading: string;
}

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
        <ModalOverflow>
          <ModalDialog layout="center" size="lg">
            <ModalClose />
            <Typography
              my={2}
              align="center"
              variant="caption"
              sx={{ maxWidth: 300 }}
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
          </ModalDialog>
        </ModalOverflow>
      </Modal>
    </div>
  );
};

export default ConfirmationBox;
