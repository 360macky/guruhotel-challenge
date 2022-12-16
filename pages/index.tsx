import React, { useState, useEffect, useCallback } from 'react'
import Head from 'next/head'
import { auditTime, Subject } from 'rxjs'
import { useDispatch, useSelector } from 'react-redux'
import Navbar from '../components/Navbar'
import classNames from 'classnames'
import { Business } from '../types/Business'

import { DataResponse } from './api/search'
import { appAction } from '../store/store'
import { appState } from '../store/store'

import Results from '../components/results'
import RoundedFullButton from '../components/RoundedFullButton'

type SEARCH_STATES = 'INITIAL' | 'LOADING' | 'DONE'

const onInputChange$ = new Subject<string>()
const MILISECONS_TO_COMPLETE_SEARCH = 1000

export default function Home() {
  const dispatch = useDispatch()
  const [resultsItems, setResultsItems] = useState<Business[]>([])
  const [searchState, setSearchState] = useState<SEARCH_STATES>('INITIAL')
  const [errors, setErrors] = useState<string[]>([])
  const [currentSuggestions, setCurrentSuggestions] = useState<string[]>([])
  const lastSearch = useSelector((state: appState) => state.lastSearch)
  const currentLocation = useSelector(
    (state: appState) => state.currentLocation
  )

  const isLocationCustom = useSelector(
    (state: appState) => state.isLocationCustom
  )

  const [isUserLocationTracked, setIsUserLocationTracked] =
    useState<boolean>(false)
  const latestResults = useSelector((state: appState) => state.latestResults)
  const locationRef = React.useRef<HTMLInputElement>(null)
  const searchButtonRef = React.useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (latestResults.length > 0) {
      setSearchState('DONE')
    }

    return () => {}
  }, [latestResults])

  useEffect(() => {
    const inputChangeSubscription = onInputChange$
      .pipe(auditTime(MILISECONS_TO_COMPLETE_SEARCH))
      .subscribe(async (term: string) => {
        if (term.length === 0) {
          setCurrentSuggestions([])
          return
        }
        const response = await fetch('/api/autocomplete', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ term }),
        })
        const { suggestions } = await response.json()
        setCurrentSuggestions(suggestions)
      })

    return () => {
      inputChangeSubscription.unsubscribe()
    }
  }, [])

  const handleSearch = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (currentLocation === '') {
      alert("You can't search without a location.")
      return
    }
    if (lastSearch === '') {
      alert("You can't search without a term to search.")
      return
    }
    setErrors([])
    setSearchState('LOADING')
    setCurrentSuggestions([])
    try {
      const searchResponse = await fetch('/api/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ term: lastSearch, location: currentLocation }),
      })
      const { results, message } = (await searchResponse.json()) as DataResponse

      if (message === 'LOCATION_NOT_FOUND' || message === 'NO_RESULTS') {
        if (!errors.includes(message)) {
          setErrors([...errors, message])
        }
      }

      setResultsItems(results)
      dispatch(appAction.latestResultsUpdate(results))
      setSearchState('DONE')
    } catch (error) {
      if (error instanceof Error) {
        setErrors([...errors, error.message])
      }
    } finally {
      setSearchState('DONE')
    }
  }

  const trackLocation = useCallback(() => {
    navigator.geolocation.getCurrentPosition(async (position) => {
      const { latitude, longitude } = position.coords
      const response = await fetch(
        `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
      )
      const data = await response.json()
      dispatch(appAction.currentLocationUpdate(`${data.city}`))
      setIsUserLocationTracked(true)
    })
  }, [dispatch])

  useEffect(() => {
    const checkLocationPermission = async () => {
      // Check if navigator.permissions is supported.
      if (!navigator.permissions) {
        return
      }
      const permission = await navigator.permissions.query({
        name: 'geolocation',
      })
      if (permission.state === 'granted') {
        setIsUserLocationTracked(true)
        if (!isLocationCustom) {
          trackLocation()
        }
      } else if (permission.state === 'denied') {
        setIsUserLocationTracked(false)
      }
    }

    checkLocationPermission()
    return () => {}
  }, [isLocationCustom, trackLocation])

  useEffect(() => {
    if (lastSearch !== '') {
      setResultsItems(latestResults)
    }

    return () => {}
  }, [dispatch, lastSearch, latestResults])

  return (
    <div>
      <Head>
        <title>Yelp Next App - GuruHotel Challenge</title>
        <meta name="description" content="GuruHotel Challenge" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <Navbar />
        <section className="px-2 py-4 flex flex-col md:justify-center md:items-center gap-y-4">
          <div
            className={classNames('flex flex-col transition-all duration-300', {
              'mt-[10rem]': searchState === 'INITIAL',
            })}
          >
            <form onSubmit={handleSearch}>
              <label className="mb-2 font-medium sr-only dark:text-white">
                Search
              </label>
              <div className="relative md:w-[760px]">
                <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                  <svg
                    aria-hidden="true"
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    ></path>
                  </svg>
                </div>
                <input
                  type="search"
                  id="default-search"
                  onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                    dispatch(appAction.lastSearchUpdate(event.target.value))
                    onInputChange$.next(event.target.value)
                  }}
                  value={lastSearch}
                  className="block w-full p-4 pl-10 border-purple-dark border-2 transition-all rounded-t-[2.2rem] bg-gray-50 focus:ring-purple-lighest focus:border-purple-lighest dark:text-white dark:focus:ring-purple-lighest dark:focus:border-purple-lighest outline-none focus:shadow-custom dark:bg-[black]"
                  placeholder="Search for restaurants and more"
                  required
                  autoComplete="off"
                />
                <button
                  type="submit"
                  className="text-white absolute right-2.5 bottom-2.5 bg-purple-dark hover:bg-purple-darkest focus:ring-4 focus:outline-none focus:ring-purple-light font-medium rounded-full px-4 py-2 dark:hover:bg-purple-darkest dark:focus:ring-blue-800 transition"
                  ref={searchButtonRef}
                >
                  Search
                </button>
              </div>
              {currentSuggestions.length > 0 && (
                <div className="bg-white dark:bg-almost-black dark:border-almost-black absolute shadow-xl md:w-[760px] border border-gray">
                  {currentSuggestions.map((suggestion, index) => (
                    <div
                      className="w-full hover:text-purple-dark p-2 pl-10 hover:bg-almost-white dark:hover:bg-[black] transition cursor-pointer dark:hover:text-purple-lighest"
                      onClick={() => {
                        dispatch(appAction.lastSearchUpdate(suggestion))
                        setCurrentSuggestions([])
                      }}
                      key={index}
                    >
                      {suggestion}
                    </div>
                  ))}
                </div>
              )}
            </form>
            <div className="flex items-center gap-x-3 md:gap-x-4 justify-end bg-purple-so-lighest md:w-[760px] rounded-b-[2.2rem] dark:bg-purple-dark">
              <p className="text-[1.1rem] dark:text-white">
                <span role={'img'}>📍</span> Location
              </p>
              <input
                type="text"
                ref={locationRef}
                value={currentLocation}
                onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                  dispatch(appAction.currentLocationUpdate(event.target.value))
                }
                className="w-48 md:w-auto p-3 pl-5 border-b-2 border-l-2 border-r-2 border-purple-dark text-[1.1rem] rounded-br-[2.2rem] focus:ring-purple-lighest focus:border-purple-lighest outline-none bg-white dark:bg-[black] transition"
                placeholder="City"
                onFocus={() => dispatch(appAction.isLocationCustomUpdate(true))}
              />
            </div>
            {errors.length > 0 && (
              <div className={'p-4 md:w-[760px] rounded-full'}>
                {errors.map((error, index) => {
                  return (
                    <div key={index} className="text-center">
                      {(error === 'LOCATION_NOT_FOUND' ||
                        error === 'NO_RESULTS') && (
                        <div className="flex flex-col gap-y-2 items-center">
                          <p className="text-red font-bold dark:text-red-light">
                            We can not found any business near your location!
                          </p>
                          <button
                            className="bg-purple-dark rounded-full p-2 px-4 text-white font-bold"
                            onClick={() => {
                              if (locationRef.current) {
                                locationRef.current.focus()
                              }
                            }}
                          >
                            Write a new location
                          </button>
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            )}
          </div>

          <div>
            {searchState === 'LOADING' && (
              <p className="dark:text-purple-lighest text-purple-dark text-[1.5rem] font-bold">
                <span role={'img'}>🔍</span> Loading...
              </p>
            )}
          </div>
          <div
            className={classNames(
              'flex flex-col justify-center items-center gap-y-3 md:w-[500px] text-center transition',
              {
                hidden: isUserLocationTracked,
              }
            )}
          >
            <h1 className="text-2xl">🌍 Where are you now?</h1>
            <p>
              <span role={'img'}>☝️</span> Allow access to your location if you
              want to use the city from where you are in the search. Or just
              write your city in{' '}
              <b>
                <span role={'img'}>📍</span> Location
              </b>
              .
            </p>
            <RoundedFullButton
              text="Allow location access"
              onClick={() => trackLocation()}
            />
          </div>

          <Results resultsItems={resultsItems} />
        </section>
      </main>
    </div>
  )
}
