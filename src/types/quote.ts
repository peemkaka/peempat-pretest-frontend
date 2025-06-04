export interface Quote {
    id: string;
    text: string;
    author: string;
    createdAt: Date;
    votes: number;
    // สำหรับระบบ like/dislike
    upvotes: number;
    downvotes: number;
  }
  
  import { useState } from 'react';
  
  const useQuotes = () => {
    const [quotes, setQuotes] = useState<Quote[]>([]);
    const [loading, setLoading] = useState(false);
    
    const addQuote = (newQuote: Omit<Quote, 'id' | 'createdAt' | 'votes'>) => {
      const quote: Quote = {
        ...newQuote,
        id: Math.random().toString(36).substring(2, 9),
        createdAt: new Date(),
        votes: 0,
        upvotes: 0,
        downvotes: 0
      };
      setQuotes([quote, ...quotes]);
    };
    
    const voteQuote = (id: string, type: 'up' | 'down') => {
      setQuotes(quotes.map(q => {
        if (q.id === id) {
          return {
            ...q,
            votes: type === 'up' ? q.votes + 1 : q.votes - 1,
            upvotes: type === 'up' ? q.upvotes + 1 : q.upvotes,
            downvotes: type === 'down' ? q.downvotes + 1 : q.downvotes
          };
        }
        return q;
      }));
    };
    
    return { quotes, loading, addQuote, voteQuote };
  };