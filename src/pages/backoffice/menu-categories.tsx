import React from "react";
import { Chip, IconButton, Typography } from "@mui/material";
import { config } from "@/config/config";
import Link from "next/link";
import { MenuCategory } from "../../typing/types";
import { RouteLayout } from "../../components/RouteLayout";
import PageLayout from "@/components/PageLayout";
import { useRouter } from "next/router";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";

const MenuCategories = () => {
  const [menuCategoriesList, setMenuCategoriesList] = React.useState<
    MenuCategory[]
  >([]);

  const router = useRouter();

  React.useEffect(() => {
    router.query.location && getData();
  }, [router.query.location]);

  const getData = async () => {
    const url = `${config.baseurl}/backoffice/menu-categories${
      router.query.location ? "?location=" + router.query.location : ""
    }`;

    try {
      const response = await fetch(url);
      if (response.ok) {
        const data = await response.json();
        setMenuCategoriesList(data);
      } else {
        const data = await response.json();
        throw new Error(data.message);
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <PageLayout>
      <RouteLayout>
        <Typography mt={3} mb={2} variant="h4">
          MenuCategories
        </Typography>
        <div>
          <IconButton>
            <AddCircleOutlineIcon />
          </IconButton>
          {menuCategoriesList.length > 0 ? (
            menuCategoriesList?.map((item) => (
              // <Link key={item.name} href={`/menus/${item.id}`}>
              <Chip
                key={item.name}
                label={item.name}
                style={{ cursor: "pointer" }}
              />
              /* </Link> */
            ))
          ) : (
            <div>Loading</div>
          )}
        </div>
      </RouteLayout>
    </PageLayout>
  );
};

export default MenuCategories;
