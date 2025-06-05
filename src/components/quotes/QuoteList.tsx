import { useState, useEffect } from 'react';
import QuoteCard from './QuoteCard';
import { Quote } from '@/types/quote';

interface QuoteListProps {
  quotes: Quote[];
  userVoteType: {
    [quoteId: string]: "up" | "down" | null;
  };
  onVote: (id: string, type: "up" | "down") => void;
  onAddEdit: (quote: Quote) => void; // เพิ่ม prop นี้
  onDelete: (quote: Quote) => void;
  isLoggedIn: boolean; // เพิ่ม prop นี้
}

const QuoteList = ({ quotes, onVote, userVoteType, onAddEdit, onDelete, isLoggedIn }: QuoteListProps) => {
  const [page, setPage] = useState(1);
  const itemsPerPage = 4;
  const QUOTE_LIST_LOADED_KEY = "quote_list_fully_loaded";

  // Reset localStorage key เมื่อจำนวน quotes เปลี่ยน
  useEffect(() => {
    localStorage.removeItem(QUOTE_LIST_LOADED_KEY);
    setPage(1);
  }, [quotes.length]);

  const isFullyLoaded = typeof window !== 'undefined' && localStorage.getItem(QUOTE_LIST_LOADED_KEY) === "true";
  const visibleQuotes = isFullyLoaded
    ? quotes
    : quotes.slice(0, page * itemsPerPage);

  const hasMoreQuotes = visibleQuotes.length < quotes.length;

  const loadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    if (nextPage * itemsPerPage >= quotes.length) {
      localStorage.setItem(QUOTE_LIST_LOADED_KEY, "true");
    }
  };

  return (
    <div className="space-y-4">
      {visibleQuotes.map((quote) => (
        <QuoteCard
          key={quote.id}
          quote={quote}
          onVote={(type) => onVote(quote.id, type)}
          userVoteType={userVoteType[quote.id]}
          onAddEdit={() => onAddEdit(quote)} 
          onDelete={() => onDelete(quote)}
          isLoggedIn={isLoggedIn} 
        />
      ))}

      {visibleQuotes.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          No quotes to display
        </div>
      )}

      {hasMoreQuotes && (
        <div className="flex justify-center mt-6">
          <button
            onClick={loadMore}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            Load More Quotes
          </button>
        </div>
      )}
    </div>
  );
};

export default QuoteList;
