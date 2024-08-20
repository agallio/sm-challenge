import type { NextApiRequest, NextApiResponse } from "next";
import fs from "fs/promises";

import { rootDir } from "@/utils/json-utils";

export default async function getIssues(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    res.status(405).json({ error: "Method Not Allowed" });
    return;
  }

  try {
    const rawIssues = await fs.readFile(`${rootDir}/issues.json`, "utf-8");

    // Check if the `issues.json` is empty.
    // If true, just return an empty array.
    if (rawIssues === "") {
      res.json({ data: [], error: null });
    }

    // If false, return the actual issues.
    const issues = JSON.parse(rawIssues);
    res.json({ data: issues, error: null });
  } catch (e) {
    console.log(e);

    if (e instanceof Error) {
      res.status(500).json({ data: null, error: e.message });
      return;
    }

    res.status(500).json({ data: null, error: "Internal Server Error" });
  }
}
