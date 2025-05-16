
import React from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Eye, Trash2 } from 'lucide-react';
import { StoryRequest } from '@/types/story';
import FormDetailViewer from './FormDetailViewer';

interface RequestItemProps {
  request: StoryRequest;
  isSelected: boolean;
  onSelect: (request: StoryRequest) => void;
  onDelete: (id: string) => void;
}

const RequestItem = ({ request, isSelected, onSelect, onDelete }: RequestItemProps) => {
  return (
    <div
      className={`p-3 rounded-lg border cursor-pointer hover:bg-muted transition-colors ${
        isSelected ? 'bg-muted border-primary' : ''
      }`}
    >
      <div className="flex justify-between">
        <div className="flex-grow" onClick={() => onSelect(request)}>
          <p className="font-medium">{request.name}</p>
          <p className="text-sm text-muted-foreground">Niño/a: {request.childName}, {request.childAge} años</p>
          <p className="text-sm text-muted-foreground">Tema: {request.storyTheme}</p>
        </div>
        <div className="flex flex-col gap-2">
          <Dialog>
            <DialogTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-8 w-8"
                onClick={(e) => e.stopPropagation()}
              >
                <Eye className="h-4 w-4" />
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[800px]">
              <DialogHeader>
                <DialogTitle>Detalles del Formulario</DialogTitle>
                <DialogDescription>
                  Respuestas completas de {request.name} para {request.childName}
                </DialogDescription>
              </DialogHeader>
              <FormDetailViewer formData={request.formData} />
              <DialogFooter>
                <DialogClose asChild>
                  <Button>Cerrar</Button>
                </DialogClose>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          
          <Dialog>
            <DialogTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-8 w-8 text-destructive hover:text-destructive/90"
                onClick={(e) => e.stopPropagation()}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Confirmar eliminación</DialogTitle>
                <DialogDescription>
                  ¿Estás seguro que deseas eliminar la solicitud de {request.childName}? Esta acción no se puede deshacer.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <DialogClose asChild>
                  <Button variant="outline">Cancelar</Button>
                </DialogClose>
                <Button 
                  variant="destructive" 
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(request.id);
                  }}
                >
                  Eliminar
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>
      <div className="flex justify-between items-center">
        <p className="text-xs text-muted-foreground mt-1">
          {new Date(request.createdAt).toLocaleDateString()}
        </p>
      </div>
    </div>
  );
};

export default RequestItem;
