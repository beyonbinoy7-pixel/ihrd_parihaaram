import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { resolveCollegeHashtag } from '../../services/hashtag.service.js';
import { Building2 } from 'lucide-react';

export default function ClickableHashtag({ tag }) {
  const [showTooltip, setShowTooltip] = useState(false);
  const college = resolveCollegeHashtag(tag);
  const cleanTag = tag.startsWith('#') ? tag : `#${tag}`;

  if (!college) {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-slate-100 text-slate-500 text-xs font-mono border border-slate-200">
        {cleanTag}
      </span>
    );
  }

  return (
    <div 
      className="relative inline-block"
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
    >
      <Link
        to={`/college/${college.code.toLowerCase()}`}
        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-cyan-50 text-cyan-800 hover:bg-cyan-100 border border-cyan-300 text-xs font-bold font-mono transition shadow-2xs"
      >
        <Building2 className="w-3.5 h-3.5" />
        {college.hashtag}
      </Link>

      {/* Tooltip Card */}
      {showTooltip && (
        <div className="absolute left-0 bottom-full mb-2 w-64 p-3.5 bg-white border border-slate-200 rounded-xl shadow-xl z-50 text-xs animate-in fade-in zoom-in-95 duration-150">
          <div className="flex items-center justify-between mb-2">
            <span className="font-bold text-slate-900 text-sm">{college.hashtag}</span>
            <span className="px-2 py-0.5 rounded bg-cyan-50 text-cyan-800 font-bold border border-cyan-200">
              Rank #{college.currentRank}
            </span>
          </div>
          <p className="text-slate-700 font-medium line-clamp-2 mb-2">{college.name}</p>
          <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100 text-slate-500">
            <div>
              <span className="block text-[10px] text-slate-400">Score</span>
              <strong className="text-slate-900">{college.performanceScore} / 100</strong>
            </div>
            <div>
              <span className="block text-[10px] text-slate-400">Resolved</span>
              <strong className="text-cyan-700">{college.resolutionRate}%</strong>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
