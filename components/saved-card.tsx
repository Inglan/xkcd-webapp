"use client";

import { motion } from "motion/react";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Button } from "./ui/button";
import { Doc } from "@/convex/_generated/dataModel";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useState } from "react";

export default function SavedCard({
  comic,
  loadByIdAction,
}: {
  comic: Doc<"comics">;
  loadByIdAction: (id: number) => void;
}) {
  const saveMutation = useMutation(api.saves.toggle);
  const [deleting, setDeleting] = useState(false);

  return (
    <motion.div
      layout
      key={comic.num}
      exit={{ opacity: 0, scale: 0.9 }}
      animate={{ scale: 1, opacity: deleting ? 0.5 : 1 }}
    >
      <Card className="pt-0 overflow-hidden">
        <img className="h-52 w-full object-cover" src={comic.img} alt="" />
        <CardHeader>
          <CardTitle>{comic.title}</CardTitle>
          <CardDescription>{comic.alt}</CardDescription>
        </CardHeader>
        <CardFooter className="gap-3">
          <Button
            className="grow"
            onClick={() => {
              loadByIdAction(comic.num);
            }}
          >
            Open
          </Button>
          <Button
            onClick={() => {
              setDeleting(true);
              saveMutation({ num: comic.num });
            }}
            variant="ghost"
          >
            Remove
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
}
