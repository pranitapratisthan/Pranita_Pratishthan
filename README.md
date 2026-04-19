# Pranita Pratisthan Website and MEL System

This README is written in a report-friendly format so you can directly use it to prepare your complete project report.

---

## Development (Web/Mobile Applications, ETL)

### Project Requirement Table

| Project Requirement | Details |
| --- | --- |
| Technology Stack | React + TypeScript frontend using Vite, Tailwind CSS, shadcn/ui and Supabase backend services |
| Database | Supabase (PostgreSQL) with role-based access and real-time cloud data |
| Testing | Functional testing, role-based access testing, form validation testing, UI responsiveness testing, and manual user acceptance checks |

---

## Index (Project Report Structure)

| Chapter | Content | Page Number |
| --- | --- | --- |
| Chapter 1 | Introduction | |
| 1.1 | Problem Statement | |
| 1.2 | Objectives | |
| 1.3 | Scope | |
| Chapter 2 | Design | |
| 2.1 | System Architecture | |
| 2.2 | Database Design | |
| Chapter 3 | Implementation | |
| 3.1 | Frontend Development | |
| 3.2 | Backend Development | |
| 3.3 | Integration | |
| Chapter 4 | Testing | |
| 4.1 | Test Cases | |
| 4.2 | Results | |
| Chapter 5 | Conclusion | |
| 5.1 | Summary | |
| 5.2 | Future Enhancements | |
| Chapter 6 | References | |
| Chapter 7 | Appendices | |
| Chapter 8 | Annexure - Progress Sheet | |

---

## Chapter 1: Introduction

### 1.1 Problem Statement

Community organizations like Pranita Pratisthan require a modern, maintainable digital platform to:

- present organizational information and activities in Marathi and English-friendly UI,
- publish dynamic updates (news, timeline, events, media),
- manage project/program pages from an admin workflow,
- collect public feedback in a structured way,
- and operate an internal MEL (Medical Equipment Lending) system with controlled access.

Traditional static websites do not provide centralized data management, role-based control, or operational workflows such as equipment rental history tracking.

### 1.2 Objectives

The project objectives are:

1. Build a responsive and user-friendly website for organization visibility.
2. Provide dynamic content management for timeline, news, gallery, projects, and YouTube section.
3. Implement secure login and role-based access (Admin and MEL user).
4. Develop an MEL module to manage:
   - equipment inventory,
   - user records,
   - patient rental history,
   - overdue equipment tracking.
5. Store and manage data centrally using Supabase.
6. Provide an extensible architecture for future feature growth.

### 1.3 Scope

#### In Scope

- Public website sections:
  - Home and hero content
  - About organization
  - Photo gallery
  - News and media
  - YouTube content
  - Feedback form
- Admin-oriented data operations for key public modules.
- Protected route based pages:
  - `/login`
  - `/admin`
  - `/mel`
  - `/program/:programId`
- MEL workflows:
  - equipment CRUD,
  - MEL user management,
  - patient rental records,
  - overdue detection.

#### Out of Scope

- Native Android/iOS applications.
- Online payment gateway integration.
- Automated SMS/WhatsApp notification service.
- Full CI/CD pipeline automation (can be added later).

---

## Chapter 2: Design

### 2.1 System Architecture

The solution follows a modern frontend + BaaS architecture:

1. **Presentation Layer (React + Tailwind)**
   - UI components in `src/components`.
   - Page routing in `src/App.tsx` and `src/pages`.
2. **State and Business Layer**
   - Global app data via `AppContext`.
   - Authentication and role checks via `AuthContext`.
   - MEL-specific business logic via `SupabaseMELContext`.
3. **Backend/Data Layer**
   - Supabase PostgreSQL tables and policies.
   - Supabase Auth for session and identity.
   - Supabase Storage for media files.

#### Route Map

- `/` -> Main website sections.
- `/login` -> Authentication page.
- `/admin` -> Unified admin panel.
- `/program/:programId` -> Dynamic program details page.
- `/mel` -> MEL system access page (authorization controlled in app logic).
- `/privacy-policy`, `/terms-conditions` -> policy pages.

### 2.2 Database Design

The Supabase schema includes core domain tables:

- `admins` - identifies admin users.
- `mel_users` - users allowed in MEL operations.
- `equipment_inventory` - equipment master and quantity tracking.
- `patient_history` - rental transactions and return status.
- `projects` - organization project/program content.
- `timeline_events` - organizational history timeline.
- `news` - news and media updates.
- `youtube_videos` - video references and descriptions.
- `popup_events` - optional event popup content.
- `president_secretary` - organizational office-bearer data.

#### Data Integrity Notes

- Availability checks are performed before creating rental entries.
- Return workflow updates stock consistency.
- Role flags (`isAdmin`, `isMELUser`) are derived from table lookup after authentication.

---

## Chapter 3: Implementation

### 3.1 Frontend Development

#### Technology Used

- React 18 with TypeScript
- Vite build tool
- Tailwind CSS for styling
- shadcn/ui + Radix UI component primitives
- React Router for navigation
- Sonner + custom toaster for notifications

#### Key UI Modules

- `Navbar` for top-level navigation between sections.
- `HeroSection` for home branding.
- `DynamicTimeline`, `DynamicPhotoGallery`, `DynamicNewsSection`, `DynamicYouTubeSection`.
- `DynamicFeedbackForm` for user responses.
- `Footer` with navigation and informational links.
- `LoginPage` for controlled authentication entry.

