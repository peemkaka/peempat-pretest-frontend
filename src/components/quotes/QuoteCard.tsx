import { Quote } from '@/types/quote';
import { BiDownvote, BiSolidDownvote, BiSolidUpvote, BiUpvote } from 'react-icons/bi';
import { MdOutlineDeleteSweep, MdOutlineEditNote } from 'react-icons/md';
import { useRouter } from 'next/navigation';

interface QuoteCardProps {
  quote: Quote;
  onVote: (type: 'up' | 'down') => void;
  userVoteType: 'up' | 'down' | null;
  onAddEdit: (quote: Quote) => void;
  onDelete: (quote: Quote) => void;
  isLoggedIn: boolean;
}

const QuoteCard = ({ quote, onVote, userVoteType, onAddEdit, onDelete, isLoggedIn }: QuoteCardProps) => {
  const router = useRouter();

  const handleEdit = () => {
    if (!isLoggedIn) {
      router.push('/login');
    } else {
      onAddEdit(quote);
    }
  };

  const handleDelete = () => {
    if (!isLoggedIn) {
      router.push('/login');
    } else {
      onDelete(quote);
    }
  };

  return (
    <div className="border rounded-lg p-4 mb-4 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex justify-between">
        <div>
          <p className="text-lg italic">"{quote.text}"</p>
          <p className="text-sm text-gray-600 mt-2">- {quote.author}</p>
        </div>
        <div className='space-x-2'>
          <>
            <button
              onClick={handleEdit}
              className='cursor-pointer text-gray-500 hover:text-gray-700 transition-colors'
            >
              <MdOutlineEditNote className='w-5 h-5' />
            </button>
            <button
              onClick={handleDelete}
              className='cursor-pointer text-gray-500 hover:text-gray-700 transition-colors'>
              <MdOutlineDeleteSweep className='w-5 h-5' />
            </button>
          </>
        </div>
      </div>

      <div className="flex items-center mt-4">
        <button
          onClick={() => isLoggedIn && onVote('up')}
          disabled={!isLoggedIn}
          className={`flex items-center ${userVoteType === 'up' ? 'text-green-600 font-bold' : 'text-green-500'} mr-4 transition-colors ${!isLoggedIn ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          {userVoteType === 'up' ? <BiSolidUpvote /> : <BiUpvote />}
          {quote.upvotes}
        </button>

        <button
          onClick={() => isLoggedIn && onVote('down')}
          disabled={!isLoggedIn}
          className={`flex items-center ${userVoteType === 'down' ? 'text-red-600 font-bold' : 'text-red-500'} transition-colors ${!isLoggedIn ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          {userVoteType === 'down' ? <BiSolidDownvote /> : <BiDownvote />}
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