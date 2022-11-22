/*


{
  "result": {
    "id": "cmpl-5x3jAwk2YwkKUmFxmHhCM8YIzDSPv",
    "object": "text_completion",
    "created": 1664757364,
    "model": "text-davinci-002",
    "choices": [
      {
        "text": " a  student\n\nI am a student.",
        "index": 0,
        "logprobs": null,
        "finish_reason": "stop"
      }
    ],
    "usage": {
      "prompt_tokens": 3,
      "completion_tokens": 10,
      "total_tokens": 13
    }
  }
}


    model: 'text-davinci-002',
    prompt: req.body.text,
    temperature: 0.7,
    top_p: 1,
    frequency_penalty: 0,
    presence_penalty: 0,
    max_tokens: 256,

*/

// what should be the response type?
// a: type Response = {
//   result: {
//     id: string,
//     object: string,
//     created: number,
//     model: string,
//     choices: {
//       text: string,
//       index: number,
//       logprobs: null,
//       finish_reason: string,
//     }[],
//     usage: {
//       prompt_tokens: number,
//       completion_tokens: number,
//       total_tokens: number,
//     },
//   },
// };

// should we use zod to validate the response?
// a: yes, we should use zod to validate the response

// what should be the input type?
// a: type Input = {
//   prompt: string,
//   max_tokens: number,
//   temperature: number,
//   top_p: number,
//   frequency_penalty: number,
//   presence_penalty: number,
//   stop: string[],
// };

// should we use zod to validate the input?
// a: yes, we should use zod to validate the input

import type { NextApiRequest, NextApiResponse } from 'next';
import { Configuration, OpenAIApi } from 'openai';

const completion = async (
  req: NextApiRequest,
  res: NextApiResponse,
  apiKey: string
) => {
  const configuration = new Configuration({
    apiKey,
  });

  const openai = new OpenAIApi(configuration);

  const completion = await openai.createCompletion({
    model: 'text-davinci-002',
    prompt: req.body.text,
    temperature: 0.7,
    top_p: 1,
    frequency_penalty: 0,
    presence_penalty: 0,
    max_tokens: 256,
  });

  res.status(200).json({ result: completion.data });
};

export default completion;
