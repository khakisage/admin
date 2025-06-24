export default function CompanyMemberListSkeleton() {
  return (
    <div className="space-y-2 animate-pulse">
      <div className="border rounded p-4 flex justify-between items-center">
        <div className="h-4 w-24 bg-gray-200 rounded" />
        <div className="h-4 w-24 bg-gray-200 rounded" />
        <div className="h-4 w-16 bg-gray-200 rounded" />
      </div>
      <div className="border rounded p-4 flex justify-between items-center">
        <div className="h-4 w-24 bg-gray-200 rounded" />
        <div className="h-4 w-24 bg-gray-200 rounded" />
        <div className="h-4 w-16 bg-gray-200 rounded" />
      </div>
    </div>
  );
}
