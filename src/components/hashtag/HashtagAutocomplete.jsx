import React from 'react';
import { searchCollegeHashtags } from '../../services/hashtag.service.js';
import { Building2, Award } from 'lucide-react';

export default function HashtagAutocomplete({ query = '', onSelect }) {
  const matches = searchCollegeHashtags(query);

  if (!matches || matches.length === 0) return null;

  return (
    <div className="absolute z-50 left-0 right-0 mt-1 bg-white border border-slate-200 rounded-xl shadow-xl overflow-hidden max-h-56 overflow-y-auto divide-y divide-slate-100">
      <div className="px-3 py-1.5 bg-slate-50 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
        Registered College Hashtags
      </div>
      {matches.map((college) => (
        <button
          key={college.id}
          type="button"
          onClick={() => onSelect(college)}
          className="w-full text-left px-3 py-2.5 hover:bg-slate-50 flex items-center justify-between transition group"
        >
          <div className="flex items-center gap-2.5">
            <span className="px-2 py-0.5 rounded bg-cyan-50 text-cyan-800 font-mono font-bold text-xs border border-cyan-200">
              {college.hashtag}
            </span>
            <div>
              <div className="text-xs font-semibold text-slate-900 group-hover:text-cyan-700 transition">
                {college.name}
              </div>
              <div className="text-[11px] text-slate-500">{college.location}</div>
            </div>
          </div>

          <div className="flex items-center gap-1 text-xs text-amber-800 bg-amber-50 px-2 py-0.5 rounded font-semibold border border-amber-200">
            <Award className="w-3 h-3 text-amber-600" />
            <span>#{college.currentRank}</span>
          </div>
        </button>
      ))}
    </div>
  );
}
