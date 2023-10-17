import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/config/client";
import { table } from "console";

interface OrderLineTypeBackend {
  menuId: number;
  price: number;
  qty: number;
  addonIdArr: number[];
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const method = req.method;

  if (method === "GET") {
    //getorderIds
    const orderIds = req.query.orderids as string;
    const orderIdArray = orderIds.split(",").map((item) => Number(item));
    console.log(orderIdArray);
    if (orderIdArray.length === 0) {
      return res.send(400);
    }

    const orders = await prisma.orders.findMany({
      where: {
        id: { in: orderIdArray },
      },
      select: {
        id: true,
        order_status: true,
      },
    });
    console.log(orders);

    return res.status(200).json(orders);
  }

  if (method === "POST") {
    try {
      const reqBody: {
        orderlinesArr: OrderLineTypeBackend[];
        locationId: number;
        tableId: number;
      } = JSON.parse(req.body);

      const ordersArr = reqBody.orderlinesArr.map((order) => ({
        locations_id: reqBody.locationId,
        tables_id: reqBody.tableId,
        price: order.price,
      }));

      //create orders
      const orders = await prisma.$transaction(
        ordersArr.map((order) =>
          prisma.orders.create({
            data: order,
            select: { id: true, order_status: true },
          })
        )
      );

      const orderlinesArr = reqBody.orderlinesArr
        .map((orderline, idx) => {
          if (orderline.addonIdArr.length === 0) {
            return {
              orders_id: orders[idx].id,
              menus_id: orderline.menuId,
              quantity: orderline.qty,
            };
          } else {
            return orderline.addonIdArr.map((addonId) => ({
              orders_id: orders[idx].id,
              menus_id: orderline.menuId,
              addons_id: addonId,
              quantity: orderline.qty,
            }));
          }
        })
        .flat();

      const orderlines = await prisma.orderlines.createMany({
        data: orderlinesArr,
      });

      return res.status(201).json(orders);
    } catch (error) {
      return res.status(500).end();
    }
  }
}
