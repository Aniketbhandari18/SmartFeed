import CreateSpaceForm from "../CreateSpaceForm";
import SpaceList from "../SpaceList";

export default async function DashboardPage() {
  return (
    <div className="px-2 xxs:px-4 sm:px-6 py-5">
      <div className="mb-8">
        <div className="flex justify-between items-center gap-4 mb-2">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1> 
          <CreateSpaceForm />
        </div>
        <div>
          <p className="text-gray-600 leading-5 font-semibold">
            Create and manage your feedback spaces, track insights, and focus on
            what really matters to your users.
          </p>
        </div>
      </div>

      <SpaceList />
    </div>
  );
}
