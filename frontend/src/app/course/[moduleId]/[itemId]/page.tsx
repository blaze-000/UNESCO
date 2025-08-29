"use client";

import { use, useEffect, useState } from "react";
import TextContent from "@/components/TextContent";
import VideoPlayer from "@/components/VideoPlayer";
import AudioPlayer from "@/components/AudioPlayer";
import { modules } from "@/data/courseData";
import Quiz from "@/components/Quiz";
import { CourseItem, VideoItem } from "@/types/course";

export default function ItemPage({
  params,
}: {
  params: Promise<{ moduleId: string; itemId: string }>;
}) {
  const { moduleId, itemId } = use(params);
  const item: CourseItem | undefined = modules
    .find((m) => m.id === moduleId)
    ?.items.find((i) => i.id === itemId) as CourseItem | undefined;

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
    video: () => (
      <VideoPlayer
        src={(item as VideoItem).src}
        title={item.title}
        transcript={(item as VideoItem).transcript}
      />
    ),
    text: () => <TextContent htmlContent={htmlContent} />,
    exercise: () => (
      <Quiz
        title={item.title}
        questions={item.type === "exercise" ? item.questions : []}
        moduleId={moduleId}
        itemId={itemId}
      />
    ),
    quiz: () => (
      <Quiz
        title={item.title}
        questions={item.type === "quiz" ? item.questions : []}
        moduleId={moduleId}
        itemId={itemId}
      />
    ),
    audio: () => (
      <AudioPlayer
        content={item.type === "audio" ? item.src : ""}
        title={item.title}
        coverImage={item.type === "audio" ? item.coverImage : ""}
      />
    ),
  } as const;

  const Component = components[item.type as keyof typeof components];
  return Component ? <Component /> : <div>Unsupported content type</div>;
}
