"use client"

import { useEffect, useState } from 'react'
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

const data = [
  { year: "2010", sales: 12 },
  { year: "2011", sales: 22 },
  { year: "2012", sales: 20 },
  { year: "2013", sales: 31 },
  { year: "2014", sales: 35 },
  { year: "2015", sales: 45 },
  { year: "2016", sales: 50 },
  { year: "2017", sales: 63 },
  { year: "2018", sales: 68 },
  { year: "2019", sales: 77 },
  { year: "2020", sales: 85 },
  { year: "2021", sales: 87 },
  { year: "2022", sales: 90 },
  { year: "2023", sales: 92 },
]

export default function Achievements() {
  const [started, setStarted] = useState(false)

  useEffect(() => {
    const statsSection = document.querySelector(".stats")
    const numbers = document.querySelectorAll(".number")

    const handleScroll = () => {
      if (window.scrollY >= 1690.4176025390625) {
        if (!started) {
          numbers.forEach((num) => startCount(num))
        }
        setStarted(true)
      }
    }

    window.addEventListener('scroll', handleScroll)

    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [started])

  const startCount = (el: Element) => {
    const goal = parseInt(el.getAttribute('data-goal') || '0', 10)
    let current = 0

    const countInterval = setInterval(() => {
      current += 1
      el.textContent = current.toString()
      if (current === goal) {
        clearInterval(countInterval)
      }
    }, 3000 / goal)
  }

  return (
    <div className="py-16 stats">
      <h2 className="text-center text-4xl md:text-5xl font-medium tracking-wide text-gray-800 dark:text-gray-100 mb-8">
        Our achievements
      </h2>
      <div className="container mx-auto px-4">
        <div className="flex justify-center items-center flex-wrap gap-8 mb-12">
          {[1, 2, 3].map((_, index) => (
            <div key={index} className="text-center">
              <div className="flex justify-center items-center my-4 mx-4">
                <div
                  className="number text-4xl bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-blue-400 to-indigo-300 transition-all duration-300 ease-in-out"
                  data-goal="85"
                >
                  0
                </div>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512" width="30" height="30">
                  <path
                    d="M374.6 118.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-320 320c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0l320-320zM128 128A64 64 0 1 0 0 128a64 64 0 1 0 128 0zM384 384a64 64 0 1 0 -128 0 64 64 0 1 0 128 0z"
                    fill="url(#gradient)"
                  />
                  <defs>
                    <linearGradient id="gradient" x1="0%" y1="0%" x2="100%">
                      <stop offset="40%" stopColor="#afbbff" />
                      <stop offset="80%" stopColor="#d9a755" />
                    </linearGradient>
                  </defs>
                </svg>
              </div>
              <p className="text-xl text-muted-foreground uppercase -mt-2">
                Happy and satisfied customers
              </p>
            </div>
          ))}
        </div>
        <SalesChart />
      </div>
    </div>
  )
}

function SalesChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Selling Overview</CardTitle>
        <CardDescription>Sales percentage from 2010 to 2023</CardDescription>
      </CardHeader>
      <CardContent className="pb-4">
        <div className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <XAxis
                dataKey="year"
                stroke="#888888"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                stroke="#888888"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `${value}%`}
              />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="sales"
                stroke="#ff8800"
                strokeWidth={3}
                dot={{ fill: "#d9a755", r: 6 }}
                activeDot={{ r: 8, fill: "#ff8800" }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}