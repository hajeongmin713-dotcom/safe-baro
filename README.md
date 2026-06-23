# 🐾 안전바로 (Safe-Baro) v2.0 — 국민 재난안전 도우미

> 위치·상황을 이해하는 AI 안전 도우미 **바로**와 공공데이터 기반 전국 실시간 안전지도.  
> **단일 HTML 파일 + data/ 폴더** 구조로, 설치 없이 GitHub Pages 또는 Netlify에 바로 배포합니다.

---

## 📁 폴더 구조

```
안전바로/
├─ index.html                        ← 앱 전체 (이 파일 하나로 동작)
├─ data/
│  ├─ README.md                      ← CSV 넣는 법 안내
│  ├─ 민방위대피시설.csv              ← ★ 여기에 원본 CSV를 넣으세요
│  ├─ 안전비상벨위치정보.csv
│  ├─ CCTV정보.csv
│  └─ 보호수정보.csv
├─ netlify/
│  └─ functions/
│     ├─ chat.js                     ← Anthropic Claude 프록시
│     └─ gemini-chat.js              ← Google Gemini 프록시
├─ .github/
│  └─ workflows/
│     └─ deploy.yml                  ← GitHub Pages 자동 배포
├─ netlify.toml                      ← Netlify 배포 설정
├─ package.json
└─ .gitignore
```

---

## 🚀 배포 방법

### ① GitHub Pages (무료, 권장)

1. GitHub에서 **새 저장소** 생성 (예: `safe-baro`)
2. 이 폴더의 **모든 파일**(숨김 파일 포함)을 저장소에 업로드
3. 저장소 **Settings → Pages → Source: `GitHub Actions`** 선택
4. `main` 브랜치에 push → 자동 배포
5. `https://[USERNAME].github.io/safe-baro/` 으로 접속 ✅

### ② Netlify (LLM API 키 안전 사용 시 권장)

1. [app.netlify.com](https://app.netlify.com) → **Add new site → Import an existing project**
2. GitHub 저장소 선택 → Publish directory: `.` → Deploy
3. **Site configuration → Environment variables** 에서 API 키 등록 (아래 참조)
4. 배포되면 `https://[사이트명].netlify.app` 접속 ✅

---

## 🔑 AI 챗봇 API 키 설정

### Gemini API (Google) — **권장, 무료 할당 있음**

1. [Google AI Studio](https://aistudio.google.com/app/apikey) 에서 API 키 발급
2. Netlify 환경변수에 추가:

   ```
   GEMINI_API_KEY = AIzaSyxxxxxxxxxxxxxxxxx
   ```

### Anthropic Claude API

1. [console.anthropic.com](https://console.anthropic.com) 에서 API 키 발급
2. Netlify 환경변수에 추가:

   ```
   ANTHROPIC_API_KEY = sk-ant-xxxxxxxxxxxx
   ```

> ⚠️ **보안 주의**: API 키는 절대 `index.html`이나 GitHub에 직접 넣지 마세요.  
> Netlify 환경변수에만 저장하면 서버리스 함수가 안전하게 처리합니다.

> 💡 **API 키 없어도 동작**: 키가 없으면 위치·상황을 인식하는 **지능형 폴백**이 자동으로 작동합니다.

---

## 📊 공공데이터 CSV 연동

`data/` 폴더에 아래 파일을 넣으면 앱이 자동으로 전국 데이터를 지도에 표시합니다.

| 파일명 | 내용 | 행 수 |
|---|---|---|
| `민방위대피시설.csv` | 전국 민방위 대피시설 | 18,000+ |
| `안전비상벨위치정보.csv` | 전국 안전비상벨 | 89,000+ |
| `CCTV정보.csv` | 전국 방범·교통 CCTV | 375,000+ |
| `보호수정보.csv` | 전국 보호수 | 12,000+ |

**파일 없으면**: 동작구 표본 데이터가 자동으로 표시됩니다.

---

## 🗺️ 지도 주소 검색

- 지도 탭 상단 검색창에 주소 입력 → 해당 위치로 이동 + 반경 내 가까운 대피소 알림
- **📍 내 위치** 버튼 → GPS 위치 자동 감지
- OSM Nominatim 무료 지오코딩 사용 (별도 키 불필요)

---

## 🔮 향후 계획 (실데이터 API 교체 지점)

코드 내 `▶ 실데이터 연동 시:` 주석 위치를 찾아 교체합니다.

| 기능 | 현재 | 향후 |
|---|---|---|
| 기상/특보 | 가상 데이터 | 기상청 동네예보·특보 API |
| 교통량 | 미구현 (추후 예정) | 국가교통정보센터(ITS) / 서울 TOPIS API |
| 대피시설 | CSV 파싱 | 공공데이터포털 실시간 API |

---

## 📝 데이터 출처

- 민방위 대피시설·안전비상벨·CCTV·보호수 — **행정안전부 / 각 지자체 표준데이터** ([data.go.kr](https://www.data.go.kr))
- 지도 타일 — **© OpenStreetMap contributors** (Leaflet 1.9.4)
- 마스코트 '바로' — 본 프로젝트 자체 제작 (CC0 자유 이용)
