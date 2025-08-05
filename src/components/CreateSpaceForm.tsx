"use client";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { createSpaceSchema } from "@/lib/zodSchemas/createSpaceSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { createSpace } from "@/actions/spaceActions/createSpace";
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
import { Loader2, Plus } from "lucide-react";
import { useState, useTransition } from "react";
import toast from "react-hot-toast";

export default function CreateSpaceForm() {
  const [open, setOpen] = useState<boolean>(false);
  const [isPending, startTransition] = useTransition();

  const form = useForm<z.infer<typeof createSpaceSchema>>({
    resolver: zodResolver(createSpaceSchema),
    defaultValues: {
      name: "",
      title: "",
      description: "",
      externalLink: "",
    },
  });

  const handleOpenChange = () =>{
    setOpen(!open);
    form.reset();
  }

  const onSubmit = (values: z.infer<typeof createSpaceSchema>) => {
    startTransition(async () =>{
      const res = await fetch(`/api/spaces/availability?name=${encodeURIComponent(values.name)}`, {
        method: "GET",
      })

      const { available } = await res.json();

      if (!available){
        form.setError("name", {
          message: "This space name already exists on this account"
        })
        return;
      }
      
      const result = await createSpace(values);

      if (result.success){
        toast.success("Space created successfully");
        form.reset();
        setOpen(false);
      }
      else {
        toast.error(result.message);
      }
    })
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange} >
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
          A space represents a unique project, product, or service for which you want to collect feedback
        </DialogDescription>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            {/* Space Name */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Space Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter Space Name" {...field} />
                  </FormControl>
                  <FormDescription>
                    Unique identifier used in the feedback-URL
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Space Title */}
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter Title" {...field} />
                  </FormControl>
                  <FormDescription>
                    Displayed as the header on your feedback form (e.g., SmartMeal Delivery Feedback).
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Space Description */}
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter Description"
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    A short paragraph explaining about your product/service and what kind of feedback you’re looking for.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* External Link */}
            <FormField
              control={form.control}
              name="externalLink"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>External Link</FormLabel>
                  <FormControl>
                    <Input placeholder="https://example.com" {...field} />
                  </FormControl>
                  <FormDescription>
                    URL to your product/service page. (Optional)
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline" disabled={isPending}>Cancel</Button>
              </DialogClose>
              <Button type="submit" disabled={isPending}>
                {isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Creating...
                  </>
                ): (
                  "Create Space"
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
