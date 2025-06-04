import React from 'react'

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

function Card({children, className}: CardProps) {
  return (
    <div className={className}>
      {children}
    </div>
  )
}

export default Card
