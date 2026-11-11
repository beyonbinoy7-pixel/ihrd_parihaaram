import React, { useEffect, useState } from 'react';
import Navbar from '../components/common/Navbar.jsx';
import Footer from '../components/common/Footer.jsx';
import AdminSidebar from '../components/admin/AdminSidebar.jsx';
import ClickableHashtag from '../components/hashtag/ClickableHashtag.jsx';
import { db } from '../services/db.service.js';
import { useToast } from '../context/ToastContext.jsx';
import { Building2, CircleUserRound, KeyRound, Search, UserPlus } from 'lucide-react';

const INITIAL_FORM = {
  name: '',
  facultyId: '',
  email: '',
  password: '',
  department: ''
};

export default function AdminFacultyManagementPage({ currentUser }) {
  const toast = useToast();
  const [form, setForm] = useState(INITIAL_FORM);
  const [search, setSearch] = useState('');
  const [, setRefreshKey] = useState(0);
  const college = db.getCollegeById(currentUser?.collegeCode?.toLowerCase()) || db.getCollegeById('cek');

  useEffect(() => {
    const unsubscribe = db.subscribe(() => setRefreshKey(value => value + 1));
    return unsubscribe;
  }, []);

  const query = search.trim().toLowerCase();
  const facultyMembers = db.getFaculty(college.code).filter(faculty =>
    !query ||
    faculty.name?.toLowerCase().includes(query) ||
    faculty.facultyId?.toLowerCase().includes(query) ||
    faculty.email?.toLowerCase().includes(query) ||
    faculty.department?.toLowerCase().includes(query)
  );

  const handleChange = (event) => {
    setForm(current => ({ ...current, [event.target.name]: event.target.value }));
  };

  const handleCreate = (event) => {
    event.preventDefault();
    if (form.password.length < 8) {
      toast.warning('Use a password with at least 8 characters.');
      return;
    }

    const result = db.createFaculty({ ...form, collegeCode: college.code });
    if (!result.success) {
      toast.error(result.message);
      return;
    }

    toast.success(`Faculty account ${result.user.facultyId} created.`);
    setForm(INITIAL_FORM);
  };

  return (
    <div className="min-h-screen bg-stone-50 text-stone-900 flex flex-col">
      <Navbar currentUser={currentUser} portal="ADMIN" />

      <div className="flex flex-1">
        <AdminSidebar currentCollege={college} />
        <main className="mx-auto w-full max-w-7xl flex-1 space-y-7 px-4 py-8 sm:px-6">
          <section className="rounded-3xl border border-stone-200 bg-white p-6 shadow-sm sm:p-8">
            <div className="flex flex-wrap items-start justify-between gap-5">
              <div>
                <span className="inline-flex items-center gap-2 rounded-full bg-amber-900 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-amber-50">
                  <CircleUserRound className="h-3.5 w-3.5 text-amber-300" />
                  Faculty access
                </span>
                <h1 className="mt-4 text-2xl font-black sm:text-4xl">Faculty accounts</h1>
                <p className="mt-2 max-w-2xl text-sm text-stone-500">
                  Create sign-in accounts for faculty who receive campus problem assignments.
                </p>
                <p className="mt-3 flex items-center gap-2 text-xs font-bold text-stone-600">
                  <Building2 className="h-4 w-4 text-amber-800" />
                  {college.name} · {college.hashtag}
                </p>
              </div>
              <ClickableHashtag tag={college.hashtag} />
            </div>
          </section>

          <div className="grid gap-6 lg:grid-cols-[minmax(0,1.3fr)_minmax(320px,0.7fr)]">
            <section className="rounded-3xl border border-stone-200 bg-white p-5 shadow-sm sm:p-6">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h2 className="text-lg font-black">Faculty directory</h2>
                  <p className="mt-1 text-xs text-stone-500">{facultyMembers.length} account{facultyMembers.length === 1 ? '' : 's'} at {college.hashtag}</p>
                </div>
                <div className="relative">
                  <Search className="absolute left-3 top-2.5 h-4 w-4 text-stone-400" />
                  <input
                    type="search"
                    value={search}
                    onChange={event => setSearch(event.target.value)}
                    placeholder="Search faculty"
                    className="w-full rounded-xl border border-stone-300 bg-stone-50 py-2 pl-9 pr-3 text-xs outline-none focus:border-amber-800 sm:w-56"
                  />
                </div>
              </div>

              {facultyMembers.length === 0 ? (
                <div className="mt-6 rounded-2xl border border-dashed border-stone-300 px-5 py-12 text-center text-sm text-stone-500">
                  No faculty accounts found. Create an account to make faculty available in assignments.
                </div>
              ) : (
                <div className="mt-5 space-y-3">
                  {facultyMembers.map(faculty => (
                    <article key={faculty.id} className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-stone-200 bg-stone-50/70 p-4">
                      <div className="flex min-w-0 items-center gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-900 text-sm font-black text-cyan-200">
                          {faculty.name?.charAt(0)?.toUpperCase() || 'F'}
                        </div>
                        <div className="min-w-0">
                          <p className="truncate text-sm font-bold text-stone-900">{faculty.name}</p>
                          <p className="truncate text-xs text-stone-500">{faculty.email}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-mono text-xs font-bold text-amber-900">{faculty.facultyId}</p>
                        <p className="mt-1 text-[11px] text-stone-500">{faculty.department}</p>
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </section>

            <section className="h-fit rounded-3xl border border-stone-200 bg-white p-5 shadow-sm sm:p-6">
              <div className="mb-5">
                <h2 className="text-lg font-black">Create faculty account</h2>
                <p className="mt-1 text-xs leading-5 text-stone-500">Share the new ID and password with the faculty member securely.</p>
              </div>
              <form onSubmit={handleCreate} className="space-y-4">
                <Field label="Full name">
                  <input name="name" required maxLength={150} value={form.name} onChange={handleChange} className={inputClass} placeholder="Faculty member name" />
                </Field>
                <Field label="Faculty ID">
                  <input name="facultyId" required maxLength={50} value={form.facultyId} onChange={handleChange} className={`${inputClass} font-mono`} placeholder="e.g. FAC002" />
                </Field>
                <Field label="Email">
                  <input name="email" type="email" required maxLength={150} value={form.email} onChange={handleChange} className={inputClass} placeholder="name@college.edu" />
                </Field>
                <Field label="Department">
                  <input name="department" required maxLength={100} value={form.department} onChange={handleChange} className={inputClass} placeholder="e.g. Electrical Maintenance" />
                </Field>
                <Field label="Temporary password">
                  <div className="relative">
                    <KeyRound className="absolute left-3 top-3 h-4 w-4 text-stone-400" />
                    <input
                      name="password"
                      type="password"
                      required
                      minLength={8}
                      autoComplete="new-password"
                      value={form.password}
                      onChange={handleChange}
                      className={`${inputClass} pl-10`}
                      placeholder="At least 8 characters"
                    />
                  </div>
                </Field>
                <button type="submit" className="flex w-full items-center justify-center gap-2 rounded-xl bg-accent px-4 py-3 text-xs font-extrabold text-white transition hover:bg-blue-500">
                  <UserPlus className="h-4 w-4" />
                  Create faculty account
                </button>
              </form>
            </section>
          </div>
        </main>
      </div>

      <Footer />
    </div>
  );
}

const inputClass = 'w-full rounded-xl border border-stone-300 bg-stone-50 px-3.5 py-2.5 text-sm outline-none transition focus:border-amber-800 focus:bg-white';

function Field({ label, children }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-[10px] font-bold uppercase tracking-wider text-stone-700">{label}</span>
      {children}
    </label>
  );
}
