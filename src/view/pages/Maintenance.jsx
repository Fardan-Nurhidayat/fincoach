// pages/maintenance.js

export default function MaintenancePage() {
  return (
    <div className='min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center px-4 sm:px-6 lg:px-8 dark:from-gray-900 dark:to-gray-800'>
      <div className='max-w-lg w-full text-center space-y-8'>
        {/* Icon with animation */}
        <div className='flex justify-center'>
          <div className='relative'>
            <svg
              className='w-24 h-24 text-purple-500 animate-pulse'
              fill='currentColor'
              viewBox='0 0 20 20'
              xmlns='http://www.w3.org/2000/svg'>
              <path
                fillRule='evenodd'
                d='M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z'
                clipRule='evenodd'
              />
            </svg>
            <span className='absolute -top-1 -right-1 block h-4 w-4 rounded-full bg-yellow-400 animate-ping'></span>
          </div>
        </div>

        {/* Title */}
        <h1 className='text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-5xl'>
          Kami Sedang Maintenance
        </h1>

        {/* Subtitle */}
        <p className='mt-4 text-lg text-gray-600 dark:text-gray-300'>
          Situs sedang dalam perawatan berkala. Mohon tunggu sebentar.
        </p>

        {/* Button */}
        <div className='mt-6'>
          <button
            onClick={() => window.location.reload()}
            className='inline-flex items-center px-4 py-2 cursor-pointer border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-150'>
            Muat Ulang Halaman
          </button>
        </div>

        {/* Footer */}
        <footer className='text-sm text-gray-500 dark:text-gray-400'>
          © {new Date().getFullYear()} FinCoach. Keep Grow.
        </footer>
      </div>
    </div>
  );
}
