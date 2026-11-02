<div align="center">

  <h1>⚡ TaskFlow</h1>
  <p><strong>A Modern, Production-Ready Daily Task Management Mobile App</strong></p>

  <p>
    Built with <strong>React Native 0.88</strong>, <strong>TypeScript</strong>, <strong>Redux Toolkit</strong>, and <strong>AsyncStorage</strong>.<br />
    Designed for seamless organization, offline resilience, and intelligent task breakdown.
  </p>

  <p>
    <a href="https://reactnative.dev/"><img src="https://img.shields.io/badge/React_Native-0.88.1-61DAFB?style=flat-square&logo=react&logoColor=white" alt="React Native" /></a>
    <a href="https://www.typescriptlang.org/"><img src="https://img.shields.io/badge/TypeScript-5.0+-3178C6?style=flat-square&logo=typescript&logoColor=white" alt="TypeScript" /></a>
    <a href="https://redux-toolkit.js.org/"><img src="https://img.shields.io/badge/State-Redux_Toolkit_2.x-764ABC?style=flat-square&logo=redux&logoColor=white" alt="Redux Toolkit" /></a>
    <a href="https://jestjs.io/"><img src="https://img.shields.io/badge/Tests-38%20Passed-44CC11?style=flat-square&logo=jest&logoColor=white" alt="Jest Tests" /></a>
    <img src="https://img.shields.io/badge/License-MIT-blue.svg?style=flat-square" alt="License" />
  </p>

  <p>
    <a href="#-app-preview--screenshots">Preview</a> •
    <a href="#-key-features">Features</a> •
    <a href="#-architecture--directory-structure">Architecture</a> •
    <a href="#-state-management-redux-toolkit">Redux Toolkit</a> •
    <a href="#-offline-first--data-persistence">Offline Storage</a> •
    <a href="#-automated-testing">Testing</a> •
    <a href="#-getting-started">Installation</a>
  </p>

</div>

---

## 📱 App Preview & Screenshots

<div align="center">
  <!-- Top Hero Banner / Showcase Preview -->
  <a href="assets/screenshots/banner.png">
    <img src="assets/screenshots/banner.png" alt="TaskFlow Application Showcase" width="100%" style="max-width: 860px; border-radius: 12px; box-shadow: 0 10px 30px rgba(0,0,0,0.12);" onerror="this.onerror=null; this.src='https://via.placeholder.com/860x420/1E293B/FFFFFF?text=TaskFlow+Mobile+App+Showcase';" />
  </a>
  <p><em>TaskFlow — Modern Task Dashboard, Detail View & Smart AI Assistant</em></p>
</div>

<br />

<div align="center">
  <table>
    <tr>
      <td align="center" width="33%">
        <img src="assets/screenshots/task-list.png" alt="Task Listing Screen" width="260" style="border-radius: 8px;" onerror="this.onerror=null; this.src='https://via.placeholder.com/260x520/EEF4FA/334155?text=Task+Listing+Screen';" /><br />
        <sub><b>Task Listing & Category Filters</b></sub>
      </td>
      <td align="center" width="33%">
        <img src="assets/screenshots/task-detail.png" alt="Task Detail Screen" width="260" style="border-radius: 8px;" onerror="this.onerror=null; this.src='https://via.placeholder.com/260x520/EEF4FA/334155?text=Task+Detail+Screen';" /><br />
        <sub><b>Task Editor & Subtasks</b></sub>
      </td>
      <td align="center" width="33%">
        <img src="assets/screenshots/ai-assistant.png" alt="AI Assistant Modal" width="260" style="border-radius: 8px;" onerror="this.onerror=null; this.src='https://via.placeholder.com/260x520/EEF4FA/334155?text=AI+Task+Breakdown';" /><br />
        <sub><b>AI Task Breakdown Assistant</b></sub>
      </td>
    </tr>
  </table>
</div>

> 💡 **Image Upload Guide**: To display your own screenshots, save your images in [`assets/screenshots/`](assets/screenshots/) as `banner.png`, `task-list.png`, `task-detail.png`, and `ai-assistant.png`.

---

## ✨ Key Features

### 1. Modern Task Dashboard
- **Grouped Time Sections**: Automatically segments tasks into **TODAY** and **TOMORROW** with item count badges.
- **Priority Indicators**: Visual color-coded priority strips:
  - 🔴 **High Priority**: Urgent actions
  - 🟠 **Medium Priority**: Standard workflow
  - 🟢 **Low Priority**: Backlog & casual items
- **Dynamic Category Badges**: Color-coded category chips with custom icons (`Work`, `Personal`, `Study`, `Health`, `Other`).
- **Real-Time Search**: Instant case-insensitive search across task titles and personal descriptions.
- **Segmented Status Filters**: Quick filters for `All Tasks`, `Pending`, and `Completed` with dynamic item count badges.
- **Multi-Criteria Sorting**: Sort by Due Date, Priority level, Alphabetical title, or Completion status.

