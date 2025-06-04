'use client'
import { useState, useEffect } from 'react';
import QuoteList from '@/components/quotes/QuoteList';
import { Quote } from '@/types/quote';
import useQuotes from '@/hooks/useQuotes';
import SearchBar from '@/components/ui/SearchBar';
import FilterDropdown from '@/components/ui/FilterDropdown';

export default function QuotesPage() {
  const { quotes, voteQuote } = useQuotes();
  const [filteredQuotes, setFilteredQuotes] = useState<Quote[]>([]);
  const [currentFilter, setCurrentFilter] = useState('newest');

  useEffect(() => {
    setFilteredQuotes(quotes);
  }, [quotes]);

  const handleSearch = (term: string) => {
    const filtered = quotes.filter((q: Quote) =>
      q.text.toLowerCase().includes(term.toLowerCase()) || 
      q.author.toLowerCase().includes(term.toLowerCase())
    );
    setFilteredQuotes(applyFilter(currentFilter, filtered));
  };

  const applyFilter = (filter: string, quotesToFilter: Quote[]) => {
    let sorted = [...quotesToFilter];
    switch(filter) {
      case 'newest':
        return sorted.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
      case 'oldest':
        return sorted.sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
      case 'top':
        return sorted.sort((a, b) => b.votes - a.votes);
      case 'controversial':
        return sorted.sort((a, b) => {
          const aRatio = a.upvotes - a.downvotes;
          const bRatio = b.upvotes - b.downvotes;
          return Math.abs(bRatio) - Math.abs(aRatio);
        });
      default:
        return sorted;
    }
  };

  const handleFilter = (filter: string) => {
    setCurrentFilter(filter);
    setFilteredQuotes(applyFilter(filter, filteredQuotes));
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Quotes</h1>
      
      <div className="flex flex-col md:flex-row justify-between mb-6">
        <SearchBar onSearch={handleSearch} />
        <FilterDropdown onFilter={handleFilter} />
      </div>
      
      <QuoteList 
        quotes={filteredQuotes.length > 0 ? filteredQuotes : quotes}
        onVote={voteQuote}
      />
    </div>
  );
}