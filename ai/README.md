
---

# MoodLog AI

**MoodLog** 프로젝트의 AI 기능을 담당하는 서브 디렉토리입니다.  
텍스트 기반 감정 분석과 Spotify 음악 추천 기능을 제공합니다.

---

## 🚀 주요 기능

- 긴 텍스트(예: 블로그 글) 기반 감정 분석 (rule-based 또는 모델 기반)
- 감정 결과에 따라 Spotify API를 활용해 맞춤 음악 추천
- FastAPI 서버 기반 RESTful API 제공
- Spring Boot 백엔드에서 WebClient를 통해 연동 가능

---

## ⚙️ 기술 스택

- Python 3.10+
- [FastAPI](https://fastapi.tiangolo.com/)
- Uvicorn (ASGI 서버)
- Spotipy (Spotify Web API Python wrapper)
- dotenv (환경변수 관리)
- Pydantic (요청/응답 모델)

---

## 📁 폴더 구조

```

ai/
├── issues/                          # 작업 중 이슈 문서 정리
├── modules/                         # 감정 분석, Spotify 추천 로직 모듈
│   ├── emotion\_analyzer.py         # 감정 분석 (rule-based or 모델 기반)
│   ├── emotion\_analyzer_.py        # 감정 분석 (rule-based or 모델 기반)
│   └── spotify\_helper.py           # 감정 → 키워드 매핑 및 Spotify API 호출
│   └── info.py
│   └── main.py                      # API 기본 틀
│   └── Issue3_2_test_main.py        # 감정분석 & 곡 추천 API
├── venv/                            # 가상 환경 디렉토리 (로컬 실행용, Git 추적 제외)
├── .gitignore                       # **pycache** 및 venv 등 Git 추적 제외 설정
├── .gitignore\_backup\_from\_root   # 기존 루트에서 이동한 백업 gitignore
├── README.md                        # 본 파일
├── emotion\_api\_spec.md            # 감정 분석/추천 API 명세서

````

---

## 🔗 API 명세서

https://github.com/forwoni/MoodLog/blob/develop/ai/emotion_api_spec.md

---

## 🛠️ 실행 방법

1. `.env` 파일 생성 및 Spotify Client ID/Secret 설정
2. 의존성 설치

```bash
pip install -r requirements.txt
```

3. 서버 실행

```bash
uvicorn main:app --reload
```
