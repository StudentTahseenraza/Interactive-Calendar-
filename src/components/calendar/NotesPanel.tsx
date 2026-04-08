import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, Edit3, X, StickyNote, Calendar, CalendarRange } from 'lucide-react';
import { CalendarNote, getNotesForDate, getNotesForMonth, formatMonthKey, MONTH_NAMES } from '@/lib/calendar-utils';
import { cn } from '@/lib/utils';

interface NotesPanelProps {
  year: number;
  month: number;
  rangeStart: string | null;
  rangeEnd: string | null;
  notes: CalendarNote[];
  onAddNote: (note: Omit<CalendarNote, 'id' | 'createdAt'>) => void;
  onDeleteNote: (id: string) => void;
  onEditNote: (id: string, text: string) => void;
}

type NoteScope = 'date' | 'range' | 'month';

const NotesPanel = ({
  year, month, rangeStart, rangeEnd, notes, onAddNote, onDeleteNote, onEditNote
}: NotesPanelProps) => {
  const [newText, setNewText] = useState('');
  const [editId, setEditId] = useState<string | null>(null);
  const [editText, setEditText] = useState('');
  const [scope, setScope] = useState<NoteScope>('month');

  const monthKey = formatMonthKey(year, month);
  
  const relevantNotes = (() => {
    const monthNotes = getNotesForMonth(notes, monthKey);
    if (rangeStart && !rangeEnd) {
      return [...getNotesForDate(notes, rangeStart), ...monthNotes];
    }
    if (rangeStart && rangeEnd) {
      const rangeNotes = notes.filter(n => 
        n.type === 'range' && n.startDate === rangeStart && n.endDate === rangeEnd
      );
      const dateNotes = notes.filter(n =>
        n.type === 'date' && n.date && n.date >= rangeStart && n.date <= rangeEnd
      );
      return [...rangeNotes, ...dateNotes, ...monthNotes];
    }
    return monthNotes;
  })();

  const uniqueNotes = Array.from(new Map(relevantNotes.map(n => [n.id, n])).values());

  const handleAdd = () => {
    if (!newText.trim()) return;
    
    if (scope === 'date' && rangeStart && !rangeEnd) {
      onAddNote({ text: newText, type: 'date', date: rangeStart });
    } else if (scope === 'range' && rangeStart && rangeEnd) {
      onAddNote({ text: newText, type: 'range', startDate: rangeStart, endDate: rangeEnd });
    } else {
      onAddNote({ text: newText, type: 'month', month: monthKey });
    }
    setNewText('');
  };

  const handleEdit = (id: string) => {
    if (!editText.trim()) return;
    onEditNote(id, editText);
    setEditId(null);
  };

  const canAddDate = rangeStart && !rangeEnd;
  const canAddRange = rangeStart && rangeEnd;

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-2 mb-4">
        <StickyNote className="w-5 h-5 text-primary" />
        <h3 className="font-display text-lg font-semibold text-foreground">Notes</h3>
      </div>

      {/* Scope selector */}
      <div className="flex gap-1 mb-3">
        <button
          onClick={() => setScope('month')}
          className={cn(
            'flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-body font-medium transition-colors',
            scope === 'month' ? 'bg-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground hover:bg-muted'
          )}
        >
          <Calendar className="w-3 h-3" />
          Month
        </button>
        {canAddDate && (
          <button
            onClick={() => setScope('date')}
            className={cn(
              'flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-body font-medium transition-colors',
              scope === 'date' ? 'bg-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground hover:bg-muted'
            )}
          >
            <Calendar className="w-3 h-3" />
            Date
          </button>
        )}
        {canAddRange && (
          <button
            onClick={() => setScope('range')}
            className={cn(
              'flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-body font-medium transition-colors',
              scope === 'range' ? 'bg-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground hover:bg-muted'
            )}
          >
            <CalendarRange className="w-3 h-3" />
            Range
          </button>
        )}
      </div>

      {/* Add note */}
      <div className="flex gap-2 mb-4">
        <input
          type="text"
          value={newText}
          onChange={e => setNewText(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleAdd()}
          placeholder="Add a note..."
          className="flex-1 px-3 py-2 bg-secondary text-secondary-foreground rounded-lg text-sm font-body border-none outline-none focus:ring-2 focus:ring-ring placeholder:text-muted-foreground"
        />
        <button
          onClick={handleAdd}
          disabled={!newText.trim()}
          className="p-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity disabled:opacity-40"
          aria-label="Add note"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>

      {/* Notes list */}
      <div className="flex-1 overflow-y-auto space-y-2 min-h-0">
        <AnimatePresence>
          {uniqueNotes.length === 0 && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-sm text-muted-foreground font-body text-center py-6"
            >
              No notes for {MONTH_NAMES[month]}
              {rangeStart && !rangeEnd ? ` · ${rangeStart}` : ''}
              {rangeStart && rangeEnd ? ` · ${rangeStart} → ${rangeEnd}` : ''}
            </motion.p>
          )}
          {uniqueNotes.map(note => (
            <motion.div
              key={note.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="group bg-secondary rounded-xl p-3 relative"
            >
              <div className="flex items-start justify-between gap-2">
                {editId === note.id ? (
                  <div className="flex-1 flex gap-1">
                    <input
                      value={editText}
                      onChange={e => setEditText(e.target.value)}
                      onKeyDown={e => e.key === 'Enter' && handleEdit(note.id)}
                      className="flex-1 bg-background text-foreground px-2 py-1 rounded text-sm font-body border-none outline-none"
                      autoFocus
                    />
                    <button onClick={() => handleEdit(note.id)} className="text-primary p-1">
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                    <button onClick={() => setEditId(null)} className="text-muted-foreground p-1">
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ) : (
                  <>
                    <p className="text-sm font-body text-secondary-foreground flex-1">{note.text}</p>
                    <div className="flex gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => { setEditId(note.id); setEditText(note.text); }}
                        className="p-1 rounded hover:bg-muted text-muted-foreground"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => onDeleteNote(note.id)}
                        className="p-1 rounded hover:bg-destructive/10 text-destructive"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </>
                )}
              </div>
              <div className="flex items-center gap-2 mt-1.5">
                <span className={cn(
                  'text-[10px] font-body font-medium uppercase tracking-wider px-1.5 py-0.5 rounded',
                  note.type === 'date' && 'bg-primary/10 text-primary',
                  note.type === 'range' && 'bg-accent/10 text-accent',
                  note.type === 'month' && 'bg-muted text-muted-foreground',
                )}>
                  {note.type === 'date' ? note.date : note.type === 'range' ? `${note.startDate} → ${note.endDate}` : 'Month'}
                </span>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default NotesPanel;
