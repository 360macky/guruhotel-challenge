import React from 'react'

type WideActionButtonProps = {
  href: string
  text: string
  icon: string
  target: '_blank' | '_self'
}

const WideActionButton = ({
  href,
  text,
  icon,
  target,
}: WideActionButtonProps) => {
  return (
    <a
      href={href}
      target={target}
      className="flex gap-x-2 items-center dark:bg-white rounded-lg px-4 p-2 dark:text-purple-darkest font-bold self-start md:self-stretch active:ring ring-purple-light bg-purple-dark text-white w-full md:w-auto"
      rel="noreferrer"
    >
      <span role={'img'}>{icon}</span> {text}
    </a>
  )
}

export default WideActionButton
