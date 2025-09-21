'use client';

import { useState, useRef, useEffect } from 'react';
import { ProjectProfile, User, SwipeDirection } from '@/lib/types';
import { ProfileCard } from '@/components/ProfileCard';
import { cn } from '@/lib/utils';
import { SWIPE_THRESHOLD } from '@/lib/constants';

interface SwipeableCardProps {
  project: ProjectProfile;
  user?: User;
  onSwipe: (direction: SwipeDirection) => void;
  className?: string;
}

export function SwipeableCard({ project, user, onSwipe, className }: SwipeableCardProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [isAnimating, setIsAnimating] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const startPos = useRef({ x: 0, y: 0 });

  const handleStart = (clientX: number, clientY: number) => {
    if (isAnimating) return;
    setIsDragging(true);
    startPos.current = { x: clientX, y: clientY };
  };

  const handleMove = (clientX: number, clientY: number) => {
    if (!isDragging || isAnimating) return;
    
    const deltaX = clientX - startPos.current.x;
    const deltaY = clientY - startPos.current.y;
    
    setDragOffset({ x: deltaX, y: deltaY });
  };

  const handleEnd = () => {
    if (!isDragging || isAnimating) return;
    
    setIsDragging(false);
    const { x } = dragOffset;
    
    if (Math.abs(x) > SWIPE_THRESHOLD) {
      const direction: SwipeDirection = x > 0 ? 'right' : 'left';
      setIsAnimating(true);
      
      // Animate the card off screen
      setDragOffset({ 
        x: direction === 'right' ? window.innerWidth : -window.innerWidth, 
        y: dragOffset.y 
      });
      
      // Call onSwipe after animation
      setTimeout(() => {
        onSwipe(direction);
        setIsAnimating(false);
        setDragOffset({ x: 0, y: 0 });
      }, 300);
    } else {
      // Snap back to center
      setDragOffset({ x: 0, y: 0 });
    }
  };

  // Mouse events
  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    handleStart(e.clientX, e.clientY);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    handleMove(e.clientX, e.clientY);
  };

  const handleMouseUp = () => {
    handleEnd();
  };

  // Touch events
  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    handleStart(touch.clientX, touch.clientY);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    handleMove(touch.clientX, touch.clientY);
  };

  const handleTouchEnd = () => {
    handleEnd();
  };

  // Global mouse events
  useEffect(() => {
    const handleGlobalMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        handleMove(e.clientX, e.clientY);
      }
    };

    const handleGlobalMouseUp = () => {
      if (isDragging) {
        handleEnd();
      }
    };

    if (isDragging) {
      document.addEventListener('mousemove', handleGlobalMouseMove);
      document.addEventListener('mouseup', handleGlobalMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleGlobalMouseMove);
      document.removeEventListener('mouseup', handleGlobalMouseUp);
    };
  }, [isDragging, dragOffset]);

  const rotation = dragOffset.x * 0.1;
  const opacity = Math.max(0.7, 1 - Math.abs(dragOffset.x) / 300);

  return (
    <div
      ref={cardRef}
      className={cn(
        'absolute inset-0 cursor-grab active:cursor-grabbing select-none',
        isDragging && 'z-10',
        className
      )}
      style={{
        transform: `translate(${dragOffset.x}px, ${dragOffset.y}px) rotate(${rotation}deg)`,
        opacity,
        transition: isDragging ? 'none' : 'all 0.3s ease-out',
      }}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <div className="flex items-center justify-center h-full p-4">
        <ProfileCard project={project} user={user} />
      </div>

      {/* Swipe indicators */}
      {Math.abs(dragOffset.x) > 50 && (
        <>
          {dragOffset.x > 0 && (
            <div className="absolute top-8 right-8 bg-green-500 text-white px-4 py-2 rounded-lg font-bold text-lg transform rotate-12">
              LIKE
            </div>
          )}
          {dragOffset.x < 0 && (
            <div className="absolute top-8 left-8 bg-red-500 text-white px-4 py-2 rounded-lg font-bold text-lg transform -rotate-12">
              PASS
            </div>
          )}
        </>
      )}
    </div>
  );
}
