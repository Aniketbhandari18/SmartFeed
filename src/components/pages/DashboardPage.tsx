import CreateSpaceForm from "../CreateSpaceForm";

export default async function DashboardPage() {
  return (
    <div className="max-w-7xl mx-auto px-2 xxs:px-4 sm:px-6 py-5">
      <div>
        <div className="flex justify-between items-center gap-4">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1> 
          <CreateSpaceForm />
        </div>
        <div>
          <p className="text-gray-600 leading-5 font-semibold">
            Create and manage your feedback spaces, track insights, and focus on
            what really matters to your users.
          </p>
        </div>
      </div>
    </div>
  );
}
