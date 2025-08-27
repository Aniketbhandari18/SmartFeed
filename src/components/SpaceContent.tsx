import ChatAssistant from "./ChatAssistant";
import FeedbackList from "./FeedbackList";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";

export default function SpaceContent({ spaceId }: { spaceId: string }) {
  return (
    <Tabs defaultValue="feedback" className="mt-6">
      <TabsList className="bg-gray-200 max-w-2xl w-full overflow-x-auto mb-4">
        <TabsTrigger value="feedback">Feedbacks</TabsTrigger>
        <TabsTrigger value="analytics">Analytics</TabsTrigger>
        <TabsTrigger value="chatbot">AI Assistant</TabsTrigger>
        <TabsTrigger value="actions">Action Items</TabsTrigger>
      </TabsList>

      <TabsContent value="feedback">
        <FeedbackList spaceId={spaceId} />
      </TabsContent>

      <TabsContent value="chatbot">
        <ChatAssistant spaceId={spaceId} />
      </TabsContent>
    </Tabs>
  );
}
