"use client";

import { useEffect, useState } from "react";
import CardModal from "../modals/CardModal";

export default function ModalProvider() {
  /**
   Using useEffect to run on the client only
   Ensure that the component renders the same content server-side
   as it does during the initial client-side render to prevent a hydration mismatch.
   You can intentionally render different content on the client with the useEffect hook.
   * */
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <>
      <CardModal />
    </>
  );
}
