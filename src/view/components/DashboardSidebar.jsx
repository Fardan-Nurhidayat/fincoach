import { useState } from "react";
import { Button } from "../components/ui/button";
import { Separator } from "../components/ui/separator";
import { ChevronDownIcon } from "@radix-ui/react-icons"; // Example icon, you might need to install @radix-ui/react-icons
import { Link } from "react-router";

const DashboardSidebar = () => {
  // Placeholder for dropdown state
  const [isYieldsOpen, setIsYieldsOpen] = useState(false);
  const [investasiOpen, setIsInvestasiOpen] = useState(false);
  const [isDexesOpen, setIsDexesOpen] = useState(false);

  return (
    <aside className='w-64 bg-gradient-to-r from-purple-800 to-purple-600 text-white flex flex-col p-4'>
      {/* Logo Section */}
      <div className='mb-6'>
        <div className='flex items-center space-x-2'>
          {/* Placeholder Logo */}
          <div className='size-7 rounded-full bg-gradient-to-br from-purple-600 to-purple-200' />
          <span className='text-xl font-bold'>FinCoach</span>
        </div>
      </div>

      {/* User Profile Section */}
      <div className='flex flex-col items-center gap-y-3 my-6'>
        {/* Placeholder Avatar */}
        <div className='w-10 h-10 bg-white rounded-full'>
          <img
            src='https://e7.pngegg.com/pngimages/799/987/png-clipart-computer-icons-avatar-icon-design-avatar-heroes-computer-wallpaper-thumbnail.png'
            alt='User Avatar'
            className='w-full h-full rounded-full'
          />
        </div>
        <div>
          <p className='font-semibold'>John Doe</p>
        </div>
      </div>

      <Separator className='bg-white my-4' />

      {/* Navigation Links */}
      <nav className='flex flex-col space-y-2 flex-1'>
        <Button
          variant='ghost'
          className='justify-start text-white hover:bg-white cursor-pointer'>
          <Link to='/dashboard'>
            <span className='mr-2'>📊</span> Dashboard
          </Link>
        </Button>

        <Button
          variant='ghost'
          className='justify-start text-white hover:bg-white'>
          <Link to='/tabungan'>
            <span className='mr-2'>💰</span> Tabungan
          </Link>
        </Button>

        {/* Yields with Dropdown */}
        <div>
          <Button
            variant='ghost'
            className='text-white hover:bg-white w-full flex items-center justify-between'
            onClick={() => setIsInvestasiOpen(!investasiOpen)}>
            <span className='flex items-center'>
              <Link>
                <span className='mr-5'>💸</span> Investasi
              </Link>
            </span>
            <ChevronDownIcon
              className={`w-4 h-4 transition-transform ${
                investasiOpen ? "rotate-180" : ""
              }`}
            />
          </Button>
          {investasiOpen && (
            <div className='ml-6 flex flex-col space-y-1 mt-1'>
              {/* Placeholder Dropdown Items */}
              <Button
                variant='ghost'
                className='justify-start text-gray-300 hover:bg-white text-sm'>
                <Link to='/investasi'>Investasi</Link>
              </Button>
              <Button
                variant='ghost'
                className='justify-start text-gray-300 hover:bg-white text-sm'>
                <Link to='/saham-perusahaan'>Saham Perusahaan</Link>
              </Button>
            </div>
          )}
        </div>

        {/* Yields with Dropdown */}
        <div>
          <Button
            variant='ghost'
            className='text-white hover:bg-white w-full flex items-center justify-between'
            onClick={() => setIsYieldsOpen(!isYieldsOpen)}>
            <span className='flex items-center'>
              <span className='mr-5'>💰</span> Yields
            </span>
            <ChevronDownIcon
              className={`w-4 h-4 transition-transform ${
                isYieldsOpen ? "rotate-180" : ""
              }`}
            />
          </Button>
          {isYieldsOpen && (
            <div className='ml-6 flex flex-col space-y-1 mt-1'>
              {/* Placeholder Dropdown Items */}
              <Button
                variant='ghost'
                className='justify-start text-gray-300 hover:bg-white text-sm'>
                Yield Farm 1
              </Button>
              <Button
                variant='ghost'
                className='justify-start text-gray-300 hover:bg-white text-sm'>
                Yield Farm 2
              </Button>
            </div>
          )}
        </div>

        {/* DEXes with Dropdown */}
        <div>
          <Button
            variant='ghost'
            className='text-white hover:bg-white w-full flex items-center justify-between'
            onClick={() => setIsDexesOpen(!isDexesOpen)}>
            <span className='flex items-center'>
              <span className='mr-5'>💱</span> DEXes
            </span>
            <ChevronDownIcon
              className={`w-4 h-4 transition-transform ${
                isDexesOpen ? "rotate-180" : ""
              }`}
            />
          </Button>
          {isDexesOpen && (
            <div className='ml-6 flex flex-col space-y-1 mt-1'>
              {/* Placeholder Dropdown Items */}
              <Button
                variant='ghost'
                className='justify-start text-gray-300 hover:bg-white text-sm'>
                DEX 1
              </Button>
              <Button
                variant='ghost'
                className='justify-start text-gray-300 hover:bg-white text-sm'>
                DEX 2
              </Button>
            </div>
          )}
        </div>

        <Button
          variant='ghost'
          className='justify-start text-white hover:bg-white'>
          <span className='mr-2'>📜</span> Protocols
        </Button>
        <Button
          variant='ghost'
          className='justify-start text-white hover:bg-white'>
          <span className='mr-2'>⚙️</span> Settings
        </Button>
      </nav>

      <Separator className='bg-white my-4' />

      {/* Log Out Button */}
      <Button
        variant='ghost'
        className='justify-start text-white hover:bg-white'>
        <span className='mr-2'>➡️</span> Log out
      </Button>
    </aside>
  );
};

export default DashboardSidebar;
