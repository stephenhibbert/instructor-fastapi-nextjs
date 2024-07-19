from pydantic import BaseModel

class UserInput(BaseModel):
    text: str

class Question(BaseModel):
    id: int
    text: str
    answer: str