"use client";

import { addFeedback } from "@/actions/feedbackActions/addFeedback";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { feedbackFormSchema } from "@/lib/zodSchemas/feedbackFormSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Space } from "@prisma/client";
import { ExternalLink, Loader2 } from "lucide-react";
import Link from "next/link";
import { useTransition } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import z from "zod";

type props = {
  slug: string;
  space: Pick<Space, "title" | "description" | "externalLink">;
};

export default function FeedbackForm({ slug, space }: props) {
  const [isPending, startTransition] = useTransition();

  const form = useForm<z.infer<typeof feedbackFormSchema>>({
    resolver: zodResolver(feedbackFormSchema),
    defaultValues: {
      name: "",
      email: "",
      content: "",
    },
  });

  const onSubmit = (values: z.infer<typeof feedbackFormSchema>) => {
    startTransition(async () => {
      const result = await addFeedback(slug, values);

      if (result.success) {
        toast.success("Feedback added successfully");
        form.reset();
      } else {
        toast.error(result.message);
      }
    });
  };

  return (
    <div className="max-w-lg mx-auto my-8 px-4">
      {/* Header Info */}
      <div className="mb-6 text-center">
        <h1 className="text-3xl font-bold">Submit Your Feedback</h1>
      </div>

      {/* Feedback Form */}
      <Card>
        <CardHeader>
          <CardTitle>{space.title}</CardTitle>
          <CardDescription>{space.description}</CardDescription>
          {space.externalLink && (
            <Link
              href={space.externalLink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm font-semibold hover:underline"
            >
              <span>Visit our product/service page</span>
              <ExternalLink className="w-4 h-4" />
            </Link>
          )}
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Name */}
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Your Name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Email */}
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="you@example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Feedback */}
              <FormField
                control={form.control}
                name="content"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Feedback</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Your thoughts..."
                        className="resize-none"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full" disabled={isPending}>
                {isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    <span>Submitting...</span>
                  </>
                ) : (
                  "Submit Feedback"
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
