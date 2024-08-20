import APICard, { type MethodType } from "@/components/api-card";

const allRequests = [
  {
    method: "GET",
    path: "/api/issues",
    description: "Get issues data.",
  },
  {
    method: "POST",
    path: "/api/issues/create",
    description: "Create a new issue.",
  },
  {
    method: "PUT",
    path: "/api/issues/update/:issueId",
    description: "Update an existing issue.",
  },
  {
    method: "DELETE",
    path: "/api/issues/delete/:issueId",
    description: "Delete an existing issue.",
  },
];

export default function Home() {
  return (
    <div>
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold">Swaggerish</h1>
        <p>Simple and easy-to-use API documentation tool for your API.</p>
      </div>

      <hr className="my-4" />

      <div>
        <h2 className="text-xl font-medium">Issue API</h2>
        <p className="mt-3">
          Base URL{" "}
          <span className="border px-2 py-1 rounded bg-neutral-100">
            http://localhost:3000
          </span>
        </p>

        <div className="mt-4 flex flex-col gap-4">
          {allRequests.map((request, index) => (
            <APICard
              key={index}
              method={request.method as MethodType}
              path={request.path}
              description={request.description}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
