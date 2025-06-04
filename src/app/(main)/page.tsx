"use client";
import { useState, useEffect } from "react";
import QuoteList from "@/components/quotes/QuoteList";
import { Quote } from "@/types/quote";
import useQuotes from "@/hooks/useQuotes";
import SearchBar from "@/components/ui/SearchBar";
import FilterDropdown from "@/components/ui/FilterDropdown";
import QuoteForm from "@/components/quotes/QuoteForm";
import { useRouter } from "next/navigation";

const FILTER_STORAGE_KEY = "quotes_filter_setting";
const QUOTES_SHOWN_KEY = "quotes_lazy_loaded_count";
const INITIAL_COUNT = 10;
const LOAD_MORE_STEP = 10;


export default function QuotesPage() {
  const router = useRouter();
  const { quotes, voteQuote ,userVotes } = useQuotes();
  const [isOpenForm, setIsOpenForm] = useState(false);
  const [filteredQuotes, setFilteredQuotes] = useState<Quote[]>([]);
  const [currentFilter, setCurrentFilter] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem(FILTER_STORAGE_KEY) || "newest";
    }
    return "newest";
  });

  useEffect(() => {
    setFilteredQuotes(applyFilter(currentFilter, quotes));
  }, [quotes, currentFilter]);

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

  const handleAddQuote = (newQuote: Quote) => {
    const newList = applyFilter(currentFilter, [newQuote, ...quotes]);
    setFilteredQuotes(newList);
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

  return (
    <>
      {isOpenForm && (
        <QuoteForm
          isOpen={isOpenForm}
          onClose={() => setIsOpenForm(false)}
          onSubmit={handleAddQuote}
        />
      )}
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Quotes</h1>

        <div className="flex flex-col md:flex-row justify-between mb-6">
          <div className="flex justify-between gap-6">
            <SearchBar onSearch={handleSearch} />
            <button onClick={handleAddClick} className="bg-blue-500 text-white hover:bg-blue-800 cursor-pointer rounded-md shadow-xl w-[4rem] ">
              Add
            </button>
          </div>
          <FilterDropdown onFilter={handleFilter} />
        </div>

        <QuoteList
          quotes={filteredQuotes.length > 0 ? filteredQuotes : quotes}
          onVote={voteQuote}
          userVoteType={userVotes}
        />
      </div>
    </>
  );
}
