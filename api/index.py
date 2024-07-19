import instructor

from api.models import Question, UserInput
from fastapi import FastAPI
import instructor
from anthropic import AsyncAnthropicBedrock

client = instructor.from_anthropic(
    AsyncAnthropicBedrock(), 
    mode=instructor.Mode.ANTHROPIC_JSON,
    max_tokens=1024
)
app = FastAPI()

@app.post("/api/hello", response_model=Question)
async def endpoint_function(data: UserInput) -> Question:
    user_detail = await client.chat.completions.create(
        model="anthropic.claude-3-sonnet-20240229-v1:0",
        response_model=Question,
        messages=[
            {"role": "user", "content": f"Create a thoughtful podcast interview question based on this persons bio: `{data.text}`"},
        ],
    )
    return user_detail