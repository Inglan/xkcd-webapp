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

type SavedDrawerProps = {
  loadByIdAction: (id: number) => void;
};

export default function SavedDrawer({
  loadByIdAction: loadById,
}: SavedDrawerProps) {
  const saves = useQuery(api.saves.get, {});

  return (
    <Authenticated>
      <Drawer direction="right">
        <DrawerTrigger className={buttonVariants({ variant: "ghost" })}>
          Saved
        </DrawerTrigger>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>Saved</DrawerTitle>
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
                    loadByIdAction={loadById}
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
