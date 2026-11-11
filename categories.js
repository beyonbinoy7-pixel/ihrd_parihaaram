export const categories = [
  { id: 'infrastructure', label: 'Infrastructure', labelMl: 'കെട്ടിട സൗകര്യങ്ങൾ', icon: '🏗️', count: 187, color: '#7C3AED' },
  { id: 'internet', label: 'Internet', labelMl: 'ഇന്റർനെറ്റ്', icon: '📶', count: 143, color: '#2563EB' },
  { id: 'electricity', label: 'Electricity', labelMl: 'വൈദ്യുതി', icon: '⚡', count: 98, color: '#D97706' },
  { id: 'sanitation', label: 'Sanitation', labelMl: 'ശുചിത്വം', icon: '🚿', count: 112, color: '#0891B2' },
  { id: 'water', label: 'Water', labelMl: 'ജലം', icon: '💧', count: 76, color: '#0284C7' },
  { id: 'laboratory', label: 'Laboratory', labelMl: 'ലാബ്', icon: '🔬', count: 89, color: '#059669' },
  { id: 'classroom', label: 'Classroom', labelMl: 'ക്ലാസ്സ് മുറി', icon: '🏫', count: 134, color: '#DC2626' },
  { id: 'hostel', label: 'Hostel', labelMl: 'ഹോസ്റ്റൽ', icon: '🏠', count: 67, color: '#7C3AED' },
  { id: 'canteen', label: 'Canteen', labelMl: 'കാന്റീൻ', icon: '🍽️', count: 54, color: '#EA580C' },
  { id: 'library', label: 'Library', labelMl: 'ലൈബ്രറി', icon: '📚', count: 45, color: '#1B4332' },
  { id: 'academic', label: 'Academic', labelMl: 'അക്കാദമിക്', icon: '📝', count: 78, color: '#374151' },
  { id: 'administration', label: 'Administration', labelMl: 'അഡ്മിനിസ്ട്രേഷൻ', icon: '🏛️', count: 56, color: '#6B7280' },
  { id: 'safety', label: 'Safety', labelMl: 'സുരക്ഷ', icon: '🛡️', count: 34, color: '#DC2626' },
  { id: 'other', label: 'Other', labelMl: 'മറ്റുള്ളവ', icon: '📋', count: 49, color: '#9CA3AF' },
];

export const getCategoryById = (id) => categories.find(c => c.id === id);
