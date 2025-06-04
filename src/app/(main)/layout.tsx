'use client';
import { FaHome } from "react-icons/fa";
import { useRouter } from 'next/navigation';
import Link from "next/link";
import { IoMdLogOut } from "react-icons/io";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    router.push('/login');
  };

  const handleHome = () => {
    router.push('/');
  };

  return (
    <div className="flex min-h-screen ">
      {/* Sidebar */}
      <div className="w-16 fixed h-screen bg-white shadow-2xl flex flex-col items-center py-4 space-y-8">
        <Link
          href="/"
          onClick={handleHome}
          className="p-2 hover:bg-gray-700 bg-gray-400  rounded-lg transition-colors"
          title="Home"
        >
          <FaHome className="text-white hover:text-white" />
        </Link>
        <button
          onClick={handleLogout}
          className="p-2 cursor-pointer hover:bg-gray-700 bg-gray-400 rounded-lg transition-colors mt-auto text-white"
          title="Logout"
        >
          <IoMdLogOut />
        </button>
      </div>
      {/* Main Content */}
      <div className="flex-1 ml-[5rem]">
        {children}
      </div>
    </div>
  );
}