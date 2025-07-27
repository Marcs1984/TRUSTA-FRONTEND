import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-white text-gray-800">
      {/* HEADER */}
      <header className="w-full px-6 py-4 bg-gray-100 shadow flex justify-between items-center">
        <div className="text-2xl font-bold text-gray-900">TRUSTA</div>
        <nav className="space-x-6">
          <Link to="/about" className="hover:underline">About Us</Link>
          <Link to="/contact" className="hover:underline">Contact Us</Link>
          <Link to="/login" className="hover:underline font-semibold">Sign In</Link>
        </nav>
      </header>

      {/* HERO SECTION */}
      <main className="flex-grow flex flex-col justify-center items-center text-center px-4 py-16">
        <h1 className="text-4xl md:text-6xl font-bold mb-4">Hold Funds. Release Confidence.</h1>
        <p className="text-lg md:text-xl text-gray-600 mb-10 max-w-2xl">
          Australia's secure construction escrow platform for Builders, Contractors, and Clients.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <Link to="/signup/builder" className="bg-blue-600 text-white px-6 py-4 rounded-xl hover:bg-blue-700 text-xl">
            Sign Up as Builder
          </Link>
          <Link to="/signup/contractor" className="bg-green-600 text-white px-6 py-4 rounded-xl hover:bg-green-700 text-xl">
            Sign Up as Contractor
          </Link>
          <Link to="/signup/client" className="bg-yellow-500 text-white px-6 py-4 rounded-xl hover:bg-yellow-600 text-xl">
            Sign Up as Client
          </Link>
        </div>

        {/* EXISTING USERS */}
        <div className="space-y-2">
          <p>
            Already have an account? <Link to="/login" className="text-blue-600 underline">Log In</Link>
          </p>
          <p>
            Are you an admin? <Link to="/admin" className="text-red-600 underline">Admin Login</Link>
          </p>
        </div>
      </main>

      {/* FOOTER / INFO PLACEHOLDER */}
      <footer className="bg-gray-100 text-center text-sm text-gray-500 py-6 border-t mt-auto">
        More info about TRUSTA, legal disclaimers, and certifications coming soon.
      </footer>
    </div>
  );
}