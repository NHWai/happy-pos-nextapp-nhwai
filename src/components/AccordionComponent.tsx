import React from "react";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Typography,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

interface Props {
  children: React.ReactNode;
  name: string;
  isExpanded?: boolean;
}

export default function AccordionComponent({
  children,
  name,
  isExpanded,
}: Props) {
  return (
    <Accordion expanded={isExpanded}>
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        aria-controls="panel1a-content"
        id="panel1a-header"
      >
        <Typography>{name}</Typography>
      </AccordionSummary>
      <AccordionDetails>{children}</AccordionDetails>
    </Accordion>
  );
}
