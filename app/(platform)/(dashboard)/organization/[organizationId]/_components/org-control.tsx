"use client";

import { useOrganizationList } from "@clerk/nextjs";
import { useParams } from "next/navigation";
import { useEffect } from "react";

//component to get a organization from the url and set it programmatically
function OrgControl() {
  const params = useParams();
  // console.log(params);
  const { setActive } = useOrganizationList();

  useEffect(() => {
    if (!setActive) return;

    setActive({ organization: params.organizationId as string });
  }, [setActive, params.organizationId]);

  return null;
}

export default OrgControl;
