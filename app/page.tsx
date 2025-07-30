"use client";

import { Button } from "@/components/ui/button";
import { LoaderCircle, Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";
import { AuthLoading, useAction } from "convex/react";
import { api } from "@/convex/_generated/api";
import { toast } from "sonner";
import { useTheme } from "next-themes";
import { useHotkeys } from "react-hotkeys-hook";
import { Skeleton } from "@/components/ui/skeleton";
import ActionsBar from "@/components/actions-bar";
import SavedDrawer from "@/components/saved-drawer";
import AccountDrawer from "@/components/account-drawer";
import { useAuthActions } from "@convex-dev/auth/react";
import clsx from "clsx";

export default function Home() {
  const [img, setImg] = useState("");
  const [title, setTitle] = useState("");
  const [alt, setAlt] = useState("");
  const [num, setNum] = useState(0);
  const [max, setMax] = useState(0);
  const [loading, setLoading] = useState(true);
  const [cached, setCached] = useState(false);

  const getById = useAction(api.xkcd.getById);
  const getLatest = useAction(api.xkcd.getLatest);
  const { theme, setTheme } = useTheme();

  function loadById(id: number) {
    let previousNum = num;
    let previousImg = img;

    setNum(id);
    setLoading(true);
    setCached(true);

    getById({ id })
      .then((data) => {
        setTitle(data.comic.title);
        setImg(data.comic.img);
        setAlt(data.comic.alt);
        setCached(data.cached);
        if (data.comic.img == previousImg) {
          setLoading(false);
        }
      })
      .catch(() => {
        setLoading(false);
        setNum(previousNum);
        toast.error("Something went wrong");
      });
  }

  function viewLatest() {
    setLoading(true);
    getLatest({}).then((data) => {
      setNum(data.comic.num);
      setTitle(data.comic.title);
      setImg(data.comic.img);
      setAlt(data.comic.alt);
      setMax(data.comic.num);
      setCached(data.cached);
      setLoading(false);
    });
  }

  useEffect(() => {
    viewLatest();
  }, []);

  const left = () => {
    if (num !== 0) loadById(num - 1);
  };
  const right = () => {
    if (num !== max) loadById(num + 1);
  };

  useHotkeys("ArrowRight", () => {
    right();
  });
  useHotkeys("ArrowLeft", () => {
    left();
  });
  useHotkeys("l", () => {
    right();
  });
  useHotkeys("h", () => {
    left();
  });

  return (
    <div className="h-screen w-screen flex flex-col items-center">
      <div className="flex flex-row container m-auto gap-1 justify-center items-center p-3">
        xkcd-webapp
        <div className="grow"></div>
        <AuthLoading>
          <Skeleton className="h-[20px] w-[75px] rounded-full" />
        </AuthLoading>
        <SavedDrawer loadByIdAction={loadById} />
        <AccountDrawer />
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

      <div className="flex flex-col overflow-x-auto grow mt-3 p-3">
        {loading && <LoaderCircle className="animate-spin my-auto" />}

        {img && (
          <img
            className={clsx(loading && "hidden", "dark:invert my-auto")}
            onLoad={() => {
              setLoading(false);
            }}
            src={img}
            alt={alt}
          />
        )}
      </div>
      <ActionsBar
        title={title}
        alt={alt}
        num={num}
        max={max}
        setNumAction={setNum}
        loadByIdAction={loadById}
        viewLatestAction={viewLatest}
        loading={loading}
        img={img}
        cached={cached}
      />
    </div>
  );
}
