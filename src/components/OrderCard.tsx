import * as React from "react";
import { Box, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import EditIcon from "@mui/icons-material/Edit";

interface Props {
  children: React.ReactNode;
  handleDelete: () => void;
  handleEdit: () => void;
  buttonDisabled?: boolean;
}

export default function OrderCard({
  children,
  handleDelete,
  handleEdit,
  buttonDisabled,
}: Props) {
  return (
    <Box
      sx={{
        marginBottom: "1rem",
        padding: "0.3rem 1rem 1rem",
        borderRadius: "10px",
        boxShadow: "1px 2px 5px 0px rgba(0,0,0,0.45)",
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: "0.3rem",
        }}
      >
        <IconButton
          disabled={buttonDisabled}
          onClick={handleEdit}
          color="primary"
          size="small"
        >
          <EditIcon />
        </IconButton>
        <IconButton
          disabled={buttonDisabled}
          onClick={handleDelete}
          color="error"
          size="small"
        >
          <CloseIcon />
        </IconButton>
      </Box>
      {children}
    </Box>
  );
}
