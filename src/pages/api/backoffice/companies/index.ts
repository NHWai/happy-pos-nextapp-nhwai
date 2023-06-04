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
  console.log("session", session);

  if (session && session?.user?.email) {
    //check session
    const userDB = await prisma.users.findFirst({
      where: { email: session.user.email },
    });

    console.log("userDB", userDB);

    if (userDB === null) {
      //If users is null, create a company_id & create a user and return company_id
      const company = await prisma.companies.create({
        data: {
          name: `${session.user.name} company`,
          address: "Default address",
        },
      });

      const user = await prisma.users.create({
        data: {
          name: session.user.name as string,
          email: session.user.email,
          password: "",
          companies_id: company.id,
        },
      });

      return res.status(201).json(company);
    } else {
      //get related data of user and company_id

      const company = await prisma.companies.findFirst({
        where: { id: userDB.companies_id },
      });

      res.status(200).json(company);
    }
  } else {
    res.status(401).end();
  }
}
