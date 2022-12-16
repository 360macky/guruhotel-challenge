import React, { useEffect, useState } from 'react'
import { ApolloClient, InMemoryCache, gql } from '@apollo/client'
import classNames from 'classnames'

import { BusinessDetails } from '../../types/Business'
import Navbar from '../components/Navbar'
import StarFilled from '../../assets/star-filled.svg'
import StarEmpty from '../../assets/star-empty.svg'

type ResultIdProps = {
  business: BusinessDetails
  resultsSeenConsole: any
}

const days = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
]

const formatHour = (unformattedHour: string) => {
  const hour = unformattedHour.slice(0, 2)
  const minutes = unformattedHour.slice(2, 4)
  const ampm = parseInt(hour) >= 12 ? 'pm' : 'am'
  const formattedHour =
    parseInt(hour) > 12 ? parseInt(hour) - 12 : parseInt(hour)
  return `${formattedHour}:${minutes} ${ampm}`
}

const ResultId = ({ business }: ResultIdProps) => {
  const [hoursHidden, setHoursHidden] = useState<boolean>(true)

  useEffect(() => {
    console.log(business)
    const results_ids = JSON.parse(localStorage.getItem('results_ids') || '[]')
    if (!results_ids.includes(business.id)) {
      results_ids.push(business.id)
      localStorage.setItem('results_ids', JSON.stringify(results_ids))
    }
    return () => {}
  }, [business])

  const isBusinessHourAvailable = business.hours && business.hours.length > 0

  return (
    <div className="flex flex-col gap-y-4">
      <Navbar />
      <div className="dark:bg-purple-darkest bg-almost-white rounded-xl w-11/12 self-center md:w-[760px] mb-4">
        <div>
          <img
            src={business.photos[0]}
            alt={business.name}
            className="rounded-xl object-cover w-full h-48 md:h-80"
          />
        </div>
        <div className="p-6 py-8 flex flex-col gap-y-4 md:flex-row md:items-start md:justify-between">
          <div className="flex flex-col md:gap-y-2">
            <h1 className="text-3xl font-bold">{business.name}</h1>
            {isBusinessHourAvailable ? (
              <p
                className={classNames('text-xl font-bold', {
                  'text-green dark:text-green-light':
                    business.hours[0].is_open_now,
                })}
              >
                {business.hours[0].is_open_now ? 'Open now' : 'Closed'}
              </p>
            ) : (
              <p className={classNames('text-xl font-bold')}>
                Hours not available
              </p>
            )}
            <p>{business.location.formatted_address}</p>
            <div className="flex gap-x-1 dark:bg-transparent h-8 flex-row items-center rounded-full w-auto self-start">
              {[...Array(Math.floor(business.rating))].map((_e, i) => (
                <img
                  src={StarFilled.src}
                  key={i}
                  alt=""
                  className="w-6 dark:invert"
                />
              ))}
              {[...Array(5 - Math.floor(business.rating))].map((e, i) => (
                <img
                  src={StarEmpty.src}
                  key={i}
                  alt=""
                  className="w-6 dark:invert"
                />
              ))}
              <p className="ml-2 bg:text-white font-bold">
                / {business.review_count} reviews
              </p>
            </div>
            {business.price && (
              <p className="text-xl font-extrabold text-green dark:text-green-light">
                Price level: {business.price}
              </p>
            )}
          </div>
          <div className="flex flex-col justify-start md:w-[300px] md:gap-y-4">
            {business.phone && (
              <a
                href={`tel:${business.phone}`}
                className="flex gap-x-2 items-center dark:bg-white rounded-lg px-4 p-2 dark:text-purple-darkest font-bold self-start md:self-stretch active:ring ring-purple-light bg-purple-dark text-white"
              >
                <span role={'img'}>☎️</span> Call {business.display_phone}
              </a>
            )}
            <a
              href={`https://www.google.com/maps/search/?api=1&query=${business.coordinates.latitude},${business.coordinates.longitude}`}
              target={'_blank'}
              className="flex gap-x-2 items-center dark:bg-white rounded-lg px-4 p-2 dark:text-purple-darkest font-bold self-start md:self-stretch active:ring ring-purple-light bg-purple-dark text-white"
              rel="noreferrer"
            >
              <span role={'img'}>📍</span> Open in Google Maps
            </a>
            {isBusinessHourAvailable && (
              <>
                <h2 className="text-[1.4rem] font-bold pt-4 pb-2 dark:text-purple-so-lighest">
                  Hours open
                </h2>
                <div className="flex flex-col gap-y-3">
                  {business.hours.map((hour: any, index: number) => (
                    <div className="flex flex-col gap-y-2" key={index}>
                      <div className="flex gap-x-2 md:items-center">
                        <p className="font-bold">
                          Hours type: {hour.hours_type}
                        </p>
                      </div>
                      <button
                        onClick={() => setHoursHidden(!hoursHidden)}
                        className="flex gap-x-2 items-center dark:bg-white rounded-lg px-4 p-2 dark:text-purple-darkest font-bold self-start md:self-stretch active:ring ring-purple-light bg-purple-dark text-white"
                      >
                        <span role={'img'}>🕑</span> Check hours
                      </button>

                      {!hoursHidden && (
                        <div className="flex flex-col gap-y-2">
                          {hour.open.map((open: any, index: number) => (
                            <div
                              className="flex gap-x-2 md:items-center"
                              key={index}
                            >
                              <p className="font-bold text-purple-dark">
                                {days[open.day]}
                              </p>
                              <p>
                                {formatHour(open.start)} -{' '}
                                {formatHour(open.end)}
                              </p>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </>
            )}
            <h2 className="text-[1.4rem] font-bold pt-4 pb-2 dark:text-purple-so-lighest">
              Reviews
            </h2>
            <div className="flex flex-col gap-y-3">
              {business.reviews.length > 0 ? (
                business.reviews.map((review: any) => (
                  <div key={review.id} className="flex flex-col gap-y-2">
                    <div className="flex gap-x-2 md:items-center">
                      <div className="flex flex-col">
                        <p className="font-bold">From {review.user.name}</p>
                        <p>{review.text}</p>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p>This business does not have reviews currently</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export const getServerSideProps = async (context: any) => {
  const { result_id } = context.params

  const client = new ApolloClient({
    uri: 'https://api.yelp.com/v3/graphql',
    cache: new InMemoryCache(),
    headers: {
      Authorization: `Bearer ${process.env.YELP_API_KEY}`,
      'Accept-Language': 'en-US',
    },
  })

  const GET_BUSINESS = gql`
    query GetBusiness($id: String!) {
      business(id: $id) {
        id
        name
        photos
        location {
          formatted_address
        }
        review_count
        rating
        display_phone
        phone
        hours {
          hours_type
          is_open_now
          open {
            day
            end
            is_overnight
            start
          }
        }
        reviews(limit: 5) {
          user {
            id
            image_url
            name
            profile_url
          }
          rating
          text
          time_created
          id
        }
        coordinates {
          latitude
          longitude
        }
        price
      }
    }
  `

  const { data } = await client.query({
    query: GET_BUSINESS,
    variables: { id: result_id },
  })

  const { business } = await data

  return {
    props: {
      business,
    },
  }
}

export default ResultId
