import useQuotes from '@/hooks/useQuotes';
import React, { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

interface QuoteFormProps {
  onSubmit: (quote: {
    id: string;
    text: string;
    author: string;
    createdAt: Date;
    votes: number;
    upvotes: number;
    downvotes: number;
  }) => void;
  isOpen: boolean;
  onClose: () => void;
}

function QuoteForm({ onSubmit, isOpen, onClose }: QuoteFormProps) {
  const { quotes, loading, addQuote, voteQuote, deleteQuote, updateQuote } = useQuotes();
  const [formData, setFormData] = useState({
    text: '',
    author: 'Admin'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newQuote = {
      id: uuidv4(),
      text: formData.text,
      author: formData.author,
      createdAt: new Date(),
      votes: 0,
      upvotes: 0,
      downvotes: 0
    };

    addQuote(newQuote);
    onSubmit(newQuote);
    console.log(newQuote)
    setFormData({ text: '', author: '' });
    onClose();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/10 bg-opacity-20 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-lg">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Add New Quote</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="text" className="block text-sm font-medium text-gray-700 mb-1">
              Quote Text
            </label>
            <textarea
              id="text"
              name="text"
              value={formData.text}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={4}
            />
          </div>



          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
            >
              Add Quote
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default QuoteForm;