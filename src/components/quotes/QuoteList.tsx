import { useEffect, useState } from 'react';
import QuoteCard from './QuoteCard';
import { Quote } from '@/types/quote';

interface QuoteListProps {
  quotes: Quote[];
  userVoteType: {
    [quoteId: string]: "up" | "down" | null;
  };
  onVote: (id: string, type: "up" | "down") => void;
}

const QuoteList = ({ quotes, onVote, userVoteType }: QuoteListProps) => {
  const [visibleQuotes, setVisibleQuotes] = useState<Quote[]>([]);
  const [page, setPage] = useState(1);
  const itemsPerPage = 4;
  const QUOTE_LIST_LOADED_KEY = "quote_list_fully_loaded";

  useEffect(() => {
    const isFullyLoaded = localStorage.getItem(QUOTE_LIST_LOADED_KEY) === "true";
    if (isFullyLoaded) {
      setVisibleQuotes(quotes);
      setPage(Math.ceil(quotes.length / itemsPerPage));
    } else {
      setPage(1);
      setVisibleQuotes(quotes.slice(0, itemsPerPage));
    }
  }, [quotes]);

  useEffect(() => {
    const newVisible = quotes.slice(0, page * itemsPerPage);
    setVisibleQuotes(newVisible);

    if (newVisible.length >= quotes.length) {
      localStorage.setItem(QUOTE_LIST_LOADED_KEY, "true");
    }
  }, [page, quotes]);

  const hasMoreQuotes = visibleQuotes.length < quotes.length;

  const loadMore = () => {
    if (hasMoreQuotes) {
      setPage(prev => prev + 1);
    }
  };

  return (
    <div className="space-y-4">
      {visibleQuotes.map(quote => (
        <QuoteCard 
          key={quote.id} 
          quote={quote} 
          onVote={(type) => onVote(quote.id, type)}
          userVoteType={userVoteType[quote.id]}
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
