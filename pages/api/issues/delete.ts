import type { NextApiRequest, NextApiResponse } from "next";
import fs from "fs/promises";

import { rootDir, type IssueData } from "@/utils/json-utils";

export default async function getIssues(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "DELETE") {
    res.status(405).json({ error: "Method Not Allowed" });
    return;
  }

  try {
    // Validate the inputs.
    const body = req.body;

    if (!body) {
      res.status(400).json({ data: null, error: "Bad Request" });
      return;
    }

    const parsedBody = typeof body === "string" ? JSON.parse(body) : body;

    if (!parsedBody.id) {
      res.status(400).json({ data: null, error: "Bad Request" });
      return;
    }

    // Check if there's any data inside `issues.json`
    const rawIssues = await fs.readFile(`${rootDir}/issues.json`, "utf-8");

    // If there's no data, return no data.
    if (rawIssues === "") {
      res.json({ data: null, error: "No data available" });
      return;
    }

    // If the data exists, delete the data.
    const issues = JSON.parse(rawIssues) as IssueData[];

    const isIssueExist = issues.find((i) => i.id === parsedBody.id);
    if (isIssueExist) {
      const filteredIssues = issues.filter((i) => i.id !== parsedBody.id);

      await fs.writeFile(
        `${rootDir}/issues.json`,
        JSON.stringify(filteredIssues, null, 2)
      );

      res.json({
        data: { message: "Data Deleted!", payload: parsedBody },
        error: null,
      });
    }
  } catch (e) {
    console.log(e);

    if (e instanceof Error) {
      res.status(500).json({ data: null, error: e.message });
      return;
    }

    res.status(500).json({ data: null, error: "Internal Server Error" });
  }
}
