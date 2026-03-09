-- Robot status enum
CREATE TYPE public.robot_status AS ENUM ('idle', 'charging', 'in_transit', 'on_task', 'maintenance', 'offline');

-- At-home robots table
CREATE TABLE public.robots (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  robot_id TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  model TEXT DEFAULT 'HomeBot X1',
  status robot_status DEFAULT 'idle',
  battery_level INTEGER DEFAULT 100 CHECK (battery_level >= 0 AND battery_level <= 100),
  current_location TEXT,
  assigned_patient_id UUID REFERENCES public.patients(id) ON DELETE SET NULL,
  last_maintenance_at TIMESTAMPTZ,
  last_seen_at TIMESTAMPTZ DEFAULT now(),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Robot task type enum
CREATE TYPE public.robot_task_type AS ENUM ('delivery', 'check_in', 'vitals_collection', 'medication_reminder', 'emergency_response');

-- Robot task status enum
CREATE TYPE public.robot_task_status AS ENUM ('pending', 'assigned', 'in_progress', 'completed', 'failed', 'cancelled');

-- Robot tasks table
CREATE TABLE public.robot_tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  robot_id UUID REFERENCES public.robots(id) ON DELETE SET NULL,
  patient_id UUID REFERENCES public.patients(id) ON DELETE CASCADE NOT NULL,
  task_type robot_task_type NOT NULL,
  status robot_task_status DEFAULT 'pending',
  priority INTEGER DEFAULT 2 CHECK (priority >= 1 AND priority <= 4),
  description TEXT,
  scheduled_at TIMESTAMPTZ,
  started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  notes TEXT,
  created_by UUID,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Device type enum
CREATE TYPE public.device_type AS ENUM ('smartwatch', 'blood_pressure', 'pulse_oximeter', 'glucose_monitor', 'weight_scale', 'thermometer', 'ecg_monitor');

-- Device readings table
CREATE TABLE public.device_readings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID REFERENCES public.patients(id) ON DELETE CASCADE NOT NULL,
  device_type device_type NOT NULL,
  reading_type TEXT NOT NULL,
  value NUMERIC NOT NULL,
  unit TEXT NOT NULL,
  is_abnormal BOOLEAN DEFAULT false,
  recorded_at TIMESTAMPTZ DEFAULT now(),
  synced_at TIMESTAMPTZ DEFAULT now(),
  device_serial TEXT,
  metadata JSONB DEFAULT '{}'
);

-- Disability type enum
CREATE TYPE public.disability_type AS ENUM ('visual', 'hearing', 'mobility', 'cognitive', 'speech');

-- Patient conditions table (disabilities and high-risk indicators)
CREATE TABLE public.patient_conditions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID REFERENCES public.patients(id) ON DELETE CASCADE NOT NULL,
  condition_type TEXT NOT NULL,
  disability_type disability_type,
  is_high_risk_medication BOOLEAN DEFAULT false,
  medication_category TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.robots ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.robot_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.device_readings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.patient_conditions ENABLE ROW LEVEL SECURITY;

-- RLS policies for robots (admin and coordinator only)
CREATE POLICY "Admins and coordinators can view robots" ON public.robots
  FOR SELECT USING (has_role(auth.uid(), 'admin') OR has_role(auth.uid(), 'coordinator'));

CREATE POLICY "Admins can manage robots" ON public.robots
  FOR ALL USING (has_role(auth.uid(), 'admin'));

-- RLS policies for robot_tasks
CREATE POLICY "Workers can view robot tasks" ON public.robot_tasks
  FOR SELECT USING (has_role(auth.uid(), 'nurse') OR has_role(auth.uid(), 'cna') OR has_role(auth.uid(), 'coordinator') OR has_role(auth.uid(), 'admin'));

CREATE POLICY "Coordinators and admins can manage robot tasks" ON public.robot_tasks
  FOR ALL USING (has_role(auth.uid(), 'coordinator') OR has_role(auth.uid(), 'admin'));

-- RLS policies for device_readings
CREATE POLICY "Workers can view device readings" ON public.device_readings
  FOR SELECT USING (has_role(auth.uid(), 'nurse') OR has_role(auth.uid(), 'cna') OR has_role(auth.uid(), 'coordinator') OR has_role(auth.uid(), 'admin'));

CREATE POLICY "Workers can insert device readings" ON public.device_readings
  FOR INSERT WITH CHECK (has_role(auth.uid(), 'nurse') OR has_role(auth.uid(), 'cna') OR has_role(auth.uid(), 'coordinator') OR has_role(auth.uid(), 'admin'));

-- RLS policies for patient_conditions
CREATE POLICY "Workers can view patient conditions" ON public.patient_conditions
  FOR SELECT USING (has_role(auth.uid(), 'nurse') OR has_role(auth.uid(), 'cna') OR has_role(auth.uid(), 'coordinator') OR has_role(auth.uid(), 'admin'));

CREATE POLICY "Nurses and above can manage patient conditions" ON public.patient_conditions
  FOR ALL USING (has_role(auth.uid(), 'nurse') OR has_role(auth.uid(), 'coordinator') OR has_role(auth.uid(), 'admin'));

-- Triggers for updated_at
CREATE TRIGGER update_robots_updated_at BEFORE UPDATE ON public.robots
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_robot_tasks_updated_at BEFORE UPDATE ON public.robot_tasks
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Enable realtime for robot_tasks and device_readings
ALTER PUBLICATION supabase_realtime ADD TABLE public.robot_tasks;
ALTER PUBLICATION supabase_realtime ADD TABLE public.device_readings;