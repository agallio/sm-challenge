import type { NextApiRequest, NextApiResponse } from "next";
import fs from "fs/promises";

import { rootDir, type IssueData } from "@/utils/json-utils";

export default async function updateIssue(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "PUT") {
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

    if (!parsedBody.id || !parsedBody.title || !parsedBody.description) {
      res.status(400).json({ data: null, error: "Bad Request" });
      return;
    }

    // Check if there's any data inside `issues.json`
    const rawIssues = await fs.readFile(`${rootDir}/issues.json`, "utf-8");

    // If there's no data. Just add the data (like an upsert operation).
    if (rawIssues === "") {
      await fs.writeFile(
        `${rootDir}/issues.json`,
        JSON.stringify([parsedBody], null, 2)
      );

      res.json({
        data: { message: "Data Updated!", payload: parsedBody },
        error: null,
      });
      return;
    }

    // If the data exists, update the data.
    const issues = JSON.parse(rawIssues) as IssueData[];

    const isIssueExist = issues.find((i) => i.id === parsedBody.id);
    if (isIssueExist) {
      const updatedIssues = issues.map((i) => {
        if (i.id === parsedBody.id) {
          return parsedBody;
        }

        return i;
      });

      await fs.writeFile(
        `${rootDir}/issues.json`,
        JSON.stringify(updatedIssues, null, 2)
      );

      res.json({
        data: { message: "Data Updated!", payload: parsedBody },
        error: null,
      });
      return;
    }

    // If data is not exist, just add the data (like an upsert operation).
    await fs.writeFile(
      `${rootDir}/issues.json`,
      JSON.stringify([...issues, parsedBody], null, 2)
    );

    res.json({
      data: { message: "Data Updated!", payload: parsedBody },
      error: null,
    });
  } catch (e) {
    console.log(e);

    if (e instanceof Error) {
      res.status(500).json({ data: null, error: e.message });
      return;
    }

    res.status(500).json({ data: null, error: "Internal Server Error" });
  }
}
