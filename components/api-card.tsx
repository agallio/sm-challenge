import { useMutation } from "@tanstack/react-query";
import clsx from "clsx";
import { nanoid } from "nanoid";
import { useMemo, useState } from "react";

const colors = {
  GET: {
    bg: "bg-emerald-100",
    badgeBg: "bg-emerald-300",
    hr: "border-emerald-400",
  },
  POST: {
    bg: "bg-blue-100",
    badgeBg: "bg-blue-300",
    hr: "border-blue-400",
  },
  PUT: {
    bg: "bg-yellow-100",
    badgeBg: "bg-yellow-300",
    hr: "border-yellow-400",
  },
  DELETE: {
    bg: "bg-red-100",
    badgeBg: "bg-red-300",
    hr: "border-red-400",
  },
};

export type MethodType = "GET" | "POST" | "PUT" | "DELETE";

const dummyPostData = JSON.stringify(
  { id: nanoid(), title: "Hello", description: "World" },
  null,
  2
);

const dummyPutData = JSON.stringify(
  { title: "Change Me", description: "Change Me" },
  null,
  2
);

export default function APICard({
  path,
  description,
  method,
}: {
  path: string;
  description: string;
  method: MethodType;
}) {
  const [issueId, setIssueId] = useState("");
  const [requestBody, setRequestBody] = useState(
    method === "POST" || method === "PUT" ? "{}" : undefined
  );

  const formattedPath = ["PUT", "DELETE"].includes(method)
    ? path.replace(":issueId", issueId)
    : path;
  const { mutate, isPending, data, error } = useAPI({
    path: formattedPath,
    method,
    requestBody,
  });

  const buttonDisabled = useMemo(() => {
    if (method === "PUT" || method === "DELETE") {
      return issueId.length === 0 || isPending;
    }

    return isPending;
  }, [method, isPending, issueId]);

  return (
    <div className={clsx("p-3 rounded", colors[method].bg)}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className={clsx("px-2 py-1 rounded", colors[method].badgeBg)}>
            <p className="font-bold">{method}</p>
          </div>

          <p className="font-medium">{path}</p>
        </div>

        <button
          className="bg-white rounded px-2 py-1 border hover:bg-neutral-100 disabled:opacity-50"
          disabled={buttonDisabled}
          onClick={() => mutate()}
        >
          {isPending ? "Sending..." : "Send"}
        </button>
      </div>

      <hr className={clsx("my-3", colors[method].hr)} />

      <div className="flex flex-col gap-3">
        {description ? (
          <div className="flex flex-col gap-1">
            <p className="font-medium">Description:</p>
            <p>{description}</p>
          </div>
        ) : null}

        {["PUT", "DELETE"].includes(method) ? (
          <div className="flex flex-col gap-1">
            <p className="font-medium">Issue ID:</p>
            <input
              type="text"
              value={issueId}
              placeholder="Add your issue ID here..."
              className="text-sm font-mono p-2 rounded bg-neutral-800 text-white"
              onChange={(e) => setIssueId(e.target.value)}
            />
          </div>
        ) : null}

        {requestBody ? (
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <p className="font-medium">Request Body (JSON):</p>
              <button
                className="px-2 py-1 text-sm bg-white rounded border"
                onClick={() =>
                  setRequestBody(
                    method === "POST" ? dummyPostData : dummyPutData
                  )
                }
              >
                Generate Dummy
              </button>
            </div>

            <textarea
              rows={5}
              value={requestBody}
              onChange={(e) => setRequestBody(e.target.value)}
              placeholder="Add your custom JSON body here..."
              className="font-mono h-auto p-2 text-sm bg-neutral-800 text-white rounded"
            />
          </div>
        ) : null}

        <div className="flex flex-col gap-1.5">
          <p className="font-medium">Result:</p>

          <div className="rounded bg-neutral-800 p-2 text-white">
            <pre className="text-sm">
              {data?.data
                ? JSON.stringify(data.data, null, 2)
                : error
                ? JSON.stringify(error, null, 2)
                : `No data. Click 'Send' button to execute the request.`}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}

function useAPI({
  path,
  method,
  requestBody,
}: {
  path: string;
  method: MethodType;
  requestBody?: string;
}) {
  const mutation = useMutation({
    mutationFn: async () => {
      const requestOptions = requestBody
        ? { method, body: requestBody }
        : { method };

      const res = await fetch(path, requestOptions);
      const json = await res.json();

      if (!res.ok) throw json;

      return json;
    },
  });

  return mutation;
}
