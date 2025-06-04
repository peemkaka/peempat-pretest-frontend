import { Quote } from '@/types/quote';
import { BiDownvote, BiUpvote } from 'react-icons/bi';

interface QuoteCardProps {
  quote: Quote;
  onVote: (type: 'up' | 'down') => void;
}

const QuoteCard = ({ quote, onVote }: QuoteCardProps) => {
  return (
    <div className="border rounded-lg p-4 mb-4 shadow-sm hover:shadow-md transition-shadow">
      <p className="text-lg italic">"{quote.text}"</p>
      <p className="text-sm text-gray-600 mt-2">- {quote.author}</p>
      
      <div className="flex items-center mt-4">
        <button 
          onClick={() => onVote('up')}
          className="flex items-center text-green-500 mr-4"
        >
          <BiUpvote className="w-5 h-5 mr-1" />
          {quote.upvotes}
        </button>
        
        <button 
          onClick={() => onVote('down')}
          className="flex items-center text-red-500"
        >
          <BiDownvote className="w-5 h-5 mr-1" />
          {quote.downvotes}
        </button>
        
        <span className="ml-auto text-sm text-gray-500">
          {new Date(quote.createdAt).toLocaleDateString()}
        </span>
      </div>
    </div>
  );
};

export default QuoteCard;