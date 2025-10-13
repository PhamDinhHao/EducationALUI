import CourseList from '@/modules/Course/pages/CourseList/CourseList.tsx'

const Home = () => {
  return (
    <div className='w-full bg-white p-4'>
      <div className='relative h-96 w-full overflow-hidden rounded-lg bg-gray-200 shadow-lg'>
        <img
          src='https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
          alt='Banner'
          className='h-full w-full object-cover'
        />
        <div className='absolute inset-0 flex flex-col items-center justify-center bg-black bg-opacity-50 text-white'>
          <h1 className='mb-4 text-5xl font-bold'>Welcome to Our Learning Platform</h1>
          <p className='text-xl'>Explore a world of knowledge and enhance your skills.</p>
          <button className='mt-6 rounded-lg bg-blue-600 px-8 py-3 text-lg font-semibold transition duration-300 hover:bg-blue-700'>
            Get Started
          </button>
        </div>
      </div>{' '}
      <div className='mt-8 text-center'>
        <h2 className='mb-6 text-3xl font-bold text-gray-800'>Our Popular Courses</h2>
      </div>
      <CourseList />
    </div>
  )
}

export default Home