### 2. Comprehensive Task Editor & Creator
- **Interactive Checklist**: Add, toggle, and remove subtasks with strikethrough completion feedback.
- **Native Date & Time Picker**: Seamless date selection and 12-hour AM/PM time pickers (`09:00 AM` – `06:00 PM`).
- **Rich Media & File Attachments**: Attach photos from the device camera or image gallery, and manage document attachments with type badges (PDF, images, files).
- **Form Validation**: Strict client-side validation ensuring valid title entries and clean data integrity.
- **Contextual Personal Notes**: Dedicated multi-line editor for extensive notes and task background.

### 3. Smart AI Task Assistant
- **Automated Task Decomposition**: Enter a high-level goal (e.g. *"Launch product campaign"*, *"Prepare for exams"*, *"Weekly meal prep"*).
- **Intelligent Classification**: Automatically infers the category, priority level, estimated completion duration, and sequenced actionable subtasks.
- **One-Tap Ingestion**: Review generated tasks and add them directly to your flow.

### 4. Resilient Offline Architecture
- **Instant Hydration**: Immediately renders locally cached tasks from `AsyncStorage` on app start with zero blank screens.
- **Auto Network Detection**: Real-time connectivity monitoring via `@react-native-community/netinfo`.
- **Amber Offline Banner**: Displays a non-intrusive status bar when offline while allowing complete local task creation, editing, and deletion.
- **Preserved User Modifications**: Local user creations and edits are protected and merged with remote updates.

---

## 🏗 Architecture & Directory Structure

TaskFlow follows clean architectural patterns, separating UI components from business logic and state management:

```
TaskFlow/
├── assets/
│   └── screenshots/                # App preview images and showcase assets
├── __tests__/                      # Automated Jest unit and integration tests
│   ├── App.test.tsx                # App root rendering & smoke tests
│   ├── reduxStore.test.ts          # Redux Toolkit actions, reducers & store tests
│   ├── taskFilterAndSearch.test.ts # Search, category & status filter tests
│   ├── taskStore.test.ts           # State mutations & persistence integration tests
│   ├── time12HourFormat.test.ts    # 12-hour AM/PM time parser & formatter tests
│   ├── TaskCard.test.tsx           # Memoized TaskCard component rendering tests
│   └── TaskDetailValidation.test.tsx # Form validation & input enforcement tests
├── src/
│   ├── api/
│   │   └── taskApi.ts              # REST API client with timeouts & network resilience
│   ├── components/                 # Reusable, decoupled UI components
│   │   ├── AIAssistantModal.tsx    # Intelligent task decomposition modal
│   │   ├── AttachmentList.tsx      # Media & document attachment manager
│   │   ├── BottomTabBar.tsx        # 5-tab docked navigation bar
│   │   ├── DateTimePickerModal.tsx # Native datetime picker dialog
│   │   ├── FilterTabs.tsx          # Status chips & category filter tabs
│   │   ├── Header.tsx              # Safe-area header with sort actions
│   │   ├── Icon.tsx                # Vector icon glyph adapter
│   │   ├── OfflineBanner.tsx       # Offline status pill and retry trigger
│   │   ├── SearchBar.tsx           # Instant search bar with clear button
│   │   ├── SortModal.tsx           # Bottom sheet for sorting options
│   │   ├── SubTaskList.tsx         # Checkable subtask checklist
│   │   └── TaskCard.tsx            # Optimized memoized task card
│   ├── hooks/
│   │   └── useNetworkStatus.ts     # NetInfo network connectivity listener
│   ├── navigation/
│   │   └── AppNavigator.tsx        # Screen router (Dashboard, Details, Tab screens)
│   ├── screens/
│   │   ├── TaskListScreen.tsx      # Main task dashboard
│   │   ├── TaskDetailScreen.tsx    # Task editor & management screen
│   │   └── PlaceholderTabs.tsx     # Today, Plan, AI Assistant & Settings tabs
│   ├── store/
│   │   ├── index.ts                # Redux Toolkit configureStore & typed hooks
│   │   ├── taskSlice.ts            # RTK slice, async thunks & reducers
│   │   └── taskStore.ts            # Unified store exports, selectors & hooks
│   ├── theme/
│   │   ├── colors.ts               # Clean color tokens & status palettes
│   │   ├── spacing.ts              # Spacing units, border radius & elevation shadows
│   │   └── typography.ts           # Font sizes, line heights & weights
│   ├── types/
│   │   └── task.ts                 # TypeScript domain interfaces & models
│   └── utils/
│       ├── nativePickerService.ts  # DateTimePicker helpers & 12h formatters
│       └── sampleTasks.ts          # Default design seeds & mock normalization
├── App.tsx                         # Root app entry with Redux Provider & SafeArea
├── jest.config.js                  # Jest test runner configuration
├── jest.setup.ts                   # Native module mocks (AsyncStorage, NetInfo, Pickers)
└── package.json
```

---

## 🧠 State Management: Redux Toolkit

The application state is managed using **Redux Toolkit (`@reduxjs/toolkit`)** and **React Redux (`react-redux`)**:

```
 ┌─────────────────────────────────────────────────────────────┐
 │                         Redux Store                         │
 │                                                             │
 │   ┌─────────────────┐               ┌───────────────────┐   │
 │   │  Task Reducers  │               │   Async Thunks    │   │
 │   │  • taskCreated  │               │  • initStore      │   │
 │   │  • updateTask   │               │  • fetchInitial   │   │
 │   │  • deleteTask   │               │  • fetchMore      │   │
 │   │  • toggleStatus │               │  • refreshTasks   │   │
 │   └────────▲────────┘               └─────────▲─────────┘   │
 └────────────┼──────────────────────────────────┼─────────────┘
              │ dispatch                         │ thunk
 ┌────────────┴──────────────────────────────────┴─────────────┐
 │                       React Components                      │
 │     useAppDispatch()  •  useAppSelector()  •  useTaskStore() │
 └─────────────────────────────────────────────────────────────┘
```

1. **Predictable Slice Architecture**:
   All state updates run through `taskSlice.ts` using Immer for immutable updates.
2. **Asynchronous Thunks**:
   API fetching, pagination, and refresh flows use `createAsyncThunk`, automatically managing `pending`, `fulfilled`, and `rejected` states.
3. **Local Cache Persistence**:
   Every state modification synchronizes with `AsyncStorage`, guaranteeing changes persist across app restarts.
4. **Selector Performance**:
   Component re-renders are kept strictly to elements whose subscribed properties have updated.

---

## 💾 Offline-First & Data Persistence

To ensure reliability regardless of internet connectivity:

| Feature | Implementation | Benefit |
| :--- | :--- | :--- |
| **Instant Launch** | Reads cached tasks from `@taskflow_stored_tasks_v1` on startup | Zero delay or loading spinners on launch |
| **Local Edits Safety** | Flags custom/modified tasks with `isLocal: true` | Remote responses never overwrite user data |
| **Network Monitoring** | `@react-native-community/netinfo` listener | Instant detection of connection loss / recovery |
| **Offline Editing** | Fully functional local CRUD operations | Create, edit, and check off tasks anywhere |

---

## 🚀 Performance Engineering

- **Component Memoization (`React.memo`)**: `TaskCard` evaluates only relevant fields (`id`, `title`, `completed`, `priority`, `category`, `subtasks.length`, `updatedAt`), preventing unnecessary re-renders when other list items change.
- **Pure Memoized Selectors**: Task filtering and sorting logic (`filterAndSortTasks`) only re-calculates when the active query, filters, or task list change.
- **Virtualized List Tuning**: `FlatList` configured with `initialNumToRender={8}`, `maxToRenderPerBatch={10}`, `windowSize={10}`, and `removeClippedSubviews={true}` for fluid 60 FPS scrolling.

---

## 🧪 Automated Testing

TaskFlow includes **7 automated test suites** covering **38 unit and integration tests** executed with Jest:

| Test Suite | Focus Area | Status |
| :--- | :--- | :--- |
| `reduxStore.test.ts` | Redux Toolkit store, slice actions, state transitions, reset, and thunk operations | ✅ Passed |
| `taskStore.test.ts` | Store actions, task creation, status toggle, notes updates, subtask checklist, attachments, deletion | ✅ Passed |
| `taskFilterAndSearch.test.ts` | Status filtering (`completed`, `pending`, `all`), Category filters, search queries, priority/title sorting | ✅ Passed |
| `time12HourFormat.test.ts` | 12-hour AM/PM time parser and string formatting service | ✅ Passed |
| `TaskCard.test.tsx` | Component rendering, priority strips, duration badges, category chips, press events | ✅ Passed |
| `TaskDetailValidation.test.tsx` | Form validation: prevents empty task titles, displays validation error, native picker triggers | ✅ Passed |
| `App.test.tsx` | Root application smoke test with Redux `<Provider>` and `SafeAreaProvider` | ✅ Passed |

### Running Tests

```bash
# Run all test suites
npm test

# Run tests in watch mode
npm test -- --watch

# Run TypeScript type check
npx tsc --noEmit
```

---

## 🛠 Getting Started

### Prerequisites
- **Node.js** >= 22.11.0
- **npm** or **yarn**
- **Android Studio** (for Android) / **Xcode** (for iOS on macOS)

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/your-username/TaskFlow.git
   cd TaskFlow
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the Metro Bundler**:
   ```bash
   npm start
   ```

4. **Launch on Android**:
   ```bash
   npm run android
   ```

5. **Launch on iOS** (macOS only):
   ```bash
   cd ios && pod install && cd ..
   npm run ios
   ```

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).
