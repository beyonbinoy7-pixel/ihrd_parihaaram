import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Shield, 
  AlertOctagon, 
  FileText, 
  UserCheck, 
  Building2, 
  Award, 
  BarChart3, 
  Users,
  UserRound
} from 'lucide-react';

export default function AdminSidebar({ currentCollege }) {
  const location = useLocation();

  const navItems = [
    { label: 'Overview Dashboard', path: '/admin/dashboard', icon: Shield },
    { label: 'Complaints List', path: '/admin/problems', icon: FileText },
    { label: 'Student Management', path: '/admin/students', icon: Users },
    { label: 'Faculty Accounts', path: '/admin/faculty', icon: UserRound },
    { label: 'Critical Risks', path: '/admin/critical', icon: AlertOctagon, badge: 'High Risk' },
    { label: 'Leaderboard', path: '/leaderboard', icon: Award },
    { label: 'SLA Analytics', path: '/admin/analytics', icon: BarChart3 },
  ];

  return (
    <aside className="w-full md:w-64 shrink-0 bg-slate-950 border-b md:border-b-0 md:border-r border-stone-200 md:min-h-screen p-3 md:p-4 space-y-4 md:space-y-6 flex flex-col justify-between shadow-xs">
      <div className="space-y-6">
        
        {/* College Command Banner */}
        <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 shadow-2xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-amber-900">Campus Command</span>
            <span className="px-2 py-0.5 rounded bg-amber-900 text-amber-100 font-mono font-bold text-xs">
              {currentCollege?.hashtag || '#CEK'}
            </span>
          </div>
          <h3 className="font-bold text-stone-900 text-sm line-clamp-1">
            {currentCollege?.name || 'College of Engineering, Kalloopara'}
          </h3>
        </div>

        {/* Navigation items */}
        <nav aria-label="Admin navigation" className="admin-nav-scroll flex gap-2 overflow-x-auto pb-1 md:flex-col md:overflow-visible">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;

            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex shrink-0 items-center justify-between px-3.5 py-2.5 rounded-xl font-semibold text-xs transition ${
                  isActive
                    ? 'bg-accent text-white shadow-2xs'
                    : 'text-stone-600 hover:bg-stone-50 hover:text-stone-900'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-amber-300' : 'text-stone-400'}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className="px-1.5 py-0.5 rounded text-[10px] bg-rose-50 text-rose-700 font-bold border border-rose-200">
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="hidden md:block pt-4 border-t border-stone-100 text-xs text-stone-500 space-y-1">
        <p className="font-bold text-stone-700">PARIHAARAM Command</p>
        <p>Single Source of Truth Active</p>
      </div>
    </aside>
  );
}
