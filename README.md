# Home Design Brief

A password-protected website for couples to share their home design brief with prospective interior designers.

## Architecture

### Data Model (`src/types/index.ts`)
- **Session**: Authentication state (role: admin/viewer)
- **AboutUs**: Couple intro, living routines, lifestyle, home vibe
- **HomeConcept**: Design vision, mood palette, references
- **Blueprint**: PDF file + dimensional notes
- **Room**: Name, mood board, must-haves, nice-to-haves, things to avoid, inspiration items
- **InspirationItem**: Photo/link + annotation
- **AppSettings**: Configurable passwords

### State Management (`src/store/appStore.ts`)
- Zustand store for all app state
- LocalStorage persistence
- Session tracking (admin/viewer)
- All CRUD operations for content

### Components
- **LockScreen**: Password entry (determines role)
- **Layout**: Navigation, logout
- **HomePage**: Overview of about us, concept, rooms
- **AboutUsPage**: Couple info (edit mode for admin)
- More pages to follow (Blueprint, Rooms, etc.)

### Authentication
- Password-based (no user accounts)
- Two passwords: admin & viewer
- Role stored in session
- Configurable via settings page

### Storage
- LocalStorage for MVP (easily replaceable with API)
- All data persists per browser session
- Files stored as base64 or file references

## Setup

```bash
npm install
npm run dev
```

## Deployment (Netlify)

```bash
npm run build
npm run deploy
```

## Default Passwords
- Admin: `admin123`
- Viewer: `viewer123`

Change via Settings page (admin only).
