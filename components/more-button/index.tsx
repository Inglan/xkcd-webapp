"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
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
import { EllipsisVertical, Share, Download } from "lucide-react";
import { useMediaQuery } from "usehooks-ts";
import { toast } from "sonner";
import { useHotkeys } from "react-hotkeys-hook";

type MoreButtonProps = {
  title?: string;
  description?: string;
  num?: number;
  img?: string;
};

export default function MoreButton({
  title = "More",
  description = "",
  num = 0,
  img = "",
}: MoreButtonProps) {
  const [open, setOpen] = useState(false);
  const isDesktop = useMediaQuery("(min-width: 768px)");
  useHotkeys("i", () => {
    setOpen(!open);
  });
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
              <Button
                variant="ghost"
                onClick={() => {
                  if (navigator.share) {
                    toast.promise(
                      navigator.share({
                        title,
                        text: description,
                        url: "https://xkcd.com/" + num,
                      }),
                      {
                        loading: "Sharing...",
                        success: "Shared!",
                        error: "Failed to share",
                      },
                    );
                  } else {
                    toast.error("Sharing is not supported on this device");
                  }
                }}
              >
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
              <Button
                variant="ghost"
                onClick={() => {
                  if (navigator.share) {
                    toast.promise(
                      navigator.share({
                        title,
                        text: description,
                        url: "https://xkcd.com/" + num,
                      }),
                      {
                        loading: "Sharing...",
                        success: "Shared!",
                        error: "Failed to share",
                      },
                    );
                  } else {
                    toast.error("Sharing is not supported on this device");
                  }
                }}
              >
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
