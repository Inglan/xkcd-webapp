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
import Link from "next/link";

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
              <Actions img={img} num={num} />
              <small>
                <Link href={`https://xkcd.com/${num}`} target="_blank">
                  View on xkcd website
                </Link>
              </small>
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
              <Actions img={img} num={num} />
              <small>
                <Link href={`https://xkcd.com/${num}`} target="_blank">
                  View on xkcd website
                </Link>
              </small>
            </DrawerFooter>
          </DrawerContent>
        </Drawer>
      )}
    </>
  );
}

function Actions({ img, num }: { img: string; num: number }) {
  return (
    <>
      <Button
        variant="ghost"
        onClick={() => {
          if (navigator.share) {
            toast.promise(
              new Promise(async (resolve, reject) => {
                if (!navigator.share) {
                  reject("Sharing not supported");
                }
                if (!navigator.canShare()) {
                  reject("Sharing not supported");
                }
                try {
                  const image = await fetch(img);
                  const blob = await image.blob();
                  const filesArray = [
                    new File(
                      [blob],
                      num + img.split(".")[img.split(".").length - 1],
                      {
                        type: image.headers.get("content-type") || "image/png",
                      },
                    ),
                  ];

                  navigator.share({
                    files: filesArray,
                  });

                  resolve("Shared");
                } catch {
                  reject("Failed to share");
                }
              }),
              {
                loading: "Sharing...",
                success: "Shared!",
                error: (error) => {
                  return error;
                },
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
      <Button
        variant="ghost"
        onClick={() =>
          toast.promise(
            new Promise(async (resolve, reject) => {
              try {
                const image = await fetch(img);
                const blob = await image.blob();
                const url = URL.createObjectURL(blob);
                const a = document.createElement("a");
                a.href = url;
                a.download = "xkcd-" + num;
                a.click();
                URL.revokeObjectURL(url);
                resolve("Downloaded");
              } catch (error) {
                reject(error);
              }
            }),
            {
              loading: "Downloading...",
              success: "Downloaded!",
              error: "Failed to download",
            },
          )
        }
      >
        <Download />
        Download
      </Button>
    </>
  );
}
