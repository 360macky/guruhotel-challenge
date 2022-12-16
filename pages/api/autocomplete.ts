import type { NextApiRequest, NextApiResponse } from 'next'

export type DataResponse = {
  suggestions: string[]
}

/**
 * Autocomplete handler
 * @description Fetches autocomplete suggestions from Yelp API
 * @param req NextApiRequest
 * @param res NextApiResponse<DataResponse>
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<DataResponse>
) {
  const { term } = req.body

  const options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization: `Bearer ${process.env.YELP_API_KEY}`,
    },
  }

  try {
    const response = await fetch(
      `https://api.yelp.com/v3/autocomplete?text=${term}`,
      options
    )
    const data = await response.json()
    const formattedTerms = await data.terms.map((item: any) => item.text)
    res.status(200).json({ suggestions: formattedTerms })
  } catch (error) {
    res.status(400).json({ suggestions: [] })
  }
}
