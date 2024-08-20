import clsx from "clsx";

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

export default function APICard({
  path,
  description,
  requestBody,
  method,
}: {
  path: string;
  description: string;
  requestBody?: string;
  method: MethodType;
}) {
  const result = "No Data";

  return (
    <div className={clsx("p-3 rounded", colors[method].bg)}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className={clsx("px-2 py-1 rounded", colors[method].badgeBg)}>
            <p className="font-bold">{method}</p>
          </div>

          <p className="font-medium">{path}</p>
        </div>

        <button className="bg-white rounded px-2 py-1 border hover:bg-neutral-100">
          Send
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

        {requestBody ? (
          <div className="flex flex-col gap-1">
            <p className="font-medium">Request Body (JSON):</p>
            <textarea
              rows={4}
              defaultValue={requestBody}
              placeholder="Add your custom JSON body here..."
              className="font-mono h-auto p-2 text-sm bg-neutral-800 text-white rounded"
            />
          </div>
        ) : null}

        <div className="flex flex-col gap-1.5">
          <p className="font-medium">Result:</p>

          <div className="rounded bg-neutral-800 p-2 text-white">
            <pre className="text-sm">{JSON.stringify(result, null, 2)}</pre>
          </div>
        </div>
      </div>
    </div>
  );
}
