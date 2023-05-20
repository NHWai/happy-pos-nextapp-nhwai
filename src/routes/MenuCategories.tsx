import React from "react";
import { Chip, Typography } from "@mui/material";
import { config } from "../config/config";
import Link from "next/link";
import { MenuCategory } from "../typing/types";
import { RouteLayout } from "../components/RouteLayout";

export const MenuCategories = () => {
  const [menuCategoriesList, setMenuCategoriesList] = React.useState<
    MenuCategory[]
  >([]);

  React.useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    const url = `${config.baseurl}/menu-categories`;
    const myHeaders = new Headers();
    const jwttoken = localStorage.getItem("token");
    jwttoken && myHeaders.append("Authorization", `Bearer ${jwttoken}`);
    try {
      const response = await fetch(url, {
        method: "GET",
        headers: myHeaders,
      });
      if (response.ok) {
        const data = await response.json();
        setMenuCategoriesList(data.rows);
      } else {
        const data = await response.json();
        throw new Error(data.message);
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <RouteLayout>
      <Typography mt={3} mb={2} variant="h4">
        MenuCategories
      </Typography>
      <div>
        {menuCategoriesList?.map((item) => (
          <Link key={item.name} href={`/menus/${item.id}`}>
            <Chip label={item.name} style={{ cursor: "pointer" }} />
          </Link>
        ))}
      </div>
    </RouteLayout>
  );
};
