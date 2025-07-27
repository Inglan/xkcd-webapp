"use client";

import { Badge } from "@/components/ui/badge";
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
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import {
  Bookmark,
  ChevronLeft,
  ChevronRight,
  Dice5,
  Download,
  EllipsisVertical,
  LoaderCircle,
  Moon,
  Search,
  Share,
  Sun,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useMediaQuery } from "usehooks-ts";
import { useAction } from "convex/react";
import { api } from "@/convex/_generated/api";
import clsx from "clsx";
import { toast } from "sonner";
import { useTheme } from "next-themes";

export default function Home() {
  const [img, setImg] = useState("");
  const [title, setTitle] = useState("");
  const [alt, setAlt] = useState("");
  const [num, setNum] = useState(0);
  const [loading, setLoading] = useState(true);

  const getById = useAction(api.xkcd.getById);
  const getLatest = useAction(api.xkcd.getLatest);
  const { theme, setTheme } = useTheme();

  function loadById(id: number) {
    let previousNum = num;
    let previousImg = img;

    setNum(id);
    setLoading(true);

    getById({ id })
      .then((data) => {
        setTitle(data.title);
        setImg(data.img);
        setAlt(data.alt);
        if (data.img == previousImg) {
          setLoading(false);
        }
      })
      .catch((error) => {
        setLoading(false);
        setNum(previousNum);
        toast.error("Something went wrong");
      });
  }

  useEffect(() => {
    getLatest({}).then((data) => {
      setNum(data.num);
      setTitle(data.title);
      setImg(data.img);
      setAlt(data.alt);
    });
  }, []);

  return (
    <div className="h-screen w-screen flex flex-col items-center p-3">
      <div className="flex flex-row container m-auto gap-3">
        <Link href="/">xkcd-webapp</Link>
        <div className="grow"></div>
        <Drawer direction="right">
          <DrawerTrigger>Saved</DrawerTrigger>
          <DrawerContent>
            <DrawerHeader>
              <DrawerTitle>Saved</DrawerTitle>
            </DrawerHeader>
          </DrawerContent>
        </Drawer>
        <Drawer direction="right">
          <DrawerTrigger>Account</DrawerTrigger>
          <DrawerContent>
            <DrawerHeader>
              <DrawerTitle>Account</DrawerTitle>
            </DrawerHeader>
          </DrawerContent>
        </Drawer>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => {
            setTheme(theme == "dark" ? "light" : "dark");
          }}
        >
          <Sun className="h-[1.2rem] w-[1.2rem] scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
          <Moon className="absolute h-[1.2rem] w-[1.2rem] scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </div>

      <div className="flex w-full h-full justify-center items-center">
        <div className="flex flex-col max-w-[95%] max-h-[95%]">
          {loading && <LoaderCircle className="animate-spin" />}

          {img && (
            <img
              className={clsx(loading && "hidden", "dark:invert")}
              onLoad={() => {
                setLoading(false);
              }}
              src={img}
              alt={alt}
            />
          )}
        </div>
      </div>
      <ActionsBar
        title={title}
        alt={alt}
        num={num}
        setNum={setNum}
        loadById={loadById}
        loading={loading}
      />
    </div>
  );
}

function ActionsBar({
  title,
  alt,
  num,
  setNum,
  loadById,
  loading,
}: {
  title: string;
  alt: string;
  num: number;
  setNum: (num: number) => void;
  loadById: (id: number) => void;
  loading: boolean;
}) {
  return (
    <div className="flex gap-2 p-3 md:w-fit w-full border-t md:border md:rounded-md fixed bottom-0 md:bottom-3 bg-background">
      <Badge>#{num}</Badge>
      <div className="grow"></div>
      <Button disabled={loading} size="icon" variant="ghost">
        <Search />
      </Button>
      <Button
        disabled={num === 1 || loading}
        size="icon"
        variant="ghost"
        onClick={() => {
          if (num - 1 > 0) {
            loadById(num - 1);
          }
        }}
      >
        <ChevronLeft />
      </Button>
      <Button
        disabled={loading}
        size="icon"
        variant="ghost"
        onClick={() => {
          if (num + 1 > 0) {
            loadById(num + 1);
          }
        }}
      >
        <ChevronRight />
      </Button>
      <Button disabled={loading} size="icon" variant="ghost">
        <Dice5 />
      </Button>
      <Button disabled={loading} size="icon" variant="ghost">
        <Bookmark />
      </Button>
      <MoreButton title={title} description={alt} />
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
