import { auth } from "@clerk/nextjs/server";
import OrgControl from "./_components/org-control";
import { startCase } from "lodash";

export async function generateMetadata() {
  const { orgSlug } = auth();
  return {
    title: startCase(orgSlug || "organization"),
  };
}

function OrganizationIdLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex gap-x-7">
      <OrgControl />
      {children}
    </div>
  );
}

export default OrganizationIdLayout;
