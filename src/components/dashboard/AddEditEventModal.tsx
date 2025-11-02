// Local do arquivo: src/components/dashboard/AddEditEventModal.tsx

import { useState, useEffect } from 'react';
import { CalendarEvent } from '@/types/member';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar, CheckSquare, Trash2 } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar as CalendarPicker } from '@/components/ui/calendar';
import { format, parse } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface AddEditEventModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (eventData: Omit<CalendarEvent, 'id'>) => void;
  onUpdate: (eventId: string, updates: Partial<Omit<CalendarEvent, 'id'>>) => void;
  onDelete: (eventId: string) => void;
  event: Partial<CalendarEvent> & { originalTitle?: string } | null;
}

const eventColors = ['#3b82f6', '#22c55e', '#f97316', '#8b5cf6', '#ec4899'];

export const AddEditEventModal = ({ isOpen, onClose, onSave, onUpdate, onDelete, event }: AddEditEventModalProps) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState<'event' | 'task'>('event');
  const [date, setDate] = useState<Date | undefined>();
  const [color, setColor] = useState<string>('#3b82f6');

  useEffect(() => {
    if (isOpen && event) {
      setTitle(event.originalTitle || event.title || '');
      setDescription(event.description || '');
      setType(event.type === 'task' ? 'task' : 'event');
      setDate(event.date ? parse(event.date, 'yyyy-MM-dd', new Date()) : new Date());
      setColor(event.color || (event.type === 'birthday' ? '#ec4899' : '#3b82f6'));
    }
  }, [isOpen, event]);

  const handleSave = () => {
    if (!event || !date) return;
    
    const eventData = {
      title,
      description,
      type,
      date: format(date, 'yyyy-MM-dd'),
      color
    };
    
    // ✅ LÓGICA DE SALVAMENTO CORRIGIDA E FINAL
    // Se o evento tem um ID e já é um evento personalizado, ele atualiza.
    // Se for um evento novo (sem ID) ou um aniversário, ele cria um novo evento personalizado.
    if (event.id && event.type !== 'birthday') {
      onUpdate(event.id, eventData);
    } else {
      onSave(eventData);
    }
    onClose();
  };

  const handleDelete = () => {
    if (event?.id && event.type !== 'birthday') {
      onDelete(event.id);
    }
    onClose();
  }

  if (!event) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle>{event.id && event.type !== 'birthday' ? 'Editar Evento' : 'Adicionar Evento'}</DialogTitle>
        </DialogHeader>
        <div className="py-4 space-y-4">
          <Input 
            placeholder="Adicionar título" 
            value={title} 
            onChange={(e) => setTitle(e.target.value)}
            className="text-lg h-12"
          />
          <Tabs value={type} onValueChange={(value) => setType(value as 'event' | 'task')}>
            <TabsList>
              <TabsTrigger value="event"><Calendar className="w-4 h-4 mr-2"/> Evento</TabsTrigger>
              <TabsTrigger value="task"><CheckSquare className="w-4 h-4 mr-2"/> Tarefa</TabsTrigger>
            </TabsList>
          </Tabs>

          <div className="flex items-center gap-4">
             <Popover>
                <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-start text-left font-normal">
                        <Calendar className="mr-2 h-4 w-4" />
                        {date ? format(date, "PPP", { locale: ptBR }) : <span>Escolha uma data</span>}
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                    <CalendarPicker mode="single" selected={date} onSelect={setDate} initialFocus />
                </PopoverContent>
            </Popover>
          </div>

          <Textarea
            placeholder="Adicionar uma descrição..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">Cor:</span>
            {eventColors.map(c => (
                <button key={c} onClick={() => setColor(c)} style={{ backgroundColor: c }} className={`w-6 h-6 rounded-full border-2 ${color === c ? 'border-foreground' : 'border-transparent'}`}></button>
            ))}
          </div>
        </div>
        <DialogFooter className="justify-between">
          <div>
            {event.id && event.type !== 'birthday' && (
              <Button variant="destructive" size="icon" onClick={handleDelete}>
                <Trash2 className="w-4 h-4" />
              </Button>
            )}
          </div>
          <Button onClick={handleSave}>Salvar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};