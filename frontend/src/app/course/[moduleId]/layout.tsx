import Sidebar from "@/components/sidebar";

export default function ModuleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { moduleId: string };
}) {
  return (
    <div className="flex h-[calc(100vh-4rem)]">
      {/* Sidebar with independent scroll */}
      <aside className="overflow-y-auto ">
        <Sidebar moduleId={params.moduleId} />
      </aside>

      {/* Main content with independent scroll */}
      <main className="flex-1 overflow-y-auto">
        <div className="">{children}</div>
      </main>
    </div>
  );
}
