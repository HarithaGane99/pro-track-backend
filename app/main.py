from fastapi import FastAPI

app = FastAPI()

@app.get("/")
def read_root():
    return {"message": "ProTrack API is running!"}