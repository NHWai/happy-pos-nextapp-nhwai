// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../auth/[...nextauth]";
import prisma from "@/config/client";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getServerSession(req, res, authOptions);

  //check session
  if (session && session?.user?.email) {
    const companyName = req.body;

    if (companyName === "newOne") {
      //so create a new one
      const company = await prisma.companies.create({
        data: {
          name: `${session.user.name} company`,
          address: "Default address",
        },
      });

      await prisma.users.create({
        data: {
          name: session.user.name as string,
          email: session.user.email,
          password: "",
          companies_id: company.id,
        },
      });

      return res.status(201).json(company);
    }

    //get company_id
    const companyDB = await prisma.companies.findFirst({
      where: {
        name: companyName,
      },
    });

    if (companyDB) {
      //if company exists,check user
      const userDB = await prisma.users.findFirst({
        where: {
          AND: [{ email: session.user.email }, { companies_id: companyDB.id }],
        },
      });

      //company name and username not matched
      if (!userDB) {
        return res.status(401).end();
      }

      return res.status(200).json(companyDB);
    } else {
      res.status(401).end();
    }
  } else {
    res.status(401).end();
  }
}
