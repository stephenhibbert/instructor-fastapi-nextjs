import instructor

from api.models import Question, UserInput
from fastapi import FastAPI
import instructor
from anthropic import AsyncAnthropicBedrock
from typing import Iterable
from fastapi.middleware.cors import CORSMiddleware

from fastapi import FastAPI
from fastapi.responses import StreamingResponse

client = instructor.from_anthropic(
    AsyncAnthropicBedrock(), 
    mode=instructor.Mode.ANTHROPIC_JSON,
    max_tokens=1024
)
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/api/hello/{message}")
async def endpoint_function(message: str):
    response = await client.chat.completions.create(
        model="anthropic.claude-3-sonnet-20240229-v1:0",
        stream=True,
        response_model=Iterable[Question],
        messages=[
            {"role": "user", "content": f"Create a thoughtful podcast interview question based on this persons bio: `{message}`"},
        ],
    )

    async def generate():
        async for chunk in response:
            if chunk is not None:
                yield f"data: {chunk.model_dump_json()}\n\n"

        yield "data: [DONE]\n\n"
    
    return StreamingResponse(generate(), media_type="text/event-stream")