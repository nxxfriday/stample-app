export default function SuccessPage() {
  return (
    <main className="min-h-screen bg-white px-4 py-10">
      <div className="mx-auto max-w-2xl rounded-2xl border border-gray-200 p-6 shadow-sm">
        <h1 className="mb-2 text-3xl font-bold">Payment Successful</h1>
        <p className="text-gray-600">
          Your booking has been paid and recorded. You can check your dashboard for status updates.
        </p>
      </div>
    </main>
  );
}