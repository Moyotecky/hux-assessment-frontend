import Link from 'next/link';

const Home = () => {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-6">
      <h1 className="text-4xl font-bold text-gray-800 mb-4">Welcome to Contact Manager</h1>
      <p className="text-lg text-gray-600 mb-6">Manage your contacts efficiently with our application.</p>
      <Link 
        href="/auth"
        className="bg-blue-500 text-white px-4 py-2 rounded-lg shadow-lg hover:bg-blue-600 transition ease-in-out duration-300"
      >
        Get Started
      </Link>
    </div>
  );
};

export default Home;
