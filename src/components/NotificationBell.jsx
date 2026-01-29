import React, { useEffect, useState } from 'react';
import contractService from '../services/contractService';

function NotificationBell({ onClick, pollMs = 30000 }) {
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(false);

  const refresh = async () => {
    try {
      setLoading(true);
      const c = await contractService.getUnreadCount();
      setCount(Number(c) || 0);
    } catch (e) {
      // silencieux
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refresh();
    if (pollMs && pollMs >= 1000) {
      const id = setInterval(refresh, pollMs);
      return () => clearInterval(id);
    }
  }, [pollMs]);

  return (
    <button
      type="button"
      onClick={() => {
        if (onClick) onClick();
        refresh();
      }}
      className="relative inline-flex items-center justify-center p-2 rounded-full hover:bg-orange-400/20"
      title="Notifications"
    >
      <i className="ri-notification-line text-xl text-orange-500" />
      {(count > 0 && !loading) && (
        <span className="absolute -top-1 -right-1 bg-orange-400/20 text-orange-500 text-xs rounded-full h-5 min-w-[20px] px-1 flex items-center justify-center">
          {count}
        </span>
      )}
    </button>
  );
}

export default NotificationBell;
