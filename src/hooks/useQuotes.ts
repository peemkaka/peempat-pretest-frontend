"use client";
import { useState, useEffect } from "react";
import { Quote } from "@/types/quote";

const useQuotes = () => {
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [loading, setLoading] = useState(true);

  // โหลดข้อมูลเริ่มต้น (mock data)
  useEffect(() => {
    const fetchQuotes = async () => {
      try {
        const mockQuotes: Quote[] = [
          {
            id: "1",
            text: "The only way to do great work is to love what you do.",
            author: "Steve Jobs",
            createdAt: new Date("2023-01-15"),
            votes: 42,
            upvotes: 50,
            downvotes: 8,
          },
          {
            id: "2",
            text: "Life is what happens when you're busy making other plans.",
            author: "John Lennon",
            createdAt: new Date("2023-02-20"),
            votes: 35,
            upvotes: 40,
            downvotes: 5,
          },
          {
            id: "3",
            text: "In the middle of difficulty lies opportunity.",
            author: "Albert Einstein",
            createdAt: new Date("2023-03-10"),
            votes: 28,
            upvotes: 30,
            downvotes: 2,
          },
          {
            id: "4",
            text: "อร่อยให้ 6 สกปรกให้ 10",
            author: "Messi",
            createdAt: new Date("2025-04-6"),
            votes: 12,
            upvotes: 30,
            downvotes: 18,
          },
          {
            id: "5",
            text: "อร่อยให้ 7 สกปรกให้ 11",
            author: "Messi",
            createdAt: new Date("2025-04-5"),
            votes: 14,
            upvotes: 30,
            downvotes: 16,
          },
          {
            id: "6",
            text: "อร่อยให้ 7 สกปรกให้ 11",
            author: "Messi",
            createdAt: new Date("2025-04-5"),
            votes: 14,
            upvotes: 30,
            downvotes: 16,
          },
        ];
        setQuotes(mockQuotes);
      } catch (error) {
        console.error("Failed to load quotes:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchQuotes();
  }, []);

  const addQuote = (
    newQuote: Omit<
      Quote,
      "id" | "createdAt" | "votes" | "upvotes" | "downvotes"
    >
  ) => {
    const quote: Quote = {
      ...newQuote,
      id: Math.random().toString(36).substring(2, 9),
      createdAt: new Date(),
      votes: 0,
      upvotes: 0,
      downvotes: 0,
    };
    setQuotes((prev) => [quote, ...prev]);
  };

  const voteQuote = (id: string, type: "up" | "down") => {
    setQuotes((prev) =>
      prev.map((q) => {
        if (q.id === id) {
          return {
            ...q,
            votes: type === "up" ? q.votes + 1 : q.votes - 1,
            upvotes: type === "up" ? q.upvotes + 1 : q.upvotes,
            downvotes: type === "down" ? q.downvotes + 1 : q.downvotes,
          };
        }
        return q;
      })
    );
  };

  return { quotes, loading, addQuote, voteQuote };
};

export default useQuotes;
