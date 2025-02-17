// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'

type Data = {
  message: string,
  pointsOfInterestPrompt: any,
  itinerary: any,
}

type Error = {
  message: string,
}

const GPT_KEY = process.env.GPT_API_KEY

const headers = {
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${GPT_KEY}`
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data | Error>
) {
  let days = 4, city = 'Rio'
  if (req.body) {
    let body = JSON.parse(req.body)
    city = body.userInput
  }

  // let basePrompt = `what is an ideal itinerary for ${days} days in ${city}?`
  let basePrompt = `I have having issues with my lab and I am not sure why. Can you please help me with this: ${city}? Please respond with a properly formatted list as to why this may have happened, in order of highest chance.`
  try {
    const response = await fetch('https://api.openai.com/v1/completions', {
      method: 'POST',
      headers,
      body: JSON.stringify({
        model: 'text-davinci-003',
        prompt: basePrompt,
        temperature: 0,
        max_tokens: 550
      })
    })
    const itinerary = await response.json()
    const pointsOfInterestPrompt = 'Extract all points in this text, with no additional words, separated by commas: ' + itinerary.choices[0].text

    res.status(200).json({
      message: 'success',
      pointsOfInterestPrompt,
      itinerary: itinerary.choices[0].text
    })

  } catch (err) {
    console.log('error: ', err)
  }
}
