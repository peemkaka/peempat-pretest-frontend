import { useState, useEffect, useRef } from 'react';
import QuoteCard from './QuoteCard';
import { Quote } from '@/types/quote';

interface QuoteListProps {
  quotes: Quote[];
  userVoteType: {
    [quoteId: string]: "up" | "down" | null;
  };
  onVote: (id: string, type: "up" | "down") => void;
  onAddEdit: (quote: Quote) => void; 
  onDelete: (quote: Quote) => void;
  isLoggedIn: boolean; 
}

const QuoteList = ({ quotes, onVote, userVoteType, onAddEdit, onDelete, isLoggedIn }: QuoteListProps) => {
  const [page, setPage] = useState(1);
  const itemsPerPage = 4;
  const loaderRef = useRef<HTMLDivElement | null>(null);

  const visibleQuotes = quotes.slice(0, page * itemsPerPage);
  const hasMoreQuotes = visibleQuotes.length < quotes.length;

  useEffect(() => {
    if (!hasMoreQuotes) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setPage((prev) => prev + 1);
        }
      },
      { threshold: 1 }
    );
    if (loaderRef.current) observer.observe(loaderRef.current);
    return () => {
      if (loaderRef.current) observer.unobserve(loaderRef.current);
    };
  }, [hasMoreQuotes]);

  useEffect(() => {
    setPage(1);
  }, [quotes.length]);

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
        <div ref={loaderRef} className="flex justify-center mt-6">
          <span className="px-4 py-2 text-gray-400">Loading more...</span>
        </div>
      )}
    </div>
  );
};

export default QuoteList;
