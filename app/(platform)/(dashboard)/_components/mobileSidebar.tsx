"use client";

import { useMobileSidebar } from "@/app/hooks/useMobileSidebar";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import Sidebar from "./sidebar";

export function MobileSidebar() {
  const pathname = usePathname();
  const [isMounted, setIsMounted] = useState(false);

  const onOpen = useMobileSidebar((state) => state.onOpen);
  const onClose = useMobileSidebar((state) => state.onClose);
  const isOpen = useMobileSidebar((state) => state.isOpen);

  // useEffect to avoid hydration errors
  useEffect(() => {
    setIsMounted(true);
  }, []);
  // instead of manually closing mobile sb, close it when url changes, when user clicks navItem
  useEffect(() => {
    onClose();
  }, [pathname, onClose]);

  if (!isMounted) {
    return null;
  }

  return (
    <>
      <Button
        className="flex md:hidden mr-2"
        onClick={onOpen}
        variant="ghost"
        size="sm"
      >
        <Menu className="h-8 w-8" />
      </Button>
      <Sheet open={isOpen} onOpenChange={onClose}>
        <SheetContent side="left" className="bg-white p-2 pt-10">
          <Sidebar storageKey="t-sidebar-mobile" />
        </SheetContent>
      </Sheet>
    </>
  );
}
