'use client'
import { useEffect, useState } from 'react';
import Image from 'next/image';
import { formatDistanceToNow } from 'date-fns';

const ITEMS_PER_PAGE = 10;
const CACHE_SYNC_INTERVAL = 60000; // 1 minute in milliseconds

export default function Home() {
  const [listings, setListings] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false); // State for modal visibility

  const fetchListings = () => {
    fetch('https://raw.githubusercontent.com/SimplifyJobs/Summer2025-Internships/refs/heads/dev/.github/scripts/listings.json')
      .then(response => response.json())
      .then(data => {
        const reversedData = data.reverse();
        setListings(reversedData);
        localStorage.setItem('listings', JSON.stringify(reversedData));
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
        setLoading(false);
      });
  };

  useEffect(() => {
    const cachedListings = localStorage.getItem('listings');
    if (cachedListings) {
      setListings(JSON.parse(cachedListings));
      setLoading(false);
    } else {
      fetchListings();
    }

    const intervalId = setInterval(() => {
      fetchListings();
    }, CACHE_SYNC_INTERVAL);

    return () => clearInterval(intervalId); // Cleanup interval on component unmount
  }, []);

  const totalPages = Math.ceil(listings.length / ITEMS_PER_PAGE);
  const currentListings = listings.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleLoginClick = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div>
      <div className="max-w-screen-lg mx-auto mt-10">
        <div className="flex rounded-full border-neutral-800 border bg-neutral-800 text-white px-20 py-2 rounded-md">
          <div className=" items-center">
            <h1 className="text-3xl font-bold">internhunt <span className="text-blue-500 text-sm">BETA</span></h1>
          </div>
          <div className="ml-auto flex items-center text-sm ">
            <button onClick={handleLoginClick} className="bg-blue-600 text-white px-4 py-1  flex  items-center rounded-full">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6 mr-1">
                <path stroke-linecap="round" stroke-linejoin="round" d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
              </svg>
              Login
            </button>
            <div className='w-full'></div>
            <button className="border border-blue-600 text-blue-500 px-4 py-1 rounded-full hidden">
              Signup
            </button>
          </div>
        </div>

        {/* Login Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 flex items-center justify-center z-50 bg-neutral-900 bg-opacity-50">
                        <div className="bg-neutral-800 border border-neutral-700 p-6 rounded-md shadow-md w-1/4">
            <h1>auth coming soon</h1>
            <button onClick={handleCloseModal} className='bg-blue-600 text-white px-4 py-1 rounded-full'>dismiss</button>
            </div>
            <div className="bg-neutral-800 border border-neutral-700 p-6 rounded-md shadow-md w-1/4 hidden">
            <h2 className="text-xl mb-4 text-left text-white font-bold ">internhunt <span className="text-blue-500 text-sm">BETA</span></h2>

              <h2 className="text-xl mb-4 text-left text-white">Login</h2>
              <form>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-white">Email</label>
                  <input type="email" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-white">Password</label>
                  <input type="password" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
                </div>
                <div className="flex justify-end">
                  <button type="button" onClick={handleCloseModal} className="mr-2 px-4 py-2 bg-neutral-800 rounded">Cancel</button>
                  <button type="submit" className="px-6  bg-blue-600 border border-blue-700 text-white rounded">Login</button>
                </div>
                <br></br>
                <a href="" className="text-blue-500">Forgot Password?</a><br></br>
                <a href="" className="text-blue-500">Already have an account?</a>

              </form>
            </div>
          </div>
        )}

        <div className="mx-auto px-20 py-10 rounded-md">
          <div>
            <h1 className="text-xl">Recently Listed</h1>
            {loading ? ( // Conditionally render loader
              <div className="flex justify-center items-center">
                <div className="loader"></div> {/* Add your loader component here */}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-4 w-full">
                {currentListings.map((listing, index) => (
                  <div key={index} className="flex flex-col mt-2 relative">
                    <div className="flex">
                      <img 
                        src={`https://logo.clearbit.com/${listing.company_name.toLowerCase().replace(/\s+/g, '')}.com`} 
                        alt={listing.company_name} 
                        width={45} 
                        height={45} 
                        style={{ height: '45px', objectFit: 'cover' }} // Fixed height and prevent stretching
                        onError={(e) => e.target.src = 'https://placehold.co/45x45'} // Fallback image
                      />
                      <div className="flex flex-col ml-2">
                        <div className="truncate-container">
                          <h1 className="truncate hover:marquee">{listing.title}</h1>
                        </div>
                        <p className="">{listing.company_name}</p>
                        <p>{listing.locations.join(', ')}</p>
                        <p>{listing.terms.join(', ')}</p>
                        <a href={listing.url} target="_blank" className="text-blue-500">Apply Here</a>
                      </div>
                    </div>
                    <div className="absolute bottom-0 right-0 text-sm text-gray-500">
                      <p>{formatDistanceToNow(new Date(listing.date_posted * 1000))} ago</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
            <div className="flex justify-between mt-4">
              <button onClick={handlePreviousPage} disabled={currentPage === 1} className="px-4 py-2 bg-neutral-800 rounded">
                Previous
              </button>
              <button onClick={handleNextPage} disabled={currentPage === totalPages} className="px-4 py-2 bg-neutral-800 rounded">
                Next
              </button>
            </div> 
          </div>
        </div>
      </div>

      <footer className='text-center text-white p-4'>
        <p>Made by <a href='https://pranavramesh.dev' className="text-blue-500 underline" target='_blank'>Pranav Ramesh</a></p>
      </footer>
    </div>
  );
}