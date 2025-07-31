"use client";

import { cache, useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge, badgeVariants } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import {
  ChevronUp,
  ChevronLeft,
  ChevronRight,
  Dice5,
  LoaderCircle,
  Bookmark,
  Database,
  BadgePlus,
  Plus,
  CornerDownLeft,
  Divide,
} from "lucide-react";
import { useMutation, useQuery, Authenticated } from "convex/react";
import { api } from "@/convex/_generated/api";
import clsx from "clsx";
import { toast } from "sonner";
import MoreButton from "@/components/more-button";
import { Skeleton } from "@/components/ui/skeleton";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Input } from "../ui/input";
import { useHotkeys } from "react-hotkeys-hook";

type ActionsBarProps = {
  title: string;
  alt: string;
  num: number;
  max: number;
  setNumAction: (num: number) => void;
  loadByIdAction: (id: number) => void;
  viewLatestAction: () => void;
  loading: boolean;
  img: string;
  cached: boolean;
};

export default function ActionsBar({
  title,
  alt,
  num,
  max,
  setNumAction: setNum,
  loadByIdAction: loadById,
  viewLatestAction: viewLatest,
  loading,
  img,
  cached,
}: ActionsBarProps) {
  const saveMutation = useMutation(api.saves.toggle);
  const isSaved = useQuery(api.saves.isSaved, { num });
  const [saving, setSaving] = useState(false);
  const [inputtedNum, setInputtedNum] = useState("");
  const [inputDialogOpen, setInputDialogOpen] = useState(false);

  useHotkeys("s", () => {
    setSaving(true);
    saveMutation({ num: num }).then(() => setSaving(false));
  });
  useHotkeys("r", () => {
    loadById(Math.floor(Math.random() * max));
  });
  useHotkeys("t", () => {
    viewLatest();
  });
  useHotkeys(["1", "2", "3", "4", "5", "6", "7", "8", "9", "0"], () => {
    setInputDialogOpen(true);
  });
  useHotkeys("g", (e) => {
    setInputDialogOpen(true);
    e.preventDefault();
  });

  return (
    <div className="p-3 w-full border-t bg-background">
      <div className="grid md:grid-cols-[1fr_auto_1fr] grid-cols-[1fr_auto_auto] gap-2 max-w-xl mx-auto">
        <div className="flex flex-row gap-2 mr-auto">
          {!cached && (
            <Popover>
              <PopoverTrigger className={badgeVariants()}>
                <Plus />
              </PopoverTrigger>
              <PopoverContent align="start">
                You are the first person to see this comic!
                <br />
                It has been added to the database to make future loads faster
                for everyone.
              </PopoverContent>
            </Popover>
          )}

          <Dialog open={inputDialogOpen} onOpenChange={setInputDialogOpen}>
            <DropdownMenu>
              <DropdownMenuTrigger
                className={badgeVariants({ variant: "secondary" })}
              >
                #{num} <ChevronUp />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start">
                <DropdownMenuLabel>Go to</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={viewLatest}>Today</DropdownMenuItem>
                <DialogTrigger asChild>
                  <DropdownMenuItem>Enter number</DropdownMenuItem>
                </DialogTrigger>
              </DropdownMenuContent>
            </DropdownMenu>

            <DialogContent>
              <form
                className="grid gap-4"
                onSubmit={(e) => {
                  e.preventDefault();
                  if (inputtedNum === "") return;
                  loadById(Number(inputtedNum));
                  setInputtedNum("");
                  setInputDialogOpen(false);
                }}
              >
                <DialogHeader>
                  <DialogTitle>Go to</DialogTitle>
                </DialogHeader>
                <Input
                  required
                  type="number"
                  value={inputtedNum}
                  max={max}
                  onChange={(e) => setInputtedNum(e.target.value)}
                />
                <DialogFooter>
                  <Button>
                    Go
                    <CornerDownLeft />
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
        <div className="gap-2 flex flex-row">
          <Button
            disabled={num === 1}
            size="icon"
            variant="ghost"
            onClick={() => {
              if (num - 1 > 0) {
                loadById(num - 1);
              }
            }}
          >
            <ChevronLeft />
            <span className="sr-only">Previous</span>
          </Button>
          <Button
            disabled={num === max}
            size="icon"
            variant="ghost"
            onClick={() => {
              if (num + 1 > 0) {
                loadById(num + 1);
              }
            }}
          >
            <ChevronRight />
            <span className="sr-only">Next</span>
          </Button>
        </div>
        <div className="ml-auto flex flex-row gap-2">
          <Button
            size="icon"
            variant="ghost"
            onClick={() => {
              loadById(Math.floor(Math.random() * max));
            }}
          >
            <Dice5 />
            <span className="sr-only">Random</span>
          </Button>
          <Authenticated>
            <Button
              size="icon"
              variant="ghost"
              onClick={() => {
                if (!saving) {
                  setSaving(true);
                  saveMutation({ num: num }).then(() => setSaving(false));
                }
              }}
            >
              {saving ? (
                <LoaderCircle className="w-4 h-4 animate-spin" />
              ) : (
                <Bookmark className={clsx(isSaved && "text-red-500")} />
              )}
              <span className="sr-only">Save</span>
            </Button>
          </Authenticated>
          <MoreButton title={title} description={alt} img={img} num={num} />
        </div>
      </div>
    </div>
  );
}
