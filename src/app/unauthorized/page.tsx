export default function UnauthorizedPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="bg-white shadow-lg p-10 rounded-lg text-center">
        <h1 className="text-3xl font-bold text-red-600 mb-4">Access Denied 🚫</h1>
        <p className="text-gray-700">
          You are not authorized to view this page.
        </p>
      </div>
    </div>
  );
}
