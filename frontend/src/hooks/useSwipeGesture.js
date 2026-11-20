import { useRef, useState } from 'react';
import { decideSwipe } from '../utils/swipeDecision.js';

export function useSwipeGesture({ onSwipe, disabled }) {
  const [offsetX, setOffsetX] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const origin = useRef(null);

  const onPointerDown = (event) => {
    if (disabled) return;
    origin.current = { x: event.clientX, time: event.timeStamp };
    event.currentTarget.setPointerCapture(event.pointerId);
    setIsDragging(true);
  };

  const onPointerMove = (event) => {
    if (origin.current) setOffsetX(event.clientX - origin.current.x);
  };

  const finishDrag = (event) => {
    if (!origin.current) return;
    const direction = decideSwipe({
      distance: event.clientX - origin.current.x,
      elapsedMs: event.timeStamp - origin.current.time,
    });
    origin.current = null;
    setIsDragging(false);
    setOffsetX(0);
    if (direction) onSwipe(direction);
  };

  return {
    offsetX,
    isDragging,
    handlers: { onPointerDown, onPointerMove, onPointerUp: finishDrag, onPointerCancel: finishDrag },
  };
}
