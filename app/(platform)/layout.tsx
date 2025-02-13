import ModalProvider from "@/components/providers/modalProvider";
import QueryProvider from "@/components/providers/queryProvider";
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "sonner";

function PlatformLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider afterSignOutUrl="/">
      <QueryProvider>
        <Toaster />
        <ModalProvider />
        {children}
      </QueryProvider>
    </ClerkProvider>
  );
}

export default PlatformLayout;
