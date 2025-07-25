"use client";

import { useMediaQuery } from "usehooks-ts";
import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Bookmark,
  ChevronLeft,
  ChevronRight,
  Dice5,
  Download,
  EllipsisVertical,
  Search,
  Share,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
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
    <div className="flex gap-2 p-3 md:w-fit w-full border rounded-md">
      <Badge>#3119</Badge>
      <div className="grow"></div>
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
      <MoreButton
        title="Flettner Rotor"
        description='"And in maritime news, the Coast Guard is on the scene today after an apparent collision between two lighthouses."'
      />
    </div>
  );
}

function MoreButton({
  title = "More",
  description = "",
}: {
  title?: string;
  description?: string;
}) {
  const [open, setOpen] = useState(false);
  const isDesktop = useMediaQuery("(min-width: 768px)");
  return (
    <>
      <Button size="icon" variant="ghost" onClick={() => setOpen(!open)}>
        <EllipsisVertical />
      </Button>

      {isDesktop ? (
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{title}</DialogTitle>
              <DialogDescription>{description}</DialogDescription>
            </DialogHeader>

            <div className="grid grid-cols-2 gap-3">
              <Button variant="ghost">
                <Share />
                Share
              </Button>
              <Button variant="ghost">
                <Download />
                Download
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      ) : (
        <Drawer open={open} onOpenChange={setOpen}>
          <DrawerContent>
            <DrawerHeader>
              <DrawerTitle className="text-left">{title}</DrawerTitle>
              <DrawerDescription className="text-left">
                {description}
              </DrawerDescription>
            </DrawerHeader>
            <DrawerFooter className="grid grid-cols-2 gap-3">
              <Button variant="ghost">
                <Share />
                Share
              </Button>
              <Button variant="ghost">
                <Download />
                Download
              </Button>
            </DrawerFooter>
          </DrawerContent>
        </Drawer>
      )}
    </>
  );
}
