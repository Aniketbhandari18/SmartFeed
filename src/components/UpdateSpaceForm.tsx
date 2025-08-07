"use client";

import { createSpace } from "@/actions/spaceActions/createSpace";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { ReactNode, useState } from "react";
import SpaceForm from "./SpaceForm";
import { Space } from "@prisma/client";
import { updateSpace } from "@/actions/spaceActions/updateSpace";

type props = {
  children: ReactNode;
  space: Space;
};

export default function UpdateSpaceForm({ children, space }: props) {
  const [open, setOpen] = useState<boolean>(false);

  return (
    <Dialog open={open} onOpenChange={() => setOpen(!open)}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Space</DialogTitle>
        </DialogHeader>
        <DialogDescription>Update your space’s details here</DialogDescription>
        <SpaceForm
          defaultValues={space}
          onSubmit={(values) => updateSpace(space.id, values)}
          onSuccess={() => setOpen(false)}
        />
      </DialogContent>
    </Dialog>
  );
}
