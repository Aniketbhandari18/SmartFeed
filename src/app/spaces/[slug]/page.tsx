import SpacePage from "@/components/pages/SpacePage";
import { use } from "react";

export default function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);

  return <SpacePage slug={slug} />;
}
