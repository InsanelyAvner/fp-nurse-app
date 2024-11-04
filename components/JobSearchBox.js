// components/JobSearchBox.js

'use client'

import React, { useState } from 'react'
import { Search, Briefcase, MapPin, Calendar, Clock, DollarSign } from 'lucide-react'
import { Button } from "@/components/ui/button"

export default function JobSearchBox() {
  const [searchTerm, setSearchTerm] = useState('')
  const [location, setLocation] = useState('')
  const [jobType, setJobType] = useState('')
  const [date, setDate] = useState('')
  const [payRate, setPayRate] = useState('')

  const handleSearch = (e) => {
    e.preventDefault()
    // Implement your search logic here
    console.log({ searchTerm, location, jobType, date, payRate })
  }

  return (
    <div className="bg-white bg-opacity-90 rounded-lg shadow-md p-6 flex flex-col md:flex-row items-center justify-between">
      <form className="w-full flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-4" onSubmit={handleSearch}>
        {/* Search Input */}
        <div className="flex items-center w-full md:w-auto">
          <Search className="text-gray-500 mr-2" />
          <input
            type="text"
            placeholder="Search jobs..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full md:w-64 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#9d2235]"
          />
        </div>

        {/* Location Filter */}
        <div className="flex items-center w-full md:w-auto">
          <MapPin className="text-gray-500 mr-2" />
          <input
            type="text"
            placeholder="Location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="w-full md:w-48 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#9d2235]"
          />
        </div>

        {/* Job Type Filter */}
        <div className="flex items-center w-full md:w-auto">
          <Briefcase className="text-gray-500 mr-2" />
          <select
            value={jobType}
            onChange={(e) => setJobType(e.target.value)}
            className="w-full md:w-40 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#9d2235]"
          >
            <option value="">Job Type</option>
            <option value="full-time">Full-Time</option>
            <option value="part-time">Part-Time</option>
            <option value="contract">Contract</option>
            <option value="temporary">Temporary</option>
          </select>
        </div>

        {/* Date Filter */}
        <div className="flex items-center w-full md:w-auto">
          <Calendar className="text-gray-500 mr-2" />
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full md:w-40 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#9d2235]"
          />
        </div>

        {/* Pay Rate Filter */}
        <div className="flex items-center w-full md:w-auto">
          <DollarSign className="text-gray-500 mr-2" />
          <input
            type="number"
            placeholder="Min Pay Rate ($/hr)"
            value={payRate}
            onChange={(e) => setPayRate(e.target.value)}
            className="w-full md:w-40 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#9d2235]"
          />
        </div>

        {/* Search Button */}
        <Button type="submit" className="w-full md:w-auto">
          Search
        </Button>
      </form>
    </div>
  )
}
