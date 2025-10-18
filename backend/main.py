import json
from fastapi import FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

# Initialize the FastAPI app
app = FastAPI()

origins = [
    "http://localhost:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Pydantic Models for data validation ---
class UserRegister(BaseModel):
    username: str
    password: str

class UserLogin(BaseModel):
    username: str
    password: str

# --- "Database" Helper Functions ---
def read_users_db():
    try:
        with open("users.json", "r") as f:
            return json.load(f)
    except (FileNotFoundError, json.JSONDecodeError):
        return []

def write_users_db(users):
    with open("users.json", "w") as f:
        json.dump(users, f, indent=4)


# --- API Endpoints ---
@app.get("/")
def read_root():
    return {"message": "Welcome to Fasal Drishti API"}

@app.post("/register", status_code=status.HTTP_201_CREATED)
def register_user(user: UserRegister):
    users = read_users_db()

    # Check if username already exists
    if any(u["username"] == user.username for u in users):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Username already registered",
        )

    # Add the new user to our list
    users.append(user.dict())
    write_users_db(users)

    return {"message": f"User '{user.username}' registered successfully"}


@app.post("/login")
def login_user(user: UserLogin):
    users = read_users_db()

    # Check if user exists and password matches
    for existing_user in users:
        if existing_user["username"] == user.username and existing_user["password"] == user.password:
            return {"message": "Login successful", "username": user.username}

    # If login fails
    raise HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Invalid username or password",
    )