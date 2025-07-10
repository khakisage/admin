import { Card, CardContent } from "@/components/ui/card";

interface MemberInfo {
  name: string;
  phone: string;
  email: string;
  bank: string;
  currentPoints: number;
  currentCash: number;
}

export default function CompanyMemberInfoCard({
  member,
}: {
  member: MemberInfo;
}) {
  return (
    <Card className="w-full bg-blue-50">
      <CardContent className="w-full p-6 flex flex-col gap-2">
        <div className="text-2xl font-bold mb-2">{member.name}</div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <div className="text-xs text-gray-500">휴대전화</div>
            <div className="font-medium">{member.phone}</div>
          </div>
          <div>
            <div className="text-xs text-gray-500">캐시</div>
            <div className="font-medium">
              {member.currentCash.toLocaleString()} 원
            </div>
          </div>
          <div>
            <div className="text-xs text-gray-500">아이디</div>
            <div className="font-medium">{member.username}</div>
          </div>
          <div>
            <div className="text-xs text-gray-500">포인트</div>
            <div className="font-medium">
              {member.currentPoints.toLocaleString()} P
            </div>
          </div>
          <div>
            <div className="text-xs text-gray-500">계좌번호</div>
            <div className="font-medium">{member.bank}</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
