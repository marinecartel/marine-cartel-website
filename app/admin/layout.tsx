export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen bg-[#F1F5F9]">
      {/* Sidebar - Fixed Height and Modern Border */}
      

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto">
        {/* Header decoration if needed, or just children */}
        <div className="p-4 md:p-8">
          {children}
        </div>
      </main>
    </div>
  )
}