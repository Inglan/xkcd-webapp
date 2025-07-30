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

  return (
    <div className="flex gap-2 p-3 md:w-fit w-full border-t md:border md:rounded-md fixed bottom-0 md:bottom-3 bg-background">
      {!cached && (
        <Popover>
          <PopoverTrigger className={badgeVariants()}>
            <Plus />
          </PopoverTrigger>
          <PopoverContent align="start">
            You are the first person to see this comic!
            <br />
            It has been added to the database to make future loads faster for
            everyone.
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
      <div className="grow md:hidden"></div>
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
          disabled={loading}
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
  );
}