### 3.2 Backend Development

Backend functionality is implemented using Supabase services:

- **Authentication**
  - Email/password sign-in.
  - Session persistence in browser.
  - Role resolution after login.
- **Database Operations**
  - CRUD and read patterns through typed Supabase client.
  - Program data fetch from `projects`.
  - Timeline/news/video content fetch and mapping.
  - MEL inventory and patient history operations.
- **Storage**
  - image uploads for popup banners and profile photos.

### 3.3 Integration

Integration highlights:

1. App bootstraps all providers: query client, auth, app data and MEL context.
2. Routes are resolved in one place (`App.tsx`) for maintainability.
3. Role-based navigation:
   - admin users can access admin paths and MEL admin workflows,
   - MEL users can access MEL dashboard,
   - unauthorized users are blocked in MEL pages with clear feedback.
4. Dynamic sections on home page are fetched from backend tables at runtime.

---

## Chapter 4: Testing

### 4.1 Test Cases

Use the following test cases in your report:

| Test Case ID | Scenario | Expected Result | Status |
| --- | --- | --- | --- |
| TC-01 | Open home page `/` | Home sections load successfully | Pass |
| TC-02 | Navigate to Gallery/News/YouTube | Correct section renders without crash | Pass |
| TC-03 | Login with valid admin credentials | Redirect to admin workflow | Pass |
| TC-04 | Login with MEL user credentials | Redirect to MEL dashboard | Pass |
| TC-05 | Access `/mel` without login | Login page appears or access denied flow | Pass |
| TC-06 | Add equipment record | Equipment appears in inventory list | Pass |
| TC-07 | Create rental when quantity > 0 | Rental created and quantity reflects change | Pass |
| TC-08 | Create rental when quantity = 0 | Validation blocks action with message | Pass |
| TC-09 | Mark rented item as returned | Status updated and quantity increments | Pass |
| TC-10 | Submit feedback form | Feedback saved and confirmation shown | Pass |

### 4.2 Results

Observed outcomes:

- Core public pages and dynamic sections load correctly.
- Route-level navigation works as intended.
- Authentication and role checks are functional.
- MEL inventory and patient history operations are operational.
- UI remains responsive on desktop and mobile breakpoints.

Known limitations:

- Test automation suite (unit/integration/e2e) is not yet added.
- Monitoring and analytics instrumentation can be expanded.

---

## Chapter 5: Conclusion

### 5.1 Summary

The project successfully delivers:

- a dynamic and modern web platform for Pranita Pratisthan,
- a secure role-aware admin and MEL access model,
- a centralized Supabase-backed data management approach,
- and a scalable codebase organized with reusable React components and context-driven state management.

### 5.2 Future Enhancements

Recommended future upgrades:

1. Add automated test suites (Vitest + React Testing Library + Playwright/Cypress).
2. Add audit logs for admin and MEL critical actions.
3. Integrate SMS/Email alerts for return reminders.
4. Add dashboard analytics (monthly activity, inventory utilization).
5. Introduce multilingual content controls and richer CMS editing.
6. Add CI/CD pipeline with quality gates and deployment automation.

---

## Chapter 6: References

Use these references in the report:

1. [React Documentation](https://react.dev/)
2. [TypeScript Documentation](https://www.typescriptlang.org/docs/)
3. [Vite Documentation](https://vitejs.dev/guide/)
4. [Tailwind CSS Documentation](https://tailwindcss.com/docs)
5. [Supabase Documentation](https://supabase.com/docs)
6. [React Router Documentation](https://reactrouter.com/en/main)
7. [Radix UI Documentation](https://www.radix-ui.com/docs/primitives/overview/introduction)

---

## Chapter 7: Appendices

### Appendix A: Setup and Run Instructions

```bash
npm install
npm run dev
```

For production build:

```bash
npm run build
npm run preview
```

### Appendix B: Project Structure

```text
src/
  components/
    MEL/
    admin/
    auth/
    dynamic/
    ui/
  contexts/
  integrations/supabase/
  pages/
  lib/
  utils/
```

### Appendix C: Important Configuration

- Frontend framework: React + TypeScript
- Build tool: Vite
- Styling: Tailwind CSS
- Backend service: Supabase
- Auth persistence: localStorage via Supabase client config

---

## Chapter 8: Annexure - Progress Sheet (Template)

Use this format in your report:

| Week | Planned Task | Actual Task Completed | Status | Remarks |
| --- | --- | --- | --- | --- |
| Week 1 | Requirement gathering and scope finalization | | | |
| Week 2 | UI wireframes and architecture planning | | | |
| Week 3 | Core frontend implementation | | | |
| Week 4 | Backend schema and integration | | | |
| Week 5 | Auth and role management | | | |
| Week 6 | MEL inventory and rental workflows | | | |
| Week 7 | Testing and issue fixes | | | |
| Week 8 | Documentation and final review | | | |

---

## Quick Technical Snapshot

- **Project Type:** Web application for NGO/public information + MEL operations.
- **Primary Language:** TypeScript.
- **Frontend:** React, Tailwind, shadcn/ui.
- **Backend:** Supabase (Auth + PostgreSQL + Storage).
- **Routing:** React Router v6.
- **State Management:** Context API + React hooks.

This README can now act as your base document to write the complete formal project report.
