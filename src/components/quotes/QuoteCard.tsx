import { Quote } from '@/types/quote';
import { BiDownvote, BiSolidDownvote, BiSolidUpvote, BiUpvote } from 'react-icons/bi';

interface QuoteCardProps {
  quote: Quote;
  onVote: (type: 'up' | 'down') => void;
  userVoteType: 'up' | 'down' | null;
}

const QuoteCard = ({ quote, onVote, userVoteType }: QuoteCardProps) => {
  return (
    <div className="border rounded-lg p-4 mb-4 shadow-sm hover:shadow-md transition-shadow">
      <p className="text-lg italic">"{quote.text}"</p>
      <p className="text-sm text-gray-600 mt-2">- {quote.author}</p>
      
      <div className="flex items-center mt-4">
        <button 
          onClick={() => onVote('up')}
          className={`flex items-center ${userVoteType === 'up' ? 'text-green-600 font-bold' : 'text-green-500'} mr-4 transition-colors`}
        >
         {userVoteType === 'up'? <BiSolidUpvote/> : <BiUpvote/>}
          {quote.upvotes}
        </button>
        
        <button 
          onClick={() => onVote('down')}
          className={`flex items-center ${userVoteType === 'down' ? 'text-red-600 font-bold' : 'text-red-500'} transition-colors`}
        >
          {userVoteType === 'down'? <BiSolidDownvote /> : <BiDownvote/>}
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