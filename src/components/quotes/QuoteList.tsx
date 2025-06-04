import { useEffect, useState } from 'react';
import QuoteCard from './QuoteCard';
import { Quote } from '@/types/quote';

interface QuoteListProps {
  quotes: Quote[];
  onVote: (id: string, type: "up" | "down") => void;
}

const QuoteList = ({ quotes, onVote }: QuoteListProps) => {
  const [visibleQuotes, setVisibleQuotes] = useState<Quote[]>([]);
  const [page, setPage] = useState(1);
  const itemsPerPage = 4;

  // Reset เมื่อ quotes เปลี่ยน
  useEffect(() => {
    setPage(1);
    setVisibleQuotes(quotes.slice(0, itemsPerPage));
  }, [quotes]);

  // อัพเดต visible quotes เมื่อ page เปลี่ยน
  useEffect(() => {
    setVisibleQuotes(quotes.slice(0, page * itemsPerPage));
  }, [page, quotes]);

  // ตรวจสอบว่ายังมีข้อมูลให้โหลดเพิ่มหรือไม่
  const hasMoreQuotes = visibleQuotes.length < quotes.length;

  // ฟังก์ชันโหลดข้อมูลเพิ่ม
  const loadMore = () => {
    if (hasMoreQuotes) {
      setPage(prev => prev + 1);
    }
  };

  // สำหรับ debug
  useEffect(() => {
    console.log('Current page:', page);
    console.log('Visible items:', visibleQuotes.length);
    console.log('Total items:', quotes.length);
    console.log('Has more quotes:', hasMoreQuotes);
  }, [page, visibleQuotes, quotes, hasMoreQuotes]);

  return (
    <div className="space-y-4">
      {visibleQuotes.map(quote => (
        <QuoteCard 
          key={quote.id} 
          quote={quote} 
          onVote={(type) => onVote(quote.id, type)} 
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