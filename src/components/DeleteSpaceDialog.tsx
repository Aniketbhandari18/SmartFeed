"use client";

import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { ReactNode, useState, useTransition } from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { deleteSpace } from "@/actions/spaceActions/deleteSpace";
import toast from "react-hot-toast";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

type props = {
  id: string;
  slug: string;
  children: ReactNode;
};

export default function DeleteSpaceDialog({ id, slug, children }: props) {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [typedSlug, setTypedSlug] = useState("");
  const router = useRouter();

  const handleDelete = () => {
    startTransition(async () => {
      const result = await deleteSpace(id);

      if (result.success) {
        toast.success("Space deleted successfully");
        setOpen(false);
        router.replace("/dashboard");
      } else {
        toast.error(result.message);
      }
    });
  };

  const onOpenChange = () => {
    if (open) setTypedSlug("");
    setOpen(!open);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <form>
        <DialogTrigger asChild>{children}</DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Delete this space</DialogTitle>
            <DialogDescription>
              Once deleted, all feedbacks in this space will be gone forever.
              Please be certain!
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-3">
            <Label htmlFor="name">
              Type your space id <span className="text-red-600">{slug}</span> to
              confirm
            </Label>
            <Input
              className="-mt-1"
              id="name-1"
              name="name"
              placeholder={slug}
              value={typedSlug}
              onChange={(e) => setTypedSlug(e.target.value)}
            />
          </div>

          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline" disabled={isPending}>
                Cancel
              </Button>
            </DialogClose>
            <Button
              type="button"
              className="bg-red-700 hover:bg-red-800"
              onClick={handleDelete}
              disabled={isPending || typedSlug !== slug}
            >
              {isPending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Deleting...
                </>
              ) : (
                "Delete Space"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  );
}
