'use client';
import { FaHome } from "react-icons/fa";
import { useRouter } from 'next/navigation';
import Link from "next/link";
import { IoMdLogIn, IoMdLogOut } from "react-icons/io";
import { useEffect, useState } from 'react';

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    if (typeof window !== 'undefined') {
      setIsLoggedIn(localStorage.getItem('isLoggedIn') === 'true');
    }
  }, []);

  const handleLogout = () => {
    if (typeof window !== 'undefined') {
      const confirmed = window.confirm("คุณต้องการออกจากระบบหรือไม่?");
      if (confirmed) {
        const preservedQuotes = localStorage.getItem("quotes_app_data");
        localStorage.clear();
        if (preservedQuotes) {
          localStorage.setItem("quotes_app_data", preservedQuotes);
        }
        localStorage.setItem('isLoggedIn', 'false');
        setIsLoggedIn(false);
        router.push('/login');
      }
    }
  };

  const handleHome = () => {
    router.push('/');
  };

  if (!isMounted) {
    return null;
  }

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <div className="w-16 fixed h-screen bg-white shadow-2xl flex flex-col items-center py-4 space-y-8">
        <Link
          href="/"
          onClick={handleHome}
          className="p-2 hover:bg-gray-700 bg-gray-400 rounded-lg transition-colors"
          title="Home"
        >
          <FaHome className="text-white hover:text-white" />
        </Link>
        {isLoggedIn ? (
          <button
            onClick={handleLogout}
            className="p-2 cursor-pointer hover:bg-gray-700 bg-gray-400 rounded-lg transition-colors mt-auto text-white"
            title="Logout"
          >
            <IoMdLogOut />
          </button>
        ) : (
          <Link
            href="/login"
            className="p-2 cursor-pointer hover:bg-gray-700 bg-gray-400 rounded-lg transition-colors mt-auto text-white"
            title="Login"
          >
            <IoMdLogIn />
          </Link>
        )}
      </div>
      {/* Main Content */}
      <div className="flex-1 ml-[5rem]">
        {children}
      </div>
    </div>
  );
}
