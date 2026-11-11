import React, { useState } from 'react';
import { db } from '../../services/db.service.js';
import { Bell, Check, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function NotificationBell({ user }) {
  const [isOpen, setIsOpen] = useState(false);
  const notifications = db.getNotifications(user.id || user.studentId, user.role);
  const unreadCount = notifications.filter(n => !n.read).length;

  const handleMarkRead = (id) => {
    db.markNotificationRead(id);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition border border-slate-200"
        aria-label="Notifications"
        aria-expanded={isOpen}
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-rose-500 text-white text-[10px] font-black flex items-center justify-center shadow-md animate-pulse">
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-3 w-80 sm:w-96 bg-white border border-slate-200 rounded-2xl shadow-xl z-50 overflow-hidden divide-y divide-slate-100 animate-in fade-in zoom-in-95 duration-150">
          <div className="px-4 py-3 bg-slate-50 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bell className="w-4 h-4 text-cyan-600" />
              <h4 className="text-sm font-bold text-slate-900">Notifications</h4>
            </div>
            <span className="text-xs text-slate-500 font-medium">
              {unreadCount} unread
            </span>
          </div>

          <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
            {notifications.length === 0 ? (
              <div className="p-6 text-center text-slate-500 text-xs">
                No notifications right now.
              </div>
            ) : (
              notifications.map((n) => (
                <div
                  key={n.id}
                  className={`p-3.5 hover:bg-slate-50 transition flex items-start justify-between gap-3 ${
                    !n.read ? 'bg-cyan-50/60 border-l-3 border-l-cyan-600' : ''
                  }`}
                >
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between">
                      <h5 className="text-xs font-bold text-slate-900">{n.title}</h5>
                      <span className="text-[10px] text-slate-400">
                        {new Date(n.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 line-clamp-2">{n.message}</p>
                    {n.problemId && (
                      <Link
                        to={`/reports/${n.problemId}`}
                        onClick={() => {
                          handleMarkRead(n.id);
                          setIsOpen(false);
                        }}
                        className="inline-flex items-center gap-1 text-[11px] font-bold text-cyan-700 hover:underline pt-1"
                      >
                        <span>View Ticket ({n.problemId})</span>
                        <ExternalLink className="w-3 h-3" />
                      </Link>
                    )}
                  </div>

                  {!n.read && (
                    <button
                      onClick={() => handleMarkRead(n.id)}
                      className="text-slate-400 hover:text-cyan-700 p-1"
                      title="Mark read"
                    >
                      <Check className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
