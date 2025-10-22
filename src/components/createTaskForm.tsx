"use client";

import { Task } from "@prisma/client";
import { Dispatch, ReactNode, SetStateAction, useState } from "react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { Plus } from "lucide-react";
import TaskForm from "./TaskForm";
import { addTask } from "@/actions/taskActions/addTask";

type Props = {
  spaceId: string;
  feedback?: string;
  children?: ReactNode;
  setTasks?: Dispatch<SetStateAction<Task[]>>;
};

export default function CreateTaskForm({
  spaceId,
  feedback,
  children,
  setTasks,
}: Props) {
  const [open, setOpen] = useState<boolean>(false);

  const onSuccess = (result: {
    success: boolean;
    message: string;
    newTask?: Task;
  }) => {
    if (!result.newTask) return;

    // add task
    if (setTasks) {
      setTasks((prevTasks) => [result.newTask!, ...prevTasks]);
    }
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={() => setOpen(!open)}>
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
          <DialogTitle>New Task</DialogTitle>
          <DialogDescription>
            Update the details of your task.
          </DialogDescription>
        </DialogHeader>
        <TaskForm
          feedback={feedback}
          onSubmit={(values) => addTask(spaceId, values)}
          onSuccess={onSuccess}
        />
      </DialogContent>
    </Dialog>
  );
}
