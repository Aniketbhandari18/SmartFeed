"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";
import { Task } from "@prisma/client";
import Loader from "./Loader";
import TaskCard from "./TaskCard";
import TaskForm from "./TaskForm";
import { addTask } from "@/actions/taskActions/addTask";

export default function TaskList({ spaceId }: { spaceId: string }) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        setIsLoading(true);
        const res = await axios.get(`/api/spaces/${spaceId}/tasks`);
        console.log(res);

        setTasks(res.data.tasks);
      } catch (error) {
        console.log(error);
        toast.error(
          error instanceof Error ? error.message : "Something went wrong"
        );
      } finally {
        setIsLoading(false);
      }
    })();
  }, [spaceId]);

  if (isLoading) {
    return <Loader className="mt-10" />;
  }

  const addNewTask = (newTask: Task) => {
    setTasks((prevTasks) => [newTask, ...prevTasks]);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Tasks</h2>
        <TaskForm spaceId={spaceId} onSubmit={addTask} onSuccess={addNewTask}>
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            Add task
          </Button>
        </TaskForm>
      </div>

      <div className="flex sm:flex-row flex-col-reverse justify-between gap-4 lg:gap-6">
        {/* mixed version */}
        <Card className="sm:flex-1/5 lg:flex-2 gap-2">
          <CardHeader>
            <CardTitle>All Tasks</CardTitle>
          </CardHeader>
          <CardContent>
            {tasks.length === 0 && (
              <div className="flex flex-col items-center">
                <Image
                  src={"/task-illustration.png"}
                  alt="Task illustration"
                  width={200}
                  height={200}
                  className="mb-2"
                />
                <p className="text-lg font-medium">No task found</p>
                <p className="text-sm text-muted-foreground">
                  There are no tasks to display
                </p>
              </div>
            )}
            <div className="space-y-4">
              {tasks.map((task) => (
                <TaskCard
                  key={task.id}
                  spaceId={spaceId}
                  task={task}
                  setTasks={setTasks}
                />
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Sidebar */}
        <div className="space-y-4 flex-1">
          {/* Progress */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span>Completed</span>
                  <span>
                    {tasks.filter((t) => t.completed).length}/{tasks.length}
                  </span>
                </div>
                <div className="w-full bg-secondary rounded-full h-2">
                  <div
                    className="bg-primary h-2 rounded-full"
                    style={{
                      width: `${
                        (tasks.filter((t) => t.completed).length /
                          tasks.length) *
                        100
                      }%`,
                    }}
                  ></div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Priority Breakdown */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Priority Breakdown</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-destructive">High Priority</span>
                  <span>
                    {
                      tasks.filter((t) => t.priority === "high" && !t.completed)
                        .length
                    }
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-warning">Medium Priority</span>
                  <span>
                    {
                      tasks.filter(
                        (t) => t.priority === "medium" && !t.completed
                      ).length
                    }
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Low Priority</span>
                  <span>
                    {
                      tasks.filter((t) => t.priority === "low" && !t.completed)
                        .length
                    }
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
