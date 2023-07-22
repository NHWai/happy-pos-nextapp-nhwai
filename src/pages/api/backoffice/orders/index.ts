import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../auth/[...nextauth]";
import prisma from "@/config/client";
import { orders } from "@prisma/client";

interface OrderlinesArr {
  id: number;
  orders_id: number;
  menus_id: number;
  addons_id: number[];
  quantity: number;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getServerSession(req, res, authOptions);
  if (session && session?.user?.email) {
    const locationId = Number(req.query.locationId);
    //get Orders
    let orders: orders[];

    if (locationId) {
      orders = await prisma.orders.findMany({
        where: { locations_id: locationId },
        orderBy: {
          id: "asc",
        },
      });
    } else {
      orders = await prisma.orders.findMany({
        orderBy: {
          id: "asc",
        },
      });
    }

    const orderIdArr = orders.map((item) => item.id);

    const orderlines = await prisma.orderlines.findMany({
      where: { orders_id: { in: orderIdArr } },
      select: {
        id: true,
        orders_id: true,
        menus_id: true,
        quantity: true,
        addons_id: true,
      },
    });

    //formatting the orderlines to send to frontend
    let orderlinesArr: OrderlinesArr[] = [];
    let j = 0;

    for (let i = 0; i < orderlines.length; i++) {
      if (i === 0) {
        const currObj = JSON.parse(JSON.stringify(orderlines[i]));
        currObj.addons_id = [currObj.addons_id];
        orderlinesArr.push(currObj);
        j++;
      }

      if (i > 0) {
        if (orderlines[i - 1].orders_id !== orderlines[i].orders_id) {
          if (orderlines[i].addons_id) {
            const currObj = JSON.parse(JSON.stringify(orderlines[i]));
            currObj.addons_id = [currObj.addons_id];
            orderlinesArr.push(currObj);
          } else {
            const currObj = JSON.parse(JSON.stringify(orderlines[i]));
            currObj.addons_id = [];
            orderlinesArr.push(currObj);
          }
          j++;
        }

        if (orderlines[i - 1].orders_id === orderlines[i].orders_id) {
          const currObj = JSON.parse(JSON.stringify(orderlines[i]));
          orderlinesArr[j - 1].addons_id = [
            ...orderlinesArr[j - 1].addons_id,
            currObj.addons_id,
          ];
        }
      }
    }

    const responseOrders = orderlinesArr.map((item, idx) => ({
      ...item,
      price: orders[idx].price,
      order_status: orders[idx].order_status,
      is_paid: orders[idx].is_paid,
      tables_id: orders[idx].tables_id,
      locations_id: orders[idx].locations_id,
    }));
    //
    res.status(200).json(responseOrders);
  } else {
    res.status(500).end();
  }
}
