from fastapi import FastAPI
from pydantic import BaseModel
from emotion_analyzer import analyze_long_text
from spotify_helper import emotion_to_keyword, get_spotify_token, recommend_emotion_playlist_tracks

app = FastAPI()

# 요청 스키마 정의
class TextInput(BaseModel):
    text: str

# 분석만 하는 API
@app.post("/analyze")
def analyze(input: TextInput):
    emotion = analyze_long_text(input.text)
    return {"emotion": emotion}

# 감정 + 곡 추천 API
@app.post("/recommend")
def recommend(input: TextInput):
    emotion = analyze_long_text(input.text)
    token = get_spotify_token()
    tracks = recommend_emotion_playlist_tracks(emotion, token)
    return {
        "emotion": emotion,
        "tracks": tracks
    }
