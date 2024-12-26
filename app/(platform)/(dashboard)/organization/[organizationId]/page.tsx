import { auth } from "@clerk/nextjs/server";

function OrganizationPage() {
  const { orgId } = auth();
  return <div>Organization {orgId}</div>;
}

export default OrganizationPage;
