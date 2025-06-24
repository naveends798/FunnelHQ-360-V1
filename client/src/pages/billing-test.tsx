import Sidebar from "@/components/sidebar";

export default function BillingTestPage() {
  return (
    <div className="min-h-screen gradient-bg relative overflow-hidden">
      <Sidebar />
      <main className="lg:ml-64 p-4 lg:p-8 pt-20 lg:pt-8">
        <div className="text-center py-12">
          <h1 className="text-3xl font-bold text-white mb-4">Billing Test Page</h1>
          <p className="text-slate-400">This is a simple test to see if the page loads</p>
        </div>
      </main>
    </div>
  );
}