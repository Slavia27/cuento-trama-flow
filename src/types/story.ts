
import { Json } from '@/integrations/supabase/types';

export type FormData = {
  codigoPedido: string;
  nombreCompleto: string;
  nombreHijo: string;
  edadHijo: string;
  conQuienVive: string;
  personalidadHijo: string;
  dinamicaFamiliar: string;
  cambiosRecientes: string;
  situacionTrabajo: string;
  cuandoOcurre: string;
  porQueOcurre: string;
  aquienAfecta: string;
  preocupacionPadres: string;
  aspectosDificiles: string;
  conductaHijo: string;
  accionesIntentadas: string;
  resultadosAcciones: string;
  enseñanzaHistoria: string;
  objetivos: string[];
  otrosObjetivos?: string;
  rutinaHijo: string;
  interesesHijo: string;
  cosasNoLeGustan: string;
  tradicionesValores: string;
  expresionesFamiliares: string;
  temasEvitar: string;
};

export type StoryStatus = 'pendiente' | 'opciones' | 'seleccion' | 'pagado' | 'produccion' | 'envio' | 'completado';

export type PlotOption = {
  id: string;
  title: string;
  description: string;
};

export type StoryRequest = {
  id: string;
  name: string;
  email: string;
  childName: string;
  childAge: string;
  storyTheme: string;
  specialInterests: string;
  additionalDetails?: string;
  status: StoryStatus;
  createdAt: string;
  plotOptions?: PlotOption[];
  selectedPlot?: string;
  illustrationStyle?: string;
  productionDays?: number;
  formData?: FormData | Json;
};
