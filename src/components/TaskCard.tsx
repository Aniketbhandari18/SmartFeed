import { Task } from "@prisma/client";
import {
  AlertCircle,
  CheckCircle,
  Clock,
  Edit3,
  Loader2,
  Trash2,
} from "lucide-react";
import { Dispatch, SetStateAction, useTransition } from "react";
import { Checkbox } from "./ui/checkbox";
import { Badge } from "./ui/badge";
import { toggleTaskCompleted } from "@/actions/taskActions/toggleTaskCompleted";
import toast from "react-hot-toast";

export default function TaskCard({
  spaceId,
  task,
  setTasks,
}: {
  spaceId: string;
  task: Task;
  setTasks: Dispatch<SetStateAction<Task[]>>;
}) {
  const [isPending, startTransition] = useTransition();

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "text-red-600 bg-red-200";
      case "medium":
        return "text-amber-600 bg-amber-200";
      case "low":
        return "text-green-600 bg-green-200";
    }
  };

  const getPriorityIcon = (priority: string) => {
    const classes = "h-3 w-3";

    switch (priority) {
      case "high":
        return <AlertCircle className={classes} />;
      case "medium":
        return <Clock className={classes} />;
      case "low":
        return <CheckCircle className={classes} />;
      default:
        return <Clock className={classes} />;
    }
  };

  const toggletask = (taskId: string, currentCompleted: boolean) => {
    startTransition(async () => {
      const res = await toggleTaskCompleted(spaceId, taskId, !currentCompleted);

      if (res.success) {
        setTasks((prev) =>
          prev.map((task) =>
            task.id === taskId
              ? { ...task, completed: !currentCompleted }
              : task
          )
        );
      } else {
        toast.error("Failed to update task");
      }
    });
  };

  return (
    <div
      className={`flex items-center gap-3 p-3 border rounded-lg ${
        task.completed && "bg-muted/40"
      }`}
    >
      {isPending ? (
        <Loader2 size={16} className="animate-spin" />
      ) : (
        <Checkbox
          checked={task.completed}
          onCheckedChange={() => toggletask(task.id, task.completed)}
          disabled={isPending}
        />
      )}

      <div className="flex-1">
        <p
          className={`font-medium ${
            task.completed && "line-through text-muted-foreground"
          }`}
        >
          {task.title}
        </p>
        <p
          className={`text-sm text-muted-foreground ${
            task.completed && "line-through"
          }`}
        >
          {task.description}
        </p>
        <div className="flex items-center gap-2 mt-1">
          <Badge variant="outline" className="text-xs">
            {task.category}
          </Badge>
          <Badge className={`text-xs gap-1 ${getPriorityColor(task.priority)}`}>
            {getPriorityIcon(task.priority)}
            {task.priority}
          </Badge>
        </div>
      </div>

      {/* Edit + Delete Icons */}
      <div className="flex items-center gap-2">
        <button className="p-1 rounded-md hover:bg-muted">
          <Edit3 size={16} />
        </button>
        <button className="p-1 rounded-md hover:bg-muted text-red-600">
          <Trash2 size={16} />
        </button>
      </div>
    </div>
  );
}
