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
import { updateTask } from "@/actions/taskActions/updateTask";

type Props = {
  children?: ReactNode;
  task: Task;
  setTasks: Dispatch<SetStateAction<Task[]>>;
};

export default function UpdateTaskForm({ children, task, setTasks }: Props) {
  const [open, setOpen] = useState<boolean>(false);

  const onSuccess = (result: {
    success: boolean;
    message: string;
    newTask?: Task;
  }) => {
    if (!result.newTask) return;

    // update tasks
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === result.newTask!.id ? { ...result.newTask! } : task
      )
    );

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
            <span>Edit Task</span>
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[430px]">
        <DialogHeader>
          <DialogTitle>Edit Task</DialogTitle>
          <DialogDescription>
            Update the details of your task.
          </DialogDescription>
        </DialogHeader>
        <TaskForm
          defaultValues={task}
          onSubmit={(values) => updateTask(task.id, values)}
          onSuccess={onSuccess}
        />
      </DialogContent>
    </Dialog>
  );
}
