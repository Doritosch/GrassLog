# GrassLog

GitHub 잔디 스타일로 일상 활동을 기록하는 라이프 로그 앱.

[https://grass-log.vercel.app](https://grass-log.vercel.app)

## 기능

- **활동 기록** — 텍스트, 카테고리 태그, 이미지 첨부 (드래그 앤 드롭 지원)
- **잔디 그래프** — GitHub 스타일 연간 히트맵으로 활동 시각화
- **카테고리 관리** — 사용자 정의 카테고리 생성 및 색상 구분
- **Google 로그인** — Supabase Auth 기반 OAuth
- **반응형 UI** — 데스크탑 사이드바 + 모바일 탭바 레이아웃

## 기술 스택

- **Framework** — Next.js 16 (App Router)
- **Database & Auth** — Supabase (PostgreSQL + RLS + Storage)
- **Styling** — Tailwind CSS
- **Deployment** — Vercel (Seoul `icn1` 리전)

## 로컬 실행

```bash
npm install
npm run dev
```

`.env.local` 파일에 Supabase 환경변수 필요:

```
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
```
