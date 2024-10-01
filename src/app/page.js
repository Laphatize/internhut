'use client'
import { useEffect, useState } from 'react';
import Image from 'next/image';
import { formatDistanceToNow } from 'date-fns';

export default function Home() {
  const [listings, setListings] = useState([]);

  useEffect(() => {
    fetch('https://raw.githubusercontent.com/SimplifyJobs/Summer2025-Internships/refs/heads/dev/.github/scripts/listings.json')
      .then(response => response.json())
      .then(data => setListings(data.reverse()))
      .catch(error => console.error('Error fetching data:', error));
  }, []);

  return (
    <div>
      <div className="max-w-screen-lg mx-auto mt-10">
        <div className="flex rounded-full border-neutral-800 border bg-neutral-800 text-white px-20 py-2 rounded-md">
          <div className=" items-center">
            <h1 className="text-3xl font-bold">internhut <span className="text-blue-500 text-sm">BETA</span></h1>
          </div>
          <div className="ml-auto flex items-center text-sm">
            <button className="bg-blue-600 text-white px-4 py-1 rounded-full">
              Login
            </button>
            <button className="ml-2 border border-blue-600 text-blue-500 px-4 py-1 rounded-full">
              Signup
            </button>
          </div>
        </div>

        <div className="mx-auto px-20 py-10 rounded-md">
          <div>
            <h1 className="text-xl">Recently Listed</h1>
            <div className="grid grid-cols-2 gap-4 w-full">
              {listings.map((listing, index) => (
                <div key={index} className="flex mt-2">
                  <div>
                    <img 
                      src={`https://logo.clearbit.com/${listing.company_name.toLowerCase().replace(/\s+/g, '')}.com`} 
                      alt={listing.company_name} 
                      width={45} 
                      height={45} 
                      onError={(e) => e.target.src = 'https://placehold.co/45x45'} // Fallback image
                    />
                  </div>
                  <div className="flex flex-col ml-2">
                    <h1>{listing.title}</h1>
                    <p>{listing.company_name}</p>
                    <p>{listing.locations.join(', ')}</p>
                    <p>{listing.terms.join(', ')}</p>
                    <a href={listing.url} className="text-blue-500">Apply Here</a>
                    <p>posted {formatDistanceToNow(new Date(listing.date_posted * 1000))} ago</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
