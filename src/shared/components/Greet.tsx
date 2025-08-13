import React from 'react'

type GreetProps = {
  name: string
}

const Greet: React.FC<GreetProps> = ({ name }) => {
  if (name) return <h1>Hello {name}!</h1>
  return <div>Greet</div>
}

export default Greet
