
import React from 'react';
import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table';
import { FormData } from '@/types/story';
import { Json } from '@/integrations/supabase/types';

export const FormDetailViewer = ({ formData }: { formData?: FormData | Json }) => {
  if (!formData) return <p>No hay datos de formulario disponibles</p>;

  // Check and convert formData to the correct type
  const data = formData as FormData;
  
  const hasRequiredFields = data && 
    typeof data === 'object' && 
    'nombreHijo' in data && 
    'nombreCompleto' in data;

  if (!hasRequiredFields) {
    return <p className="text-red-500">El formato de los datos del formulario es incorrecto</p>;
  }

  return (
    <div className="space-y-6 max-h-[70vh] overflow-y-auto p-2">
      <div>
        <h3 className="text-lg font-semibold mb-2 border-b pb-1">Información Básica</h3>
        <Table>
          <TableBody>
            <TableRow>
              <TableCell className="font-medium">Código de pedido</TableCell>
              <TableCell>{data.codigoPedido}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium">Nombre completo</TableCell>
              <TableCell>{data.nombreCompleto}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium">Nombre del hijo/a</TableCell>
              <TableCell>{data.nombreHijo}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium">Edad</TableCell>
              <TableCell>{data.edadHijo}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium">Con quién vive</TableCell>
              <TableCell>{data.conQuienVive}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium">Personalidad</TableCell>
              <TableCell>{data.personalidadHijo}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-2 border-b pb-1">Contexto Familiar</h3>
        <Table>
          <TableBody>
            <TableRow>
              <TableCell className="font-medium">Dinámica familiar</TableCell>
              <TableCell>{data.dinamicaFamiliar}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium">Cambios recientes</TableCell>
              <TableCell>{data.cambiosRecientes}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-2 border-b pb-1">Situación Actual</h3>
        <Table>
          <TableBody>
            <TableRow>
              <TableCell className="font-medium">Situación a trabajar</TableCell>
              <TableCell>{data.situacionTrabajo}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium">Cuándo ocurre</TableCell>
              <TableCell>{data.cuandoOcurre}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium">Por qué ocurre</TableCell>
              <TableCell>{data.porQueOcurre}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium">A quién afecta</TableCell>
              <TableCell>{data.aquienAfecta}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-2 border-b pb-1">Desafíos Identificados</h3>
        <Table>
          <TableBody>
            <TableRow>
              <TableCell className="font-medium">Preocupación de padres</TableCell>
              <TableCell>{data.preocupacionPadres}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium">Aspectos difíciles</TableCell>
              <TableCell>{data.aspectosDificiles}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium">Conducta del hijo</TableCell>
              <TableCell>{data.conductaHijo}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-2 border-b pb-1">Acciones Intentadas</h3>
        <Table>
          <TableBody>
            <TableRow>
              <TableCell className="font-medium">Acciones intentadas</TableCell>
              <TableCell>{data.accionesIntentadas}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium">Resultados de acciones</TableCell>
              <TableCell>{data.resultadosAcciones}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium">Enseñanza deseada</TableCell>
              <TableCell>{data.enseñanzaHistoria}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-2 border-b pb-1">Objetivos</h3>
        <Table>
          <TableBody>
            <TableRow>
              <TableCell className="font-medium">Objetivos seleccionados</TableCell>
              <TableCell>
                <ul className="list-disc pl-5">
                  {data.objetivos.map((obj, idx) => (
                    <li key={idx}>{obj}</li>
                  ))}
                </ul>
                {data.otrosObjetivos && (
                  <div className="mt-2">
                    <strong>Otros: </strong>{data.otrosObjetivos}
                  </div>
                )}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-2 border-b pb-1">Personalización</h3>
        <Table>
          <TableBody>
            <TableRow>
              <TableCell className="font-medium">Rutina</TableCell>
              <TableCell>{data.rutinaHijo}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium">Intereses</TableCell>
              <TableCell>{data.interesesHijo}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium">Lo que no le gusta</TableCell>
              <TableCell>{data.cosasNoLeGustan}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium">Tradiciones y valores</TableCell>
              <TableCell>{data.tradicionesValores}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium">Expresiones significativas</TableCell>
              <TableCell>{data.expresionesFamiliares}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-2 border-b pb-1">Otros</h3>
        <Table>
          <TableBody>
            <TableRow>
              <TableCell className="font-medium">Temas a evitar</TableCell>
              <TableCell>{data.temasEvitar}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default FormDetailViewer;
