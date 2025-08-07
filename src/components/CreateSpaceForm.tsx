"use client";

import { Button } from "./ui/button";
import { createSpace } from "@/actions/spaceActions/createSpace";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Plus } from "lucide-react";
import { useState } from "react";
import SpaceForm from "./SpaceForm";

export default function CreateSpaceForm() {
  const [open, setOpen] = useState<boolean>(false);

  return (
    <Dialog open={open} onOpenChange={() => setOpen(!open)}>
      <DialogTrigger asChild>
        <Button>
          <Plus />
          <span>Create New Space</span>
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create a New Space</DialogTitle>
        </DialogHeader>
        <DialogDescription>
          A space represents a unique project, product, or service for which you
          want to collect feedback
        </DialogDescription>
        <SpaceForm onSubmit={createSpace} onSuccess={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  );
}
