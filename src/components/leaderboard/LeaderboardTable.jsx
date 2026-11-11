import React from 'react';
import { Link } from 'react-router-dom';
import { getWeeklyLeaderboard } from '../../services/leaderboard.service.js';
import { Award, Building2, TrendingUp, TrendingDown, Minus, Star } from 'lucide-react';

export default function LeaderboardTable({ collegesList }) {
  const ranked = getWeeklyLeaderboard(collegesList);

  return (
    <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-slate-700">
          <thead className="bg-slate-50 text-xs font-bold uppercase tracking-wider text-slate-600 border-b border-slate-200">
            <tr>
              <th className="px-4 py-3.5 text-center">Rank</th>
              <th className="px-4 py-3.5">College & Hashtag</th>
              <th className="px-4 py-3.5 text-right">Civic Score</th>
              <th className="px-4 py-3.5 text-right">Resolution Rate</th>
              <th className="px-4 py-3.5 text-right">Avg Speed</th>
              <th className="px-4 py-3.5 text-right">Satisfaction</th>
              <th className="px-4 py-3.5 text-right">SLA Compliance</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {ranked.map((col) => {
              let rankBg = 'bg-slate-100 text-slate-700 border-slate-200';
              if (col.currentRank === 1) rankBg = 'bg-amber-100 text-amber-900 border-amber-300 font-black';
              if (col.currentRank === 2) rankBg = 'bg-slate-200 text-slate-800 border-slate-300 font-bold';
              if (col.currentRank === 3) rankBg = 'bg-amber-50 text-amber-800 border-amber-200 font-bold';

              return (
                <tr key={col.id} className="hover:bg-slate-50 transition group">
                  <td className="px-4 py-4 text-center">
                    <div className="flex flex-col items-center justify-center">
                      <span className={`w-8 h-8 rounded-xl flex items-center justify-center border text-xs ${rankBg}`}>
                        #{col.currentRank}
                      </span>
                      {col.movementType === 'UP' && (
                        <span className="text-[10px] text-cyan-700 font-bold flex items-center mt-1">
                          <TrendingUp className="w-3 h-3 mr-0.5" /> {col.rankMovementText}
                        </span>
                      )}
                      {col.movementType === 'DOWN' && (
                        <span className="text-[10px] text-rose-700 font-bold flex items-center mt-1">
                          <TrendingDown className="w-3 h-3 mr-0.5" /> {col.rankMovementText}
                        </span>
                      )}
                      {col.movementType === 'NONE' && (
                        <span className="text-[10px] text-slate-400 font-bold flex items-center mt-1">
                          <Minus className="w-3 h-3" />
                        </span>
                      )}
                    </div>
                  </td>

                  <td className="px-4 py-4">
                    <Link to={`/college/${col.code.toLowerCase()}`} className="group-hover:text-cyan-700 transition">
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="px-2.5 py-0.5 rounded bg-cyan-50 text-cyan-800 font-mono font-bold text-xs border border-cyan-200">
                          {col.hashtag}
                        </span>
                        <span className="font-bold text-slate-900 text-sm group-hover:text-cyan-700 transition">
                          {col.name}
                        </span>
                      </div>
                      <div className="text-xs text-slate-500">{col.location}</div>
                    </Link>
                  </td>

                  <td className="px-4 py-4 text-right">
                    <span className="text-base font-extrabold text-slate-900">
                      {col.calculatedScore || col.performanceScore}
                    </span>
                    <span className="text-xs text-slate-400 font-normal"> / 100</span>
                  </td>

                  <td className="px-4 py-4 text-right font-bold text-cyan-700">
                    {col.resolutionRate}%
                  </td>

                  <td className="px-4 py-4 text-right text-slate-700">
                    {col.avgResolutionTimeHours}h
                  </td>

                  <td className="px-4 py-4 text-right">
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-amber-50 text-amber-800 font-semibold text-xs border border-amber-200">
                      <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                      {col.studentSatisfaction}
                    </span>
                  </td>

                  <td className="px-4 py-4 text-right font-bold text-sky-700">
                    {col.slaCompliance}%
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
