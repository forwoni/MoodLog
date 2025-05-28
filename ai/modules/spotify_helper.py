import os
import requests
import random
from dotenv import load_dotenv

load_dotenv()  # .env 파일에서 SPOTIFY_CLIENT_ID, CLIENT_SECRET 불러오기

# 감정별 Spotify 검색 키워드 매핑
emotion_to_keyword = {
    "우울(부정)": ["sad songs", "우울", "melancholy", "위로", "blue", "감성", "depressed", "sad"],
    "불안(부정)": ["relaxing music", "불안", "nervous", "tense", "calm"],
    "행복(긍정)": ["feel good pop", "happy vibes", "행복", "summer hits", "happy", "pop hits"],
    "분노(부정)": ["angry rock", "rage", "빡칠", "heavy metal", "intense", "스트레스", "stress"],
    "중립": ["chill pop", "pop hits", "hits", "top 50 global", "random"]
}

# Spotify 인증 토큰 발급
def get_spotify_token():
    client_id = os.getenv("SPOTIFY_CLIENT_ID")
    client_secret = os.getenv("SPOTIFY_CLIENT_SECRET")
    response = requests.post(
        'https://accounts.spotify.com/api/token',
        data={'grant_type': 'client_credentials'},
        auth=(client_id, client_secret)
    )
    return response.json().get("access_token")

# 키워드로 playlist 검색
def search_playlist_by_keyword(keyword, token, limit=5):
    url = f"https://api.spotify.com/v1/search?q={keyword}&type=playlist&limit={limit}&market=KR"
    headers = {"Authorization": f"Bearer {token}"}
    res = requests.get(url, headers=headers)
    return res.json().get("playlists", {}).get("items", [])

# playlist에서 곡 추출
def get_tracks_from_playlist(playlist_id, token, limit=30):
    url = f"https://api.spotify.com/v1/playlists/{playlist_id}/tracks?limit={limit}"
    headers = {"Authorization": f"Bearer {token}"}
    res = requests.get(url, headers=headers)
    items = res.json().get("items", [])
    
    return [{
        "track_name": item["track"]["name"],
        "artist": item["track"]["artists"][0]["name"],
        "spotify_url": item["track"]["external_urls"]["spotify"],
        "album_image": item["track"]["album"]["images"][0]["url"] if item["track"]["album"]["images"] else None
    } for item in items if item.get("track")]


# 감정 기반 playlist에서 곡 추천
def recommend_emotion_playlist_tracks(emotion, token, num_tracks=10):
    keywords = emotion_to_keyword.get(emotion, ["pop hits"])
    keyword = random.choice(keywords)

    playlists = search_playlist_by_keyword(keyword, token)
    playlists = [p for p in playlists if p and "id" in p]
    if not playlists:
        return []

    playlist = random.choice(playlists)
    playlist_id = playlist["id"]

    tracks = get_tracks_from_playlist(playlist_id, token, limit=30)
    return random.sample(tracks, min(num_tracks, len(tracks)))
