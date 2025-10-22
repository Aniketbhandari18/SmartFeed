"use client";

import { taskFormSchema } from "@/lib/zodSchemas/taskFormSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Task, TaskCategory, Priority } from "@prisma/client";
import { useState, useTransition } from "react";
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
import { DialogClose, DialogFooter } from "./ui/dialog";
import { Button } from "./ui/button";
import { Loader2, Sparkles } from "lucide-react";
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
import { getTitleSuggestion } from "@/lib/server/titleSuggestion";

type Props = {
  defaultValues?: Task;
  feedback?: string;
  onSubmit: (
    values: z.infer<typeof taskFormSchema>
  ) => Promise<{ success: boolean; message: string; newTask?: Task }>;
  onSuccess: (result: {
    success: boolean;
    message: string;
    newTask?: Task;
  }) => void;
};

export default function TaskForm({
  feedback,
  defaultValues,
  onSubmit,
  onSuccess,
}: Props) {
  const [isPending, startTransition] = useTransition();
  const [isSuggesting, setIsSuggesting] = useState<boolean>(false);

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
      const res = await onSubmit(values);

      if (res.success) {
        onSuccess(res);
        toast.success(res.message);
        form.reset();
      } else {
        toast.error(res.message);
      }
    });
  };

  const handleSuggestTitle = async (feedback: string) => {
    setIsSuggesting(true);
    const text = await getTitleSuggestion(feedback);
    form.setValue("title", text);
    setIsSuggesting(false);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        {/* Title */}
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <div className="relative w-full">
                  <Input
                    placeholder="Enter task title"
                    className="pr-9"
                    {...field}
                  />
                  {feedback && (
                    <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center">
                      {isSuggesting ? (
                        <Loader2 className="w-4 h-4 mr-1 animate-spin" />
                      ) : (
                        <button
                          onClick={() => handleSuggestTitle(feedback)}
                          type="button"
                          className="p-1  rounded-sm transition-all duration-150 hover:bg-gray-100 cursor-pointer"
                        >
                          <Sparkles size={16} color="gray" />
                        </button>
                      )}
                    </div>
                  )}
                </div>
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
                  <Select defaultValue="medium" onValueChange={field.onChange}>
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
                  <Select defaultValue="other" onValueChange={field.onChange}>
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
                              .replace(/\b\w/g, (char) => char.toUpperCase())}
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
  );
}
