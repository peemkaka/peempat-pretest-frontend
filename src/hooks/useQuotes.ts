"use client";
import { useState, useEffect } from "react";
import { Quote } from "@/types/quote";

const STORAGE_KEY = "quotes_app_data";
const USER_VOTES_KEY = "user_votes_data";

type UserVoteRecord = {
  [quoteId: string]: "up" | "down" | null;
};

const useQuotes = () => {
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [loading, setLoading] = useState(true);
  const [userVotes, setUserVotes] = useState<UserVoteRecord>({});

  useEffect(() => {
    const fetchQuotes = () => {
      try {
        // โหลดข้อมูล quotes
        const savedQuotes = localStorage.getItem(STORAGE_KEY);
        // โหลดข้อมูล user votes
        const savedUserVotes = localStorage.getItem(USER_VOTES_KEY);

        if (savedQuotes) {
          const parsedQuotes = JSON.parse(savedQuotes, (key, value) => {
            if (key === 'createdAt') {
              return new Date(value);
            }
            return value;
          });
          setQuotes(parsedQuotes);
        } else {
          const mockQuotes: Quote[] = [
            {
              id: "1",
              text: "เป็นคนไม่ถือตัว ส่วนใหญ่ถือแต่แก้ว",
              author: "นักกวีท่านนึง",
              createdAt: new Date("2023-01-15"),
              votes: 42,
              upvotes: 50,
              downvotes: 8,
            },
            {
              id: "2",
              text: "เมื่อไรเงินในกระเป๋า จะเยอะเท่าความสวยที่เรามี",
              author: "นักกวีท่านนึง",
              createdAt: new Date("2023-02-20"),
              votes: 35,
              upvotes: 40,
              downvotes: 5,
            },
            {
              id: "3",
              text: "อยู่ด้วยกันจนถึงสิ้นปีเลยได้ไหม",
              author: "นักกวีท่านนึง",
              createdAt: new Date("2023-03-10"),
              votes: 28,
              upvotes: 30,
              downvotes: 2,
            },
            {
              id: "4",
              text: "อร่อยให้ 6 สกปรกให้ 10",
              author: "นักกวีท่านนึง",
              createdAt: new Date("2025-04-6"),
              votes: 12,
              upvotes: 30,
              downvotes: 18,
            },
            {
              id: "5",
              text: "เรียนมา 10 ปี รู้แล้วถนัดอะไร ถนัดขวา",
              author: "นักกวีท่านนึง",
              createdAt: new Date("2025-04-5"),
              votes: 14,
              upvotes: 30,
              downvotes: 16,
            },
            {
              id: "6",
              text: "ไอที่ดี คือไอจีเรานะค",
              author: "นักกวีท่านนึง",
              createdAt: new Date("2025-04-5"),
              votes: 14,
              upvotes: 30,
              downvotes: 16,
            },
          ];
          setQuotes(mockQuotes);
          localStorage.setItem(STORAGE_KEY, JSON.stringify(mockQuotes));
        }

        if (savedUserVotes) {
          setUserVotes(JSON.parse(savedUserVotes));
        }
      } catch (error) {
        console.error("Failed to load quotes:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchQuotes();
  }, []);

  const addQuote = (newQuote: { text: string; author: string }) => {
    const quote: Quote = {
      ...newQuote,
      id: Math.random().toString(36).substring(2, 9),
      createdAt: new Date(),
      votes: 0,
      upvotes: 0,
      downvotes: 0,
    };
    setQuotes(prev => {
      const updated = [quote, ...prev];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });
    localStorage.removeItem("quote_list_fully_loaded");
  };

  const deleteQuote = (id: string) => {
    const updatedQuotes = quotes.filter((quote) => quote.id !== id);
    setQuotes(prev => {
      const updated = updatedQuotes;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });
  };

  const updateQuote = (id: string, text: string, author: string) => {
    setQuotes(prev => {
      const updated = prev.map(q =>
        q.id === id ? { ...q, text, author } : q
      );
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });
  };

  const voteQuote = (id: string, type: "up" | "down") => {
    const previousVote = userVotes[id];
    const updatedUserVotes = { ...userVotes };
    
    const updatedQuotes = quotes.map((q) => {
      if (q.id === id) {
        let newQuote = { ...q };

        // // ถ้าเคย vote ไว้แล้ว ให้ลบ vote เดิมออกก่อน
        // if (previousVote) {
        //   newQuote.votes = previousVote === "up" ? q.votes - 1 : q.votes + 1;
        //   newQuote[`${previousVote}votes`] = q[`${previousVote}votes`] - 1;
        // }

        // // ถ้า vote ใหม่เป็นประเภทเดียวกับที่เคย vote ไว้ ให้ยกเลิก vote
        // if (previousVote === type) {
        //   updatedUserVotes[id] = null;
        //   return newQuote;
        // }

        // เพิ่ม vote ใหม่
        newQuote.votes = type === "up" ? newQuote.votes + 1 : newQuote.votes - 1;
        newQuote[`${type}votes`] = newQuote[`${type}votes`] + 1;
        updatedUserVotes[id] = type;

        return newQuote;
      }
      return q;
    });

    setQuotes(updatedQuotes);
    setUserVotes(updatedUserVotes);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedQuotes));
    localStorage.setItem(USER_VOTES_KEY, JSON.stringify(updatedUserVotes));
  };

  return { quotes, loading, addQuote, voteQuote, deleteQuote, updateQuote, userVotes };
};

export default useQuotes;