import type { NextApiRequest, NextApiResponse } from 'next'
import { ApolloClient, InMemoryCache, gql, ApolloError } from '@apollo/client'
import { Business } from '../../types/Business'

export type DataResponse = {
  results: Business[]
  message: string
}

/**
 * Search handler
 * @description Fetches a businesses search from Yelp API
 * @param req NextApiRequest
 * @param res NextApiResponse<DataResponse>
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<DataResponse>
) {
  const { term, location } = req.body

  const client = new ApolloClient({
    uri: 'https://api.yelp.com/v3/graphql',
    cache: new InMemoryCache(),
    headers: {
      Authorization: `Bearer ${process.env.YELP_API_KEY}`,
      'Accept-Language': 'en-US',
    },
  })

  const GET_BUSINESS = gql`
    query getBusinesses($term: String!, $location: String!) {
      search(location: $location, term: $term, sort_by: "distance", limit: 10) {
        business {
          name
          id
          review_count
          rating
          photos
          phone
          display_phone
          location {
            address1
            city
          }
        }
      }
    }
  `

  let results: Business[] = []
  try {
    const { data } = await client.query({
      query: GET_BUSINESS,
      variables: { term, location },
    })
    results = (await data.search.business) as any[]
    res.status(200).json({
      results,
      message: results.length === 0 ? 'NO_RESULTS' : 'SUCCESS',
    })
  } catch (error) {
    if (error instanceof Error) {
      const apolloErrorCode = (error as ApolloError).graphQLErrors[0].extensions
        .code as string
      res.status(404).json({ results, message: apolloErrorCode })
    } else {
      res.status(500).json({ results, message: 'UNKNOWN_ERROR' })
    }
  } finally {
    client.stop()
  }
}
