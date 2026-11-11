import React from 'react';
import { Link } from 'react-router-dom';
import StatusBadge from '../common/StatusBadge.jsx';
import PriorityBadge from '../common/PriorityBadge.jsx';
import SlaIndicator from '../common/SlaIndicator.jsx';
import ClickableHashtag from '../hashtag/ClickableHashtag.jsx';
import { db } from '../../services/db.service.js';
import { MapPin, Users, Calendar, ArrowRight, Sparkles } from 'lucide-react';

export default function ProblemCard({ problem, currentUser, onUpdate, dark = true }) {
  const isAffected = (problem.affectedUserIds || []).includes(currentUser?.id || currentUser?.studentId);

  const handleAffectedClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const result = db.addAffectedUser(problem.id, currentUser?.id || currentUser?.studentId);
    if (result.success && onUpdate) {
      onUpdate();
    }
  };

  return (
    <div className="bg-zinc-900/90 border border-zinc-800 hover:border-zinc-700 rounded-2xl p-5 shadow-xl hover:shadow-[0_8px_30px_rgb(0,0,0,0.6)] transition-all duration-200 group flex flex-col justify-between backdrop-blur-xl relative overflow-hidden">
      {/* Subtle hover gradient on card */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/[0.03] to-transparent pointer-events-none" />

      <div className="relative z-10">
        {/* Top Header Row */}
        <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs font-bold text-white bg-zinc-800 px-2.5 py-0.5 rounded border border-zinc-700">
              {problem.ticketId || problem.id}
            </span>
            <ClickableHashtag tag={problem.collegeHashtag || '#CEK'} />
          </div>

          <StatusBadge status={problem.status} />
        </div>

        {/* Title & Description */}
        <Link to={`/student/reports/${problem.id}`} className="block group-hover:text-white transition">
          <h3 className="text-base font-extrabold text-zinc-100 mb-1 line-clamp-1 group-hover:translate-x-0.5 transition-transform">
            {problem.title}
          </h3>
        </Link>

        <p className="text-xs text-zinc-400 line-clamp-2 mb-4 leading-relaxed font-medium">
          {problem.description}
        </p>

        {/* Category & Location info */}
        <div className="grid grid-cols-2 gap-2 text-xs text-zinc-300 bg-zinc-950/70 p-3 rounded-xl border border-zinc-800/80 mb-4">
          <div className="flex items-center gap-1.5 truncate">
            <MapPin className="w-3.5 h-3.5 text-zinc-300 shrink-0" />
            <span className="truncate">{problem.building || 'Main Block'} ({problem.room || 'Room'})</span>
          </div>
          <div className="flex items-center gap-1.5 justify-end text-zinc-400 font-medium">
            <Calendar className="w-3.5 h-3.5 text-zinc-500 shrink-0" />
            <span>{new Date(problem.createdAt || Date.now()).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</span>
          </div>
        </div>
      </div>

      {/* Bottom Footer Row */}
      <div className="pt-3 border-t border-zinc-800/80 flex flex-wrap items-center justify-between gap-2 relative z-10">
        <div className="flex items-center gap-2">
          <PriorityBadge priority={problem.systemPriority} />
          <SlaIndicator createdAt={problem.createdAt} slaDueAt={problem.slaDueAt} currentStatus={problem.status} />
        </div>

        <div className="flex items-center gap-2">
          {/* Affected Users button */}
          <button
            onClick={handleAffectedClick}
            disabled={isAffected}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition ${
              isAffected 
                ? 'bg-white/10 text-white border border-white/30' 
                : 'bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700'
            }`}
            title="I'm Affected Too button"
          >
            <Users className="w-3.5 h-3.5 text-zinc-400" />
            <span>{problem.affectedCount || 1} Affected</span>
            {!isAffected && <span className="text-[10px] text-white font-bold ml-1">+1 Me</span>}
          </button>

          {/* Details button */}
          <Link
            to={`/student/reports/${problem.id}`}
            className="p-1.5 rounded-lg bg-accent text-white hover:bg-blue-500 transition font-bold"
            title="View Details"
          >
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
