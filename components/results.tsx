import React from 'react'
import Link from 'next/link'

import StarFilled from 'assets/star-filled.svg'
import StarEmpty from 'assets/star-empty.svg'
import { Business } from '../types/Business'

type ResultItemProps = {
  id: string
  image?: string
  name: string
  ubication?: string
  reviews?: number
  rating?: any
  displayPhone?: string
  phone?: string
  address?: string
  reviewCount?: number
  alreadyReviewed: boolean
}

const ResultItem = (props: ResultItemProps) => {
  return (
    <div className="max-w-sm md:w-[22rem] bg-white border border-gray rounded-xl shadow-sm hover:shadow-lg dark:bg-purple-darkest hover:scale-105 transition dark:border-transparent">
      <div className="bg-purple-dark rounded">
        <img
          className="rounded-t-lg object-cover w-full h-40"
          src={props.image}
          alt={props.name}
        />
      </div>
      <div className="p-5 flex flex-col gap-y-3">
        <div className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white flex flex-row justify-between">
          <h2>{props.name}</h2>
          <span role={'img'} title="Business reviewed">
            {props.alreadyReviewed ? '👁' : ''}
          </span>
        </div>
        <p className="font-normal">
          <span role={'img'}>📍</span> {props.address}
        </p>
        <div className="flex gap-x-1 dark:bg-transparent h-8 flex-row items-center rounded-full w-auto self-start">
          {[...Array(Math.floor(props.rating))].map((e, index: number) => (
            <img
              src={StarFilled.src}
              key={index}
              alt="Star"
              className="w-6 dark:invert"
            />
          ))}
          {[...Array(5 - Math.floor(props.rating))].map((e, index: number) => (
            <img
              src={StarEmpty.src}
              key={index}
              alt="Star"
              className="w-6 dark:invert"
            />
          ))}
          <p className="ml-2 bg:text-white font-bold">
            {' '}
            / {props.reviewCount} reviews
          </p>
        </div>
        <p className="flex flex-row justify-between md:flex-row-reverse font-normal gap-x-2">
          <Link
            href={`/results/${props.id}`}
            className="bg-purple-dark text-white p-1 px-6 rounded-full text-[1rem] active:ring focus:ring ring-purple-lighest font-bold dark:bg-white dark:text-purple-dark"
          >
            Review
          </Link>
          <Link
            href={`tel:${props.phone}`}
            className="bg-gray text-purple-dark p-1 px-6 rounded-full text-[1rem] active:ring focus:ring ring-purple-lighest font-bold dark:bg-purple-dark dark:text-white"
          >
            Call
          </Link>
        </p>
      </div>
    </div>
  )
}

type ResultsProps = {
  resultsItems: Business[]
}

const Results = ({ resultsItems }: ResultsProps) => {
  return (
    <div
      className="p-5 flex flex-col md:w-[760px] md:justify-between md:flex-row md:flex-wrap gap-y-5"
      id="search-results"
    >
      {resultsItems.map((result: any) => (
        <ResultItem
          key={result.id}
          id={result.id}
          name={result.name}
          image={result.photos[0]}
          address={`${result.location.address1}, ${result.location.city}`}
          displayPhone={result.display_phone}
          phone={result.display_phone}
          reviewCount={result.review_count}
          rating={result.rating}
          alreadyReviewed={JSON.parse(
            localStorage.getItem('results_ids') || '[]'
          ).includes(result.id)}
        />
      ))}
    </div>
  )
}

export default Results
