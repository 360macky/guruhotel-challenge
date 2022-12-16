import React from 'react'
import Link from 'next/link'

const Navbar = () => {
  return (
    <header className="flex justify-center items-center py-2 sticky top-0 z-10">
      <Link href="/">
        <h1 className="text-[2rem] font-bold text-purple-darkest dark:text-purple-lighest">
          Yelp Next App
        </h1>
      </Link>
    </header>
  )
}

export default Navbar
