import OrgControl from "./_components/org-control";

function OrganizationIdLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex gap-x-7">
      <OrgControl />
      {children}
    </div>
  );
}

export default OrganizationIdLayout;
