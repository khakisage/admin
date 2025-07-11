'use client';

import { useEffect } from 'react';
import { onMessage } from 'firebase/messaging';
import { messaging } from '@/lib/firebase';
import { requestNotificationPermission } from '@/lib/requestPermission';
import { toast } from 'sonner';
import { api, userAPI } from '@/lib/api';

console.log('🔴 FCMProvider 파일 로드됨 - 최상위 로그');

export function FCMProvider({ children }: { children: React.ReactNode }) {
  console.log('🟢 FCMProvider 컴포넌트 렌더링됨');
  
  useEffect(() => {
    console.log('🟢 FCMProvider useEffect 실행됨');
    
    // 서비스 워커 등록
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker
        .register('/firebase-messaging-sw.js')
        .then(() => console.log('✅ Service Worker 등록 완료'))
        .catch((err) => console.error('❌ SW 등록 실패:', err));
    }

    // FCM 설정 함수
    const setupFCM = async () => {
      try {
        console.log('🚀 FCM 설정 시작...');
        console.log('🔑 환경변수 확인:', {
          vapidKey: process.env.NEXT_PUBLIC_FIREBASE_VAPID ? '✅ 설정됨' : '❌ 미설정',
          apiKey: process.env.NEXT_PUBLIC_FIREBASE_APIKEY ? '✅ 설정됨' : '❌ 미설정',
          projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECTID ? '✅ 설정됨' : '❌ 미설정'
        });
        
        // 권한 요청 및 토큰 발급
        const token = await requestNotificationPermission();
        if (token) {
          console.log('🔑 FCM 토큰 발급 성공:', token);
          console.log('📱 FCM 준비 완료 - 알림 수신 대기 중...');
          // TODO: 토큰을 백엔드에 전송하여 저장
          const response = await api.post('/common/notification/fcm/token', {
            fcmToken: token,
            deviceId: '1234567890',
            deviceType: 'android',
          })
          console.log('🔑 FCM 토큰 저장 성공:', response.data);
        } else {
          console.warn('⚠️ FCM 토큰 발급 실패 - 알림을 받을 수 없습니다');
        }

        // messaging이 Promise이므로 await하여 실제 인스턴스 가져오기
        console.log('📱 messaging 인스턴스 확인 중...');
        const messagingInstance = await messaging;
        console.log('📱 messaging 인스턴스:', messagingInstance ? '✅ 생성됨' : '❌ 생성 실패');
        
        if (messagingInstance) {
          // 포그라운드 메시지 수신 처리
          onMessage(messagingInstance, (payload) => {
            console.log('📥 포그라운드 메시지 수신:', payload);
            
            // toast로 알림 표시 (alert 대신 더 나은 UX)
            if (payload.notification) {
              toast.info(payload.notification.title || '알림', {
                description: payload.notification.body,
                duration: 5000,
              });
            }
          });
        }
      } catch (error) {
        console.error('❌ FCM 설정 실패:', error);
      }
    };

    setupFCM();
  }, []);

  return <>{children}</>;
} 