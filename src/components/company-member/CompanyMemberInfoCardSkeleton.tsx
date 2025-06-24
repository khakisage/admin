import { Card, CardContent } from "@/components/ui/card";

export default function CompanyMemberInfoCardSkeleton() {
  return (
    <Card>
      <CardContent className="p-6 animate-pulse">
        <div className="h-7 w-32 bg-gray-200 rounded mb-4" />
        <div className="grid grid-cols-2 gap-4">
          <div className="h-4 w-24 bg-gray-200 rounded mb-2" />
          <div className="h-4 w-24 bg-gray-200 rounded mb-2" />
          <div className="h-4 w-32 bg-gray-200 rounded mb-2" />
          <div className="h-4 w-16 bg-gray-200 rounded mb-2" />
          <div className="h-4 w-16 bg-gray-200 rounded mb-2" />
        </div>
      </CardContent>
    </Card>
  );
}
