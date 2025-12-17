-- Create a trigger function to automatically update equipment availability when a rental is created
CREATE OR REPLACE FUNCTION public.update_equipment_availability_on_rental()
RETURNS TRIGGER AS $$
BEGIN
  -- Only process if equipment_id is provided
  IF NEW.equipment_id IS NOT NULL THEN
    -- Decrease available_quantity by 1
    UPDATE public.equipment_inventory
    SET 
      available_quantity = available_quantity - 1,
      updated_at = now()
    WHERE id = NEW.equipment_id
      AND available_quantity > 0;
    
    -- Check if update was successful (equipment was available)
    IF NOT FOUND THEN
      RAISE EXCEPTION 'Equipment is not available or does not exist';
    END IF;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Create trigger on patient_history table for INSERT
DROP TRIGGER IF EXISTS trigger_update_equipment_on_rental ON public.patient_history;
CREATE TRIGGER trigger_update_equipment_on_rental
  BEFORE INSERT ON public.patient_history
  FOR EACH ROW
  EXECUTE FUNCTION public.update_equipment_availability_on_rental();

-- Also create a function to restore availability when rental is returned
CREATE OR REPLACE FUNCTION public.restore_equipment_availability_on_return()
RETURNS TRIGGER AS $$
BEGIN
  -- Only process if status changes to 'returned' and equipment_id exists
  IF NEW.status = 'returned' AND OLD.status != 'returned' AND NEW.equipment_id IS NOT NULL THEN
    UPDATE public.equipment_inventory
    SET 
      available_quantity = available_quantity + 1,
      updated_at = now()
    WHERE id = NEW.equipment_id;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Create trigger on patient_history table for UPDATE (return)
DROP TRIGGER IF EXISTS trigger_restore_equipment_on_return ON public.patient_history;
CREATE TRIGGER trigger_restore_equipment_on_return
  BEFORE UPDATE ON public.patient_history
  FOR EACH ROW
  EXECUTE FUNCTION public.restore_equipment_availability_on_return();