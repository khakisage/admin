// tailwind.config.ts
import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/**/*.{ts,tsx}', // src 디렉토리 내부의 ts/tsx 파일에서 Tailwind 사용
  ],
  theme: {
    extend: {
      fontFamily: {
        pretendard: ['Pretendard', 'sans-serif'],
        kimm: ['KIMM', 'sans-serif'],
        gmarket: ['GmarketSans', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

export default config