-- Create tables for Home Design Brief app

-- Sessions/Users table (for tracking viewer sessions)
CREATE TABLE IF NOT EXISTS sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('admin', 'viewer')),
  last_active TIMESTAMP DEFAULT now(),
  created_at TIMESTAMP DEFAULT now()
);

-- About Us
CREATE TABLE IF NOT EXISTS about_us (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  session_id UUID NOT NULL REFERENCES sessions(id) ON DELETE CASCADE,
  couple_introduction TEXT,
  living_routines TEXT,
  lifestyle_habits TEXT,
  ideal_home_vibe TEXT,
  updated_at TIMESTAMP DEFAULT now(),
  created_at TIMESTAMP DEFAULT now()
);

-- Home Concept
CREATE TABLE IF NOT EXISTS home_concept (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  session_id UUID NOT NULL REFERENCES sessions(id) ON DELETE CASCADE,
  design_vision TEXT,
  mood_palette TEXT,
  overall_references TEXT,
  updated_at TIMESTAMP DEFAULT now(),
  created_at TIMESTAMP DEFAULT now()
);

-- Blueprint
CREATE TABLE IF NOT EXISTS blueprint (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  session_id UUID NOT NULL REFERENCES sessions(id) ON DELETE CASCADE,
  file_name TEXT NOT NULL,
  file_path TEXT NOT NULL,
  file_size INT,
  dimensional_notes TEXT,
  uploaded_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);

-- Rooms
CREATE TABLE IF NOT EXISTS rooms (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  session_id UUID NOT NULL REFERENCES sessions(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  sort_order INT DEFAULT 0,
  must_haves TEXT,
  nice_to_haves TEXT,
  things_to_avoid TEXT,
  mood_board_path TEXT,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);

-- Inspiration Items
CREATE TABLE IF NOT EXISTS inspiration_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  room_id UUID NOT NULL REFERENCES rooms(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('photo', 'link')),
  photo_file_name TEXT,
  photo_path TEXT,
  external_url TEXT,
  annotation TEXT,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);

-- App Settings
CREATE TABLE IF NOT EXISTS app_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  session_id UUID NOT NULL REFERENCES sessions(id) ON DELETE CASCADE,
  admin_password_hash TEXT NOT NULL,
  viewer_password_hash TEXT NOT NULL,
  updated_at TIMESTAMP DEFAULT now(),
  created_at TIMESTAMP DEFAULT now()
);

-- Create indexes for better query performance
CREATE INDEX idx_about_us_session ON about_us(session_id);
CREATE INDEX idx_home_concept_session ON home_concept(session_id);
CREATE INDEX idx_blueprint_session ON blueprint(session_id);
CREATE INDEX idx_rooms_session ON rooms(session_id);
CREATE INDEX idx_inspiration_room ON inspiration_items(room_id);
CREATE INDEX idx_settings_session ON app_settings(session_id);
CREATE INDEX idx_sessions_user ON sessions(user_id);

-- Enable Row Level Security (RLS)
ALTER TABLE sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE about_us ENABLE ROW LEVEL SECURITY;
ALTER TABLE home_concept ENABLE ROW LEVEL SECURITY;
ALTER TABLE blueprint ENABLE ROW LEVEL SECURITY;
ALTER TABLE rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE inspiration_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE app_settings ENABLE ROW LEVEL SECURITY;

-- RLS Policies (allow authenticated users to see their own data)
CREATE POLICY "Users can view their own sessions"
  ON sessions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create sessions"
  ON sessions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Similar policies for other tables would go here
