import Link from "next/link";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Book,
  Bookmark,
  ChevronLeft,
  ChevronRight,
  Dice5,
  Download,
  EllipsisVertical,
  Share,
} from "lucide-react";

export default function Home() {
  return (
    <div className="h-screen w-screen flex flex-col">
      <div className="flex flex-row container m-auto p-3 gap-3">
        <Link href="/">xkcd-webapp</Link>
        <div className="grow"></div>
        <Link href="/saved">Saved</Link>
      </div>
      <div className="flex w-full h-full justify-center items-center">
        <div className="flex flex-col gap-3 max-w-[95%] max-h-[95%]">
          <img src="https://imgs.xkcd.com/comics/flettner_rotor.png" alt="" />
          <div className="flex gap-2 w-full">
            <Button size="icon" variant="ghost">
              <ChevronLeft />
            </Button>
            <Button size="icon" variant="ghost">
              <ChevronRight />
            </Button>
            <Button size="icon" variant="ghost">
              <Dice5 />
            </Button>
            <div className="grow"></div>
            <Button size="icon" variant="ghost">
              <Bookmark />
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger
                className={buttonVariants({ size: "icon", variant: "ghost" })}
              >
                <EllipsisVertical />
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem>
                  <Share />
                  Share
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Download />
                  Download
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Book />
                  Explain
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </div>
  );
}
