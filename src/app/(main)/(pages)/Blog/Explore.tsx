"use client"
import Container from '@/app/components/Container'
import EftarRamdanCard from '@/app/components/EftarRamdanCard'
import { exploreEftar } from '@/constants'
import { useState } from 'react'

const Explore = () => {
  const [active, setActive] = useState("eftar-2024")
  return (
    <div className='py-8 md:py-12 lg:py-16 '>
      <h2 className="text-2xl font-bold tracking-tight md:text-3xl lg:text-4xl text-center">Latest Ramdan Events</h2>
      <div className='pt-8 md:pt-12 lg:pt-16  flex lg:flex-row flex-col'>
        <Container className='flex gap-2 flex-wrap lg:flex-nowrap'>
          {exploreEftar.map((eftar, index) => (
            <EftarRamdanCard
              key={eftar.id}
              {...eftar}
              index={index}
              active={active}
              handleActive={setActive}
            />
          ))}
        </Container>
      </div>
    </div>
  )
}

export default Explore
