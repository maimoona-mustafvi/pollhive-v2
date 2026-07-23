# Auxilio AI — Interview Practice Platform UI System

Complete UI/UX system for Auxilio AI, an AI-powered interview practice platform where users upload study material or use curated question banks to simulate real interviews with adaptive follow-up questions and semantic scoring.

## 🎯 Project Overview

**Auxilio AI** is designed with two distinct user flows:
- **Learner Dashboard**: Practice interface for users to conduct interviews
- **Admin Console**: Platform management and content moderation

The design prioritizes **calm focus** and **progress signals** with a carefully chosen color palette and distraction-free layouts.

## 🎨 Design System

### Color Palette (exactly per brief)
- **Navy (#11358B)**: Primary, headings, sidebar background, trustworthy tone
- **Medium Blue (#6192FC)**: Primary actions, interactive elements, progress indicators
- **Lime Green (#C7EF66)**: Growth, mastery, completion moments, "Improved" badges, pass indicators
- **Canvas (#EFF0F4)**: Light background, creates calm, low-distraction space

### Typography
- **Font**: Geist (geometric sans-serif)
- **Headings**: Dark navy (#11358B) for maximum contrast
- **Body**: Inter-style clarity with generous padding and rounded corners (8-12px)

### Key Design Principles
- Distraction-free environment during practice
- Encouraging progress signals using lime only for achievements
- Clear visual hierarchy with white cards on canvas background
- Mastery rings and progress bars for skill visualization

## 📁 Project Structure

```
app/
├── dashboard/          # Learner home: stats, content cards, mastery tracking
├── practice/           # Setup wizard (Question Bank vs Custom Content modes)
├── interview/          # Active interview session with scoring
├── report/             # Session results with detailed analytics
├── admin/              # Platform management console
├── my-content/         # Uploaded materials manager
├── history/            # Past session history
└── settings/           # Account and preferences

components/
├── learner-sidebar.tsx     # Collapsible nav for all learner pages
├── dashboard-stats.tsx     # Stats row (Sessions, Score, Weak Topics)
├── content-cards.tsx       # Content grid with mastery visualization
├── setup-wizard.tsx        # Mode selection + upload/QBank forms
├── interview-session.tsx   # Live Q&A with scoring display
├── session-report.tsx      # Results analytics with charts
├── admin-console.tsx       # Admin dashboard + moderation queue

lib/
└── auxilio-data.ts    # Mock data for all screens (TypeScript types + fixtures)
```

## 🚀 Live Routes

All routes are fully functional and accessible:

| Page | Route | Purpose |
|------|-------|---------|
| **Dashboard** | `/dashboard` | Learner home with stats and content grid |
| **Practice Setup** | `/practice` | Mode selector (Question Bank / Custom Content) |
| **Interview** | `/interview` | Active session with Q&A and scoring |
| **Report** | `/report` | Post-session analytics and performance breakdown |
| **My Content** | `/my-content` | Manage uploaded study materials |
| **History** | `/history` | Past sessions overview |
| **Settings** | `/settings` | Account, preferences, security |
| **Admin Console** | `/admin` | Platform analytics + moderation queue |

## 💡 Key Features

### Dashboard (Learner Home)
- **Hero Stats Row**: Sessions Completed (24), Average Score (76%), Weak Topics (3)
- **Lime Badges**: "Improved", "Active", "Tracked" — growth signals
- **Content Cards Grid**: 
  - Document thumbnail, title, topics
  - Mastery ring (lime for 80%+, blue for 60%+, gray for below)
  - Last practiced date
  - "Practice" button for quick launch

### Setup Wizard (Practice Page)
- **Two-Card Mode Selector**: 
  - Question Bank Mode (library icon) — curated by topic/difficulty
  - Custom Content Mode (upload icon) — drag-and-drop files
- **Question Bank Form**: Subject dropdown, difficulty slider, session length
- **Custom Content Form**:
  - Drag-drop upload zone
  - Real-time file processing status (parsing → indexing)
  - Blue progress bars → lime on completion
  - Auto-detected topic tags

### Interview Session
- **Navy Header Bar**: Question topic, progress %, progress ring (lime)
- **White Content Card**: Question centered, large readable text
- **Answer Input**: Text area or voice record toggle
- **Scoring Display** (after submit):
  - 3 horizontal metrics: Semantic, Depth, Similarity
  - Blue bars (threshold met), muted bars (below threshold)
  - Weak answer flagged with lime toast: "Follow-up question on this topic"

### Session Report
- **Left Panel**: Topics with mastery bars (lime for strong, gray for weak)
- **Right Panel**: 
  - Bar chart of overall metrics
  - Radar/performance comparison
- **Full Table**: Topic-by-topic breakdown with progress bars
- Lime checkmark for "Mastered", gray alert for "Review"

### Admin Console
- **Navy Header**: Visually separates from learner UI
- **Stat Cards**: Active Users (1247), Sessions Today (384), Avg Score (74%), Pending (12)
- **Charts**: Average Score by Topic (Recharts bar chart)
- **Moderation Queue Table**:
  - AI-generated questions awaiting approval
  - Blue "Review" buttons
  - Inline edit, delete, approve/reject actions

### Sidebar Navigation
- **Collapsible left sidebar** (dark navy)
- **Items**: Home, Practice, My Content, History, Settings
- **Active state**: Medium blue (#6192FC) background
- **Icons**: Lucide React, 20px size
- Collapses to icon-only on narrow viewports

## 🛠 Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Styling**: Tailwind CSS v4 with design tokens
- **UI Components**: shadcn/ui, Radix UI
- **Charts**: Recharts (bar, radar for reporting)
- **Icons**: Lucide React
- **State Management**: React hooks (useState for local demo state)
- **Typography**: Geist font (from Next.js)

## 📊 Mock Data

All screens use realistic mock data from `lib/auxilio-data.ts`:
- **Users**: Maya Patel (learner)
- **Content**: 4 practice items (React, System Design, Databases, APIs)
- **Sessions**: 24 completed, 76% avg score
- **Topics**: 5 tracked with mastery levels
- **Questions**: Sample Q&A pairs with difficulty levels
- **Admin**: 1247 users, 384 sessions today, 12 pending AI questions

## 🎬 User Flows

### Learner Flow
1. **Dashboard** → View stats, past sessions, content
2. **Practice** → Choose mode (Question Bank or Upload)
3. **Interview** → Answer questions, see real-time scoring
4. **Report** → View detailed performance breakdown
5. **History** → Review all past sessions
6. **Settings** → Manage account and preferences

### Admin Flow
1. **Admin Console** → View platform analytics
2. **Moderation Queue** → Review pending AI-generated questions
3. **Approve/Reject** → Manage content quality
4. **Analytics** → Monitor active users, session trends, scores by topic

## 🎯 What's Included

✅ **Complete UI/UX** for all 8 screens  
✅ **Design tokens** with navy, blue, lime, canvas colors  
✅ **Responsive layouts** (tested on 1440px desktop, mobile-ready)  
✅ **Interactive components** (tabs, dropdowns, progress bars, charts)  
✅ **Mock data** with TypeScript types  
✅ **Accessibility** (semantic HTML, ARIA labels, high contrast)  
✅ **Animations** (progress fills, transitions, hover states)  

## 🚧 Next Steps (Backend Integration)

To make this fully functional, integrate:

1. **Authentication**
   - Email + password with Better Auth / Neon
   - Protect `/dashboard`, `/practice`, `/interview`, `/report`, `/history`, `/settings` routes
   - Allow `/admin` only for admins

2. **Database Schema**
   - Users/Organizations (multi-tenant)
   - Content (uploaded documents + metadata)
   - Sessions (room codes, timestamps, status)
   - Questions (user answers + AI-generated)
   - Scores (semantic, depth, similarity metrics)

3. **Real-Time Updates**
   - WebSocket or SSE for live scoring during interviews
   - Broadcast results to admin console

4. **File Processing**
   - PDF/DOCX parsing and chunking (lib: pdf-parse, mammoth, etc.)
   - Topic extraction and indexing
   - Embedding generation for similarity scoring

5. **AI Integration**
   - Semantic scoring (GPT-based or similar)
   - Adaptive follow-up question generation
   - Content parsing for setup wizard

## 🔗 Key Files to Reference

- **Design Tokens**: `app/globals.css` — all color, spacing, and theme variables
- **Components**: `components/` — 7 major UI blocks, fully styled
- **Mock Data**: `lib/auxilio-data.ts` — data types and fixtures
- **Pages**: `app/*/page.tsx` — 8 complete routes

## 📝 Notes

- All colors match the brief exactly (#11358B, #6192FC, #C7EF66, #EFF0F4)
- Lime is reserved **only** for growth/mastery/completion signals
- Canvas background (#EFF0F4) creates a calm, distraction-free environment
- Navy header/sidebar visually separates admin from learner
- Progress visualized with bars, rings, and checkmarks (never just text)
- One-minute onboarding: Dashboard → Practice → Setup → Interview

---

Built with Next.js 16, Tailwind CSS v4, and Recharts. Ready for backend integration.
