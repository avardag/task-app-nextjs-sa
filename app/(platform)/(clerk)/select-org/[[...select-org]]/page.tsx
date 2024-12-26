import { OrganizationList } from "@clerk/nextjs";

function CreateOrgPage() {
  return (
    <OrganizationList
      hidePersonal
      afterSelectOrganizationUrl="/organization/:id"
      afterCreateOrganizationUrl="/organization/:id"
      // afterSelectPersonalUrl="/organization/:id"
    />
  );
}

export default CreateOrgPage;
