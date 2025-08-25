"use client";

import React from "react";

interface TextContentProps {
  title?: string;
  htmlContent: string;
}

export default function TextContent({ htmlContent }: TextContentProps) {
  return (
    <div className="flex w-full">
      <div className="max-w-3xl mx-auto w-full flex flex-col h-full">
        {/* Scrollable content below header */}
        <div className="prose p-4 flex-1 overflow-y-auto min-h-0 pb-4">
          <div dangerouslySetInnerHTML={{ __html: htmlContent }} />
        </div>
      </div>
    </div>
  );
}
