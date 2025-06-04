export type Quote = {
  id: number;
  text: string;
  author: string;
  votes: number;
};

export const quotes: Quote[] = [
  {
    id: 1,
    text: "The only limit to our realization of tomorrow is our doubts of today.",
    author: "Franklin D. Roosevelt",
    votes: 5,
  },
  {
    id: 2,
    text: "Life is what happens when you're busy making other plans.",
    author: "John Lennon",
    votes: 3,
  },
  {
    id: 3,
    text: "Do not go where the path may lead, go instead where there is no path and leave a trail.",
    author: "Ralph Waldo Emerson",
    votes: 8,
  },
  {
    id: 4,
    text: "Success is not final, failure is not fatal: It is the courage to continue that counts.",
    author: "Winston Churchill",
    votes: 2,
  },
];
