"use client";

import {
  Drawer,
  DrawerTrigger,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { Button, buttonVariants } from "@/components/ui/button";
import { AnimatePresence, motion } from "motion/react";
import SavedCard from "@/components/saved-card";
import { useQuery, Authenticated } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Skeleton } from "@/components/ui/skeleton";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Input } from "../ui/input";
import { toast } from "sonner";

type SavedDrawerProps = {
  loadByIdAction: (id: number) => void;
};

export default function SavedDrawer({
  loadByIdAction: loadById,
}: SavedDrawerProps) {
  const saves = useQuery(api.saves.get, {});
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [enteredRestoreData, setEnteredRestoreData] = useState("");
  const [importDialogOpen, setImportDialogOpen] = useState(false);

  function load(id: number) {
    loadById(id);
    setDrawerOpen(false);
  }

  return (
    <Authenticated>
      <Drawer direction="right" open={drawerOpen} onOpenChange={setDrawerOpen}>
        <DrawerTrigger className={buttonVariants({ variant: "ghost" })}>
          Saved
        </DrawerTrigger>
        <DrawerContent>
          <DrawerHeader className="flex flex-row">
            <DrawerTitle>Saved</DrawerTitle>
            <div className="grow"></div>
            <div className="flex flex-row gap-3">
              <Dialog>
                <DialogTrigger
                  className={buttonVariants({ size: "sm", variant: "ghost" })}
                >
                  Export
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Export</DialogTitle>
                    <DialogDescription>
                      Here's a comma separated list of all your saves. Do what
                      you want with it.
                    </DialogDescription>
                  </DialogHeader>
                  <Input
                    value={saves?.map((save) => save.num).join(",")}
                    readOnly
                  />
                </DialogContent>
              </Dialog>
              <Dialog
                open={importDialogOpen}
                onOpenChange={setImportDialogOpen}
              >
                <DialogTrigger
                  className={buttonVariants({ size: "sm", variant: "ghost" })}
                >
                  Import
                </DialogTrigger>
                <DialogContent>
                  <form
                    action=""
                    className="grid gap-4"
                    onSubmit={(e) => {
                      e.preventDefault();
                      setImportDialogOpen(false);
                      toast.promise(
                        new Promise((resolve) => {
                          setTimeout(() => resolve("Imported"), 2000);
                        }),
                        {
                          loading: "Importing...",
                          success: "Imported",
                          error: "Failed to import",
                        },
                      );
                    }}
                  >
                    <DialogHeader>
                      <DialogTitle>Import</DialogTitle>
                      <DialogDescription>
                        Paste a comma separated list of saves to import.
                      </DialogDescription>
                    </DialogHeader>
                    <Input
                      value={enteredRestoreData}
                      onChange={(e) => setEnteredRestoreData(e.target.value)}
                      required
                      name="data"
                    />
                    <DialogFooter>
                      <Button>Import</Button>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
          </DrawerHeader>
          <div className="p-4 flex flex-col gap-3 overflow-y-auto grow">
            <AnimatePresence>
              {saves?.length === 0 && (
                <motion.div
                  className="text-center text-sm text-muted-foreground"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  layout
                >
                  No saved comics yet.
                </motion.div>
              )}
              {saves &&
                saves.map((save) => (
                  <SavedCard
                    loadByIdAction={load}
                    comic={save}
                    key={save.num}
                  />
                ))}
            </AnimatePresence>
          </div>
        </DrawerContent>
      </Drawer>
    </Authenticated>
  );
}
