import ChatAssistant from "./ChatAssistant";
import FeedbackList from "./FeedbackList";
import TaskList from "./TaskList";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";

export default function SpaceContent({ spaceId }: { spaceId: string }) {
  return (
    <Tabs defaultValue="feedback" className="mt-6">
      <TabsList className="bg-gray-200 max-w-xl w-full overflow-x-auto mb-4">
        <TabsTrigger value="feedback">Feedbacks</TabsTrigger>
        <TabsTrigger value="chatbot">AI Assistant</TabsTrigger>
        <TabsTrigger value="tasks">Tasks</TabsTrigger>
      </TabsList>

      <TabsContent value="feedback">
        <FeedbackList spaceId={spaceId} />
      </TabsContent>

      <TabsContent value="chatbot">
        <ChatAssistant spaceId={spaceId} />
      </TabsContent>

      <TabsContent value="tasks">
        <TaskList spaceId={spaceId} />
      </TabsContent>
    </Tabs>
  );
}
