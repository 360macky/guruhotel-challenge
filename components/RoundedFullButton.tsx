import React from 'react'

type RoundedFullButtonProps = {
  onClick?: () => void
  text: string
}

const RoundedFullButton = ({ onClick, text }: RoundedFullButtonProps) => {
  return (
    <button
      onClick={onClick}
      className="text-white bg-purple-dark hover:bg-purple-darkest focus:ring-4 focus:outline-none focus:ring-purple-light font-medium rounded-full px-4 py-2 dark:hover:bg-purple-darkest dark:focus:ring-blue-800 transition"
    >
      {text}
    </button>
  )
}

export default RoundedFullButton
