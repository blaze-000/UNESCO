"use client";

import { use, useEffect, useState } from "react";
import TextContent from "@/components/TextContent";
import VideoPlayer from "@/components/VideoPlayer";
import AudioPlayer from "@/components/AudioPlayer";
import { modules } from "@/data/courseData";
import  Quiz  from "@/components/Quiz";

export default function ItemPage({
  params,
}: {
  params: Promise<{ moduleId: string; itemId: string }>;
}) {
  const { moduleId, itemId } = use(params);
  const item = modules
    .find((m) => m.id === moduleId)
    ?.items.find((i) => i.id === itemId);

  const [htmlContent, setHtmlContent] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (item?.type !== "text" || !item.src) return;

    setLoading(true);
    fetch(item.src)
      .then((res) => res.text())
      .then(setHtmlContent)
      .catch(() => setHtmlContent("<div>Failed to load content</div>"))
      .finally(() => setLoading(false));
  }, [item]);

  if (!item) return <div>Item not found</div>;
  if (item.type === "text" && loading) return <div>Loading...</div>;

  const components = {
    video: () => <VideoPlayer src={item.src ?? ""} title={item.title} />,
    text: () => <TextContent htmlContent={htmlContent} />,
    exercise: () => ( <Quiz
        title={item.title}
        questions={Array.isArray(item.questions) ? item.questions : []}
        moduleId={moduleId}
        itemId={itemId}
      />
    ),
    quiz: () => (
      <Quiz
        title={item.title}
        questions={Array.isArray(item.questions) ? item.questions : []}
        moduleId={moduleId}
        itemId={itemId}
      />
    ),
    audio: () => (
      <AudioPlayer
        content={item.src ?? ""}
        title={item.title}
        coverImage={item.coverImage}
      />
    ),
  } as const;

  const Component = components[item.type as keyof typeof components];
  return Component ? <Component /> : <div>Unsupported content type</div>;
}
