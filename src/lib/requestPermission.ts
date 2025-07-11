import { messaging } from './firebase';
import { getToken } from 'firebase/messaging';

export async function requestNotificationPermission() {
  // messaging이 Promise이므로 await하여 실제 인스턴스를 가져옵니다
  const messagingInstance = await messaging;
  if (!messagingInstance) return null;

  const permission = await Notification.requestPermission();
  if (permission !== 'granted') {
    console.warn('🔒 알림 권한이 거부됨');
    return null;
  }
  try {
    const token = await getToken(messagingInstance, { vapidKey: process.env.NEXT_PUBLIC_FIREBASE_VAPID });
    // console.log('✅ FCM Token:', token);
    return token;
  } catch (err) {
    console.error('❌ FCM 토큰 발급 실패:', err);
    return null;
  }
}