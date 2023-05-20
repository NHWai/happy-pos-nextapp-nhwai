import React from "react";
import { config } from "../config/config";
import { Menu } from "../typing/types";
import Stack from "@mui/material/Stack/Stack";
import Box from "@mui/material/Box/Box";
import Chip from "@mui/material/Chip";
import Accordion from "@mui/material/Accordion/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary/AccordionSummary";
import { ExpandMore } from "@mui/icons-material";
import Typography from "@mui/material/Typography/Typography";
import AccordionDetails from "@mui/material/AccordionDetails/AccordionDetails";
import { useRouter } from "next/router";

export const MenuDetail = () => {
  interface Addon_Category {
    name: string;
    is_required?: boolean;
  }

  interface Addon {
    category: string;
    name: string;
    price: number;
    is_available: boolean;
  }

  interface MenuItem {
    menu_name: string;
    menu_price: number;
    menu_categories_names: string[];
    addon_categories: [];
    addons: Addon[];
  }

  const initialMenuItem: MenuItem = {
    menu_name: "",
    menu_price: 0,
    menu_categories_names: [],
    addon_categories: [],
    addons: [{ category: "", name: "", price: 0, is_available: true }],
  };

  const [menuItem, setMenuItem] = React.useState<MenuItem>(initialMenuItem);
  const router = useRouter();
  const { id } = router.query;
  React.useEffect(() => {
    const fetchData = async () => {
      const url = `${config.baseurl}/menus/${id}`;
      const myHeaders = new Headers();
      const jwttoken = localStorage.getItem("token");
      jwttoken && myHeaders.append("Authorization", `Bearer ${jwttoken}`);
      const res = await fetch(url, {
        method: "GET",
        headers: myHeaders,
      });
      const data = await res.json();
      console.log(data);
      setMenuItem(data);
    };
    fetchData();
  }, []);
  return (
    <Box sx={{ marginLeft: 1, marginTop: 5, paddingBottom: 2 }}>
      <Box
        sx={{
          paddingLeft: "20px",
          marginX: "auto",
          marginBottom: "30px",
          maxWidth: "300px",
          height: "150px",
          borderRadius: "10px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          gap: 3,
          boxShadow: `0 0 5px 0 rgba(0, 0, 0,0.5)
         `,
        }}
      >
        <ul style={{ paddingLeft: "20px" }}>
          <li style={{ marginBottom: "8px" }}>
            Name:
            <b>
              <i> {menuItem.menu_name} </i>
            </b>
          </li>
          <li>
            Price:
            <b>
              <i> {menuItem.menu_price} </i>
              <small>MMK</small>
            </b>
          </li>
        </ul>
        <Stack flexDirection={"row"} gap={2}>
          {menuItem.menu_categories_names.map((el) => (
            <Chip key={el} label={el} />
          ))}
        </Stack>
      </Box>
      <div
        style={{
          margin: "0 auto",
          maxWidth: "300px",
          display: "flex",
          flexDirection: "column",
          gap: 10,
        }}
      >
        {menuItem.addon_categories.map((item, index) => (
          <Accordion key={index}>
            <AccordionSummary expandIcon={<ExpandMore />}>
              <Typography variant="h6">{item}</Typography>
            </AccordionSummary>
            <AccordionDetails>
              {menuItem.addons
                .filter((el) => el.category === item && el)
                .map((el, idx) => (
                  <Stack
                    key={idx}
                    flexDirection={"row"}
                    justifyContent={"space-between"}
                  >
                    <Typography>{el.name}</Typography>
                    <b>
                      {el.price}
                      <small> MMK</small>
                    </b>
                  </Stack>
                ))}
            </AccordionDetails>
          </Accordion>
        ))}
      </div>
    </Box>
  );
};
