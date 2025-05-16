
-- Crear una función RPC para forzar la actualización de la selección
CREATE OR REPLACE FUNCTION public.force_update_selection(req_id TEXT, selection TEXT)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  result JSON;
BEGIN
  -- Actualizar tanto la selección como el estado
  UPDATE public.story_requests
  SET selected_plot = selection, status = 'seleccion'
  WHERE request_id = req_id;
  
  -- Verificar si la actualización tuvo éxito
  SELECT json_build_object(
    'success', true,
    'selected_plot', selected_plot,
    'status', status
  ) INTO result
  FROM public.story_requests
  WHERE request_id = req_id;
  
  RETURN result;
EXCEPTION
  WHEN OTHERS THEN
    RETURN json_build_object(
      'success', false,
      'error', SQLERRM
    );
END;
$$;
