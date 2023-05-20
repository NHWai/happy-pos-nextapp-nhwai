import { Pool } from "pg";

const pool = new Pool({
  user: process.env.DB_USER as string,
  host: process.env.DB_HOST as string,
  database: process.env.DB_NAME as string,
  password: process.env.DB_PASSWORD as string,
  port: 5432,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
  ssl: {
    // Set the SSL options
    rejectUnauthorized: false, // Change to true if your SSL certificate is valid and authorized
  },
});

export const db = {
  query: (text: string, params: any[]) => pool.query(text, params),
};
