'use client';
// import React, { useState } from 'react';
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import type { ParamsOption, RequestBodyOption } from "openapi-fetch";
import type { paths, components } from "../lib/schema"

import { fetchEventSource } from "@microsoft/fetch-event-source";
import React, { useEffect, useState } from "react";

export type UserInput = components["schemas"]["UserInput"];

function StreamComponent() {
  const [messages, setMessages] = useState([]);
  const [userInput, setUserInput] = useState<UserInput>({ text: "" });
  const [eventSource, setEventSource] = useState<EventSource | null>(null);
  
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!userInput) return;
    try {

      // const baseUrl = process.env.NODE_ENV === 'development' ? 'https://127.0.0.1:8000' : 'https://instagraph-fast-api.onrender.com';
      // const url = `${baseUrl}/api/get_graph/${encodeURIComponent(userInput)}`;
      const url = `http://localhost:3000/api/hello/${encodeURIComponent(userInput.text)}`;

      const ees = new EventSource(url);
      setEventSource(ees);
      
      ees.onmessage = (event) => {
        if (event.data === '[DONE]') {
          ees.close();
        } else {
            const data = JSON.parse(event.data);
            console.log(data)
        }
      };

      ees.onerror = (event) => {
        ees.close();
      }

    } catch (error) {
      console.error(error);
    } finally {
      
    }
  };

  const handleCancel = () => {
    if (eventSource) {
      eventSource.close();
      setEventSource(null);
    }
  };

  return (
    // <div>
    //   {messages.map((msg, index) => (
    //     <div key={index}>{msg}</div>
    //   ))}
    // </div>
    //   return (
    <div className="flex h-screen bg-gray-100">
      <div className="flex-1 p-6">
        <Card>
          <CardHeader>
            <CardTitle>Input Text</CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              placeholder="Paste your text here..."
              value={userInput.text}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setUserInput({ text: e.target.value })}
              className="mb-4 h-64"
            />
            <Button onClick={handleSubmit}>Generate Questions</Button>
          </CardContent>
        </Card>
      </div>
      <div className="flex-1 p-6">
        <Card>
          <CardHeader>
            <CardTitle>Podcast Interview Questions</CardTitle>
          </CardHeader>
          <CardContent>
            {/* {questions.length > 0 ? (
              <ul className="list-disc pl-6">
                {questions.map((question) => (
                  <li key={question.id} className="mb-2">{question.text}</li>
                ))}
              </ul>
            ) : (
              <p>Generate questions to see them here.</p>
            )} */}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default StreamComponent;

// import createClient from "openapi-fetch";
// const client = createClient<paths>({ baseUrl: "http://localhost:3000" });

// export type Question = components["schemas"]["Question"];
// export type UserInput = components["schemas"]["UserInput"];

// export default function Home() {
//   const [userInput, setUserInput] = useState<UserInput>({ text: "" });
//   const [questions, setQuestions] = useState<Question[]>([]);

  

//   const generateQuestions = async () => {

//     const {
//       data, // only present if 2XX response
//       error, // only present if 4XX or 5XX response
//     } = await client.POST("/api/hello", {
//       body: {
//         text: userInput.text,
//       } as UserInput,
//     });
//     console.log(data)
//     if (data) {
//       // append to the questions
//       setQuestions([...questions, {id: data.id, text: data.text}])
//     }
//   };

//   return (
//     <div className="flex h-screen bg-gray-100">
//       <div className="flex-1 p-6">
//         <Card>
//           <CardHeader>
//             <CardTitle>Input Text</CardTitle>
//           </CardHeader>
//           <CardContent>
//             <Textarea
//               placeholder="Paste your text here..."
//               value={userInput.text}
//               onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setUserInput({ text: e.target.value })}
//               className="mb-4 h-64"
//             />
//             <Button onClick={generateQuestions}>Generate Questions</Button>
//           </CardContent>
//         </Card>
//       </div>
//       <div className="flex-1 p-6">
//         <Card>
//           <CardHeader>
//             <CardTitle>Podcast Interview Questions</CardTitle>
//           </CardHeader>
//           <CardContent>
//             {questions.length > 0 ? (
//               <ul className="list-disc pl-6">
//                 {questions.map((question) => (
//                   <li key={question.id} className="mb-2">{question.text}</li>
//                 ))}
//               </ul>
//             ) : (
//               <p>Generate questions to see them here.</p>
//             )}
//           </CardContent>
//         </Card>
//       </div>
//     </div>
//   );
// };
