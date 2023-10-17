import OrderLayout from "@/components/OrderLayout";
import { Box, Button, Typography } from "@mui/material";
import Image from "next/image";
import RouterLink from "next/link";
import { useRouter } from "next/router";
import mypic from "../../assets/logo-no-background.png";
import { RevealList } from "next-reveal";
import { GetServerSideProps, GetServerSidePropsContext } from "next";
import {
  fetchOrderMenuCategories,
  OrderMenuCategoryItemType,
} from "@/config/orderDataFetching";

const style = {
  width: "100%",
  maxWidth: 360,
  textAlign: "center",
  marginTop: "2rem",
};

type ServerSideProps = {
  data: OrderMenuCategoryItemType[];
};

const OrderApp = ({ data }: ServerSideProps) => {
  const { query } = useRouter();
  const { locationId, tableId } = query;

  return (
    <OrderLayout height={`calc(100vh - 64px)`}>
      <Box
        sx={{
          width: "90%",
          maxWidth: "300px",
          marginX: "auto",
          display: "flex",
          flexDirection: "column",
          marginTop: "1rem",
          alignItems: "center",
        }}
      >
        <Image src={mypic} alt="Picture of the author" width={80} height={80} />
        <Typography
          variant="h4"
          align="center"
          color="secondary"
          marginTop={"1rem"}
        >
          Make Your Orders Here!!
        </Typography>

        <Box sx={style}>
          <RevealList
            interval={300}
            origin="bottom"
            delay={100}
            duration={1000}
            className="menuCategories"
          >
            {data.map((el) => (
              <div key={el.name}>
                <Button
                  component={RouterLink}
                  href={`/order/menus/?locationId=${locationId}&menuCategoryId=${el.id}`}
                  color="info"
                  size="medium"
                  variant="contained"
                  sx={{ width: "200px", color: "primary.main" }}
                >
                  {el.name}
                </Button>
              </div>
            ))}
          </RevealList>
        </Box>
      </Box>
    </OrderLayout>
  );
};

export const getServerSideProps: GetServerSideProps<ServerSideProps> = async (
  context: GetServerSidePropsContext
) => {
  try {
    const locationId = context.query.locationId as string;
    // Fetch data based on the context (request parameters)
    const data = await fetchOrderMenuCategories(locationId);
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
export default OrderApp;
