import OrderLayout from "@/components/OrderLayout";
import { Box, Button, Typography } from "@mui/material";
import { useRouter } from "next/router";
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";
import MenuCard from "@/components/MenuCard";
import { GetServerSideProps, GetServerSidePropsContext } from "next";
import {
  OrderMenuItemType,
  fetchOrderMenus,
  OrderMenuCategoryItemType,
} from "@/config/orderDataFetching";

type ServerSideProps = {
  data: { menus: OrderMenuItemType[]; menuCategory: OrderMenuCategoryItemType };
};

const ShowMenus = ({ data }: ServerSideProps) => {
  const router = useRouter();
  return (
    <OrderLayout height={`calc(100vh - 64px)`}>
      <Button
        sx={{ alignSelf: "flex-start" }}
        onClick={() => router.back()}
        startIcon={<KeyboardBackspaceIcon />}
      >
        Go Back
      </Button>
      <Typography sx={{ margin: "1rem 0 2rem" }} variant="h4" color="secondary">
        {data.menuCategory.name.toUpperCase()}
      </Typography>
      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          gap: 2,
          justifyContent: "space-evenly",
          paddingBottom: "1rem",
        }}
      >
        {data.menus.map((item) => (
          <MenuCard
            key={item.id}
            name={item.name}
            href={`menus/${item.id}`}
            url={item.asset_url as string}
            price={item.price}
          />
        ))}
      </Box>
    </OrderLayout>
  );
};

export const getServerSideProps: GetServerSideProps<ServerSideProps> = async (
  context: GetServerSidePropsContext
) => {
  try {
    const locationId = context.query.locationId as string;
    const menuCategoryId = context.query.menuCategoryId as string;
    const data = await fetchOrderMenus(locationId, menuCategoryId);
    return {
      props: { data },
    };
  } catch (error) {
    console.error("Error in getServerSideProps:", error);
    return {
      notFound: true, // Handle errors as not found or customize your error handling
    };
  }
};

export default ShowMenus;
