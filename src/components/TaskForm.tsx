"use client";

import { taskFormSchema } from "@/lib/zodSchemas/taskFormSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Task, TaskCategory, Priority } from "@prisma/client";
import { ReactNode, useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

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
import { Textarea } from "./ui/textarea";
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
import { Button } from "./ui/button";
import { Loader2, Plus } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import toast from "react-hot-toast";

type Props = {
  spaceId: string;
  defaultValues?: Task;
  children?: ReactNode;
  onSubmit: (
    spaceId: string,
    values: z.infer<typeof taskFormSchema>
  ) => Promise<{ success: boolean; message: string }>;
};

export default function TaskForm({
  spaceId,
  defaultValues,
  children,
  onSubmit,
}: Props) {
  const [open, setOpen] = useState<boolean>(false);
  const [isPending, startTransition] = useTransition();

  const form = useForm<z.infer<typeof taskFormSchema>>({
    resolver: zodResolver(taskFormSchema),
    defaultValues: {
      title: defaultValues?.title || "",
      description: defaultValues?.description || "",
      priority: defaultValues?.priority || "medium",
      category: defaultValues?.category || "other",
    },
  });

  const handleSubmit = (values: z.infer<typeof taskFormSchema>) => {
    startTransition(async () => {
      const res = await onSubmit(spaceId, values);

      if (res.success) {
        toast.success(res.message);
        form.reset();
        setOpen(false);
      } else {
        toast.error(res.message);
      }
    });
  };

  const onOpenChange = () => {
    form.reset();
    setOpen(!open);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        {children ? (
          children
        ) : (
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            <span>New Task</span>
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[430px]">
        <DialogHeader>
          <DialogTitle>
            {defaultValues ? "Edit Task" : "Create a New Task"}
          </DialogTitle>
          <DialogDescription>
            {defaultValues
              ? "Update the details of your task."
              : "Fill in the details below to add a task."}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-6"
          >
            {/* Title */}
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter task title" {...field} />
                  </FormControl>
                  <FormDescription>
                    Short name that clearly describes this task.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Description */}
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter task description"
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    A few sentences with details or context for this task.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Priority */}
            <div className="flex justify-between flex-col sm:flex-row sm:gap-0 gap-5">
              <FormField
                control={form.control}
                name="priority"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Priority</FormLabel>
                    <FormControl>
                      <Select
                        defaultValue="medium"
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger className="w-[180px]">
                          <SelectValue
                            placeholder="Select priority"
                            className="font-semibold"
                          />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            <SelectLabel>Priority</SelectLabel>
                            {Object.values(Priority).map((priority) => (
                              <SelectItem
                                key={priority}
                                value={priority}
                                className="font-semibold"
                              >
                                {priority[0].toUpperCase() + priority.slice(1)}
                              </SelectItem>
                            ))}
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Category */}
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <FormControl>
                      <Select
                        defaultValue="other"
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger className="w-[180px]">
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            <SelectLabel>Category</SelectLabel>
                            {Object.values(TaskCategory).map((category) => (
                              <SelectItem
                                key={category}
                                value={category}
                                className="font-semibold"
                              >
                                {category
                                  .replace(/_/g, " ")
                                  .replace(/\b\w/g, (char) =>
                                    char.toUpperCase()
                                  )}
                              </SelectItem>
                            ))}
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline" disabled={isPending}>
                  Cancel
                </Button>
              </DialogClose>
              <Button type="submit" disabled={isPending}>
                {isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    {defaultValues ? "Updating..." : "Creating..."}
                  </>
                ) : defaultValues ? (
                  "Update Task"
                ) : (
                  "Create Task"
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
