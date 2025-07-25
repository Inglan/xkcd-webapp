"use client";

import { useMediaQuery } from "usehooks-ts";
import Link from "next/link";
import { useState } from "react";
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
  Info,
  Search,
  Share,
  Text,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Badge } from "@/components/ui/badge";

export default function Home() {
  return (
    <div className="h-screen w-screen flex flex-col items-center p-3">
      <div className="flex flex-row container m-auto gap-3">
        <Link href="/">xkcd-webapp</Link>
        <div className="grow"></div>
        <Link href="/saved">Saved</Link>
      </div>

      <div className="flex w-full h-full justify-center items-center">
        <div className="flex flex-col max-w-[95%] max-h-[95%]">
          <img src="https://imgs.xkcd.com/comics/flettner_rotor.png" alt="" />
        </div>
      </div>
      <ActionsBar />
    </div>
  );
}

function ActionsBar() {
  return (
    <div className="flex gap-2 p-3 w-fit border rounded-md">
      <Badge>#3119</Badge>
      <Button size="icon" variant="ghost">
        <Search />
      </Button>
      <Button size="icon" variant="ghost">
        <ChevronLeft />
      </Button>
      <Button size="icon" variant="ghost">
        <ChevronRight />
      </Button>
      <Button size="icon" variant="ghost">
        <Dice5 />
      </Button>
      <Button size="icon" variant="ghost">
        <Bookmark />
      </Button>
      <MoreButton />
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
  );
}

function MoreButton() {
  const [open, setOpen] = useState(false);
  const isDesktop = useMediaQuery("(min-width: 768px)");
  return (
    <>
      <Button size="icon" variant="ghost" onClick={() => setOpen(!open)}>
        <EllipsisVertical />
      </Button>

      {isDesktop ? (
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent>Test</DialogContent>
        </Dialog>
      ) : (
        <Drawer open={open} onOpenChange={setOpen}>
          <DrawerContent>test</DrawerContent>
        </Drawer>
      )}
    </>
  );
}
