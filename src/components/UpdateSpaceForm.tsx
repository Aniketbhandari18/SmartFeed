"use client";

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
import { useRouter } from "next/navigation";

type props = {
  children: ReactNode;
  space: Space;
  redirectOnSlugChange?: boolean;
};

export default function UpdateSpaceForm({
  children,
  space,
  redirectOnSlugChange = false,
}: props) {
  const [open, setOpen] = useState<boolean>(false);
  const router = useRouter();

  const onSuccess = (result: {
    success: boolean;
    message: string;
    updatedSpace?: Space;
  }) => {
    setOpen(false);
    if (redirectOnSlugChange && result.updatedSpace?.slug !== space.slug) {
      router.replace(`/spaces/${result.updatedSpace?.slug}`);
    }
  };

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
          onSuccess={onSuccess}
        />
      </DialogContent>
    </Dialog>
  );
}
