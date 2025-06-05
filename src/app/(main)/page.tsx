"use client";
import { useState, useEffect } from "react";
import QuoteList from "@/components/quotes/QuoteList";
import { Quote } from "@/types/quote";
import useQuotes from "@/hooks/useQuotes";
import SearchBar from "@/components/ui/SearchBar";
import FilterDropdown from "@/components/ui/FilterDropdown";
import QuoteForm from "@/components/quotes/QuoteForm";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

const FILTER_STORAGE_KEY = "quotes_filter_setting";


export default function QuotesPage() {
  const router = useRouter();
  const { quotes, voteQuote, userVotes, addQuote, updateQuote, deleteQuote } = useQuotes();
  const [isOpenForm, setIsOpenForm] = useState(false);
  const [filteredQuotes, setFilteredQuotes] = useState<Quote[]>([]);
  const [currentFilter, setCurrentFilter] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem(FILTER_STORAGE_KEY) || "newest";
    }
    return "newest";
  });
  const [editQuote, setEditQuote] = useState<Quote | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Quote | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setIsLoggedIn(localStorage.getItem("isLoggedIn") === "true");
    }
  }, []);

  useEffect(() => {
    setFilteredQuotes(applyFilter(currentFilter, quotes));
  }, [quotes, currentFilter]);

  useEffect(() => {
    const handleStorage = (event: StorageEvent) => {
      if (event.key === "quotes_app_data") {
        const savedQuotes = localStorage.getItem("quotes_app_data");
        if (savedQuotes) {
          const parsedQuotes = JSON.parse(savedQuotes, (key, value) => {
            if (key === 'createdAt') return new Date(value);
            return value;
          });
          setFilteredQuotes(applyFilter(currentFilter, parsedQuotes));
        }
      }
    };
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, [currentFilter]);

  const handleSearch = (term: string) => {
    const filtered = quotes.filter(
      (q: Quote) =>
        q.text.toLowerCase().includes(term.toLowerCase()) ||
        q.author.toLowerCase().includes(term.toLowerCase())
    );
    setFilteredQuotes(applyFilter(currentFilter, filtered));
  };

  const applyFilter = (filter: string, quotesToFilter: Quote[]) => {
    let sorted = [...quotesToFilter];
    switch (filter) {
      case "newest":
        return sorted.sort(
          (a, b) => b.createdAt.getTime() - a.createdAt.getTime()
        );
      case "oldest":
        return sorted.sort(
          (a, b) => a.createdAt.getTime() - b.createdAt.getTime()
        );
      case "top":
        return sorted.sort((a, b) => b.votes - a.votes);
      case "controversial":
        return sorted.sort((a, b) => {
          const aRatio = a.upvotes - a.downvotes;
          const bRatio = b.upvotes - b.downvotes;
          return Math.abs(bRatio) - Math.abs(aRatio);
        });
      default:
        return sorted;
    }
  };

  const handleAddAndEditClick = (quote: Quote) => {
    setEditQuote(quote);
    setIsOpenForm(true);
  };

  const handleFormSubmit = (data: { text: string; author: string }) => {
    if (editQuote) {
      updateQuote(editQuote.id, data.text, data.author);
      toast.success('แก้ไขข้อมูลสำเร็จ!');
      setEditQuote(null);
    } else {
      addQuote(data);
      toast.success('เพิ่มข้อมูลสำเร็จ!');
    }
    setIsOpenForm(false);
  };

  const handleFilter = (filter: string) => {
    setCurrentFilter(filter);
    localStorage.setItem(FILTER_STORAGE_KEY, filter);
    setFilteredQuotes(applyFilter(filter, quotes));
  };

  const handleAddClick = () => {
    if (typeof window !== "undefined") {
      const isLoggedIn = localStorage.getItem("isLoggedIn");
      if (isLoggedIn) {
        setIsOpenForm(true);
      } else {
        router.push("/login");
      }
    }
  };

  const handleDeleteClick = (quote: Quote) => {
    setDeleteTarget(quote);
  };

  const handleConfirmDelete = () => {
    if (deleteTarget) {
      deleteQuote(deleteTarget.id);
      setDeleteTarget(null);
    }
  };

  const handleCancelDelete = () => {
    setDeleteTarget(null);
  };

  const handleCloseForm = () => {
    setIsOpenForm(false);
    setEditQuote(null);
  };


  return (
    <>
      {isOpenForm && (
        <QuoteForm
          isOpen={isOpenForm}
          onClose={handleCloseForm}
          onSubmit={handleFormSubmit}
          initialData={editQuote ? { text: editQuote.text, author: editQuote.author } : undefined}
        />
      )}
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Quotes List</h1>

        <div className="flex flex-col md:flex-row justify-between mb-6">
          <div className="flex justify-between gap-6">
            <SearchBar onSearch={handleSearch} />
            <button
              onClick={handleAddClick}
              className="bg-blue-500 text-white hover:bg-blue-800 cursor-pointer rounded-md shadow-xl w-[4rem] "
            >
              Add
            </button>
          </div>
          <FilterDropdown onFilter={handleFilter} />
        </div>

        <QuoteList
          quotes={filteredQuotes}
          onVote={voteQuote}
          userVoteType={userVotes}
          onAddEdit={handleAddAndEditClick}
          onDelete={handleDeleteClick}
          isLoggedIn={isLoggedIn}
        />

        {deleteTarget && (
          <div className="fixed inset-0 flex items-center justify-center bg-black/10 bg-opacity-50">
            <div className="bg-white p-6 rounded-md shadow-md max-w-sm w-full">
              <h2 className="text-lg font-semibold mb-4">Confirm Delete</h2>
              <p className="mb-4">
                Are you sure you want to delete this quote?
              </p>
              <div className="flex justify-end gap-2">
                <button
                  onClick={handleConfirmDelete}
                  className="bg-red-500 text-white px-4 py-2 rounded-md shadow-md hover:bg-red-600"
                >
                  Delete
                </button>
                <button
                  onClick={handleCancelDelete}
                  className="bg-gray-300 text-gray-800 px-4 py-2 rounded-md shadow-md hover:bg-gray-400"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
