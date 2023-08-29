"use client"
import Image from 'next/image'
import { Inter } from "next/font/google";
import { OpenAI } from "openai";

import { useState } from "react";
import {log} from "next/dist/server/typescript/utils";
require('dotenv').config()

const inter = Inter({subsets:['latin'] });

export default function Home() {
    const [prompt, setPrompt] = useState('');
    const [responses, setResponses] = useState([]);
    const [loading, setLoading] = useState(false);

    const sendMessage = async () => {
        const openai = new OpenAI({
            apiKey: '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',
            dangerouslyAllowBrowser: true,
    })
        setLoading(true);

        setResponses(prevResponses => [...prevResponses, prompt]);

        const completion= await openai.completions.create({
            model: "text-davinci-003",
            prompt: prompt,
            temperature: 0.7,
            max_tokens: 1024,
        });

        setPrompt('')
        setLoading(false);
        setResponses(prevResponses => [...prevResponses, completion.choices[0].text]);
    }
  return (
    <main>
      <div className="container mx-auto flex justify-center">
          <div className="w-1/3 mt-20">
          <h2 className="text-5xl text-center text-white mb-5">MY CHAT APP :)</h2>
              <div className="border rounded-md">
                  <div className="border-b p-6">
                      <p className="text-md text-white text-center">Your chat history goes here:</p>
                  </div>
                  <div className="border-b p-6">

                      {responses && responses.map((item, index) => {
                          return(
                              <div key={index} className="bg-zinc-800 p-3 rounded-md flex mb-3">
                                  <p className="text-xs text-white mr-2">[{index + 1}] </p>
                                  <p className="text-white text-sm">{item}</p>
                              </div>
                          )
                      })}

                      {loading && (
                          <p className="text-white text-md text-center">Loading...</p>
                      )}

                  </div>
                  <div className="border-t p-6 flex">
                      <input onChange={(e) => { setPrompt(e.target.value) }} value={prompt} type="text" className="w-8/12 bg-zinc-600 px-4 mr-0.5 py-2 rounded-tl-md rounded-bl-md text-white" placeholder="Your message goes here" />
                    <button onClick={() => { sendMessage() }} type="button" className="w-4/12 bg-zinc-700 text-white rounded-tr-md rounded-br-md">Send</button>
                  </div>
              </div>
          </div>
      </div>
    </main>
  )
}
