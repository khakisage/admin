"use client";

import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import useEmblaCarousel from "embla-carousel-react";
import { useCallback } from "react";

// TODO: API 도입 시 인터페이스 변경
// interface AttachmentDialogProps {
//   trigger: React.ReactNode
//   requestId: number
//   requestType: 'manager' | 'funeral'
// }
interface AttachmentDialogProps {
  trigger: React.ReactNode;
  images: string[]; // 이미지 URL 목록
  files: { name: string; url: string }[]; // 첨부파일 목록
}

export default function AttachmentDialog({
  trigger,
  images = [],
  files = [],
}: AttachmentDialogProps) {
  // TODO: API 도입 시 useQuery 추가
  // const { data, isLoading } = useQuery({
  //   queryKey: [`${requestType}-attachments`, requestId],
  //   queryFn: () => fetchAttachments(requestId, requestType),
  //   enabled: false // 모달 열릴 때만 실행
  // })

  const [emblaRef, emblaApi] = useEmblaCarousel();

  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);
  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);

  return (
    <Dialog>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>첨부파일 보기</DialogTitle>
          <DialogDescription>
            이미지 및 첨부파일을 확인하세요.
          </DialogDescription>
        </DialogHeader>

        {/* TODO: API 도입 시 로딩 상태 추가 */}
        {/* {isLoading ? (
          <div className="flex justify-center py-8">
            <LoadingSpinner />
          </div>
        ) : ( */}

        {/* 이미지 슬라이더 */}
        {images.length > 0 && (
          <div className="overflow-hidden" ref={emblaRef}>
            <div className="flex">
              {images.map((src, idx) => (
                <div className="min-w-full px-2" key={idx}>
                  <img
                    src={src}
                    alt={`첨부 이미지 ${idx + 1}`}
                    className="w-full h-[300px] object-contain rounded-md border"
                  />
                </div>
              ))}
            </div>
            {images.length > 1 && (
              <div className="flex justify-between mt-2">
                <Button variant="outline" onClick={scrollPrev}>
                  ← 이전
                </Button>
                <Button variant="outline" onClick={scrollNext}>
                  다음 →
                </Button>
              </div>
            )}
          </div>
        )}

        {/* 첨부파일 다운로드 */}
        {files.length > 0 && (
          <div className="mt-6 space-y-2">
            <h3 className="font-semibold">첨부파일</h3>
            {files.map((file, idx) => (
              <div
                key={idx}
                className="flex justify-between items-center border p-2 rounded"
              >
                <span className="text-sm">{file.name}</span>
                <a
                  href={file.url}
                  download
                  className="text-blue-600 text-sm underline hover:text-blue-800"
                >
                  다운로드
                </a>
              </div>
            ))}
          </div>
        )}

        {/* )} */}

        <DialogClose asChild>
          <Button className="mt-6 w-full" variant="secondary">
            닫기
          </Button>
        </DialogClose>
      </DialogContent>
    </Dialog>
  );
}
