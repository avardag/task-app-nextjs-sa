import { cn } from "@/lib/utils";
import localFont from "next/font/local";
import Image from "next/image";
import Link from "next/link";

const headingFont = localFont({
  src: "../app/fonts/CalSans-SemiBold.woff2",
});

export default function Logo() {
  return (
    <Link href="/">
      <div className="hover:opacity-75 transition items-center gap-x-2 hidden md:flex">
        <Image src="/music-svgrepo-com.svg" alt="Logo" height={30} width={30} />
        <p className={cn("text-lg text-neutral-700", headingFont.className)}>
          Taskapp
        </p>
      </div>
    </Link>
  );
}
