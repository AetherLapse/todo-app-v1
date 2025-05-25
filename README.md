# Advanced Todo Application

A highly functional and visually clean Todo Application built using **Vite**, **React**, **TypeScript**, **Tailwind CSS**, and **shadcn/ui**, with **Supabase** as the backend. This app allows you to efficiently manage tasks with rich features for organization, prioritization, and productivity.

---

## 🚀 Features

### ✅ Core Functionality

**Task Creation & Organization:**

* Create new todos with title, due date, and priority.
* Organize tasks into intuitive list views with clean UI components.

**Prioritization:**

* Choose between Low, Medium, or High priority.
* Priorities are visually emphasized using Tailwind and shadcn/ui styling.

**Reminders and Notifications:**

* Tasks display due dates to keep users informed.
* (Planned) Reminder notifications for upcoming tasks.

**Completion Tracking:**

* Mark tasks as complete/incomplete with interactive UI elements.
* Completed tasks are styled with visual indicators (e.g., strikethrough, faded text).

**Notes and Attachments (Planned):**

* Add optional notes and future support for file attachments per task.

### ✨ Advanced Features (Planned/Optional Enhancements)

**Integration with Other Tools:**

* Integrate with Google Calendar or productivity apps via API.

**Collaboration:**

* Share task lists with others (requires user authentication system).

**Subtasks & Dependencies:**

* Enable subtasks and task dependencies.

**Customization:**

* Toggle themes (light/dark), sort and filter tasks, and customize views.

**Progress Tracking:**

* Visual progress indicators, task stats, and completion charts.

---

## 🛠 Tech Stack

* **Frontend:**

  * [Vite](https://vitejs.dev/) – blazing fast development server
  * [React](https://react.dev/) – component-based UI
  * [TypeScript](https://www.typescriptlang.org/) – static typing for scalability
  * [Tailwind CSS](https://tailwindcss.com/) – utility-first styling
  * [shadcn/ui](https://ui.shadcn.com/) – accessible, stylish component primitives

* **Backend:**

  * [Supabase](https://supabase.com/) – hosted backend with PostgreSQL, authentication, and real-time features

---

## 🧱 Supabase Database Schema

### `tasks` Table

| Column      | Type    | Description                         |
| ----------- | ------- | ----------------------------------- |
| id          | uuid    | Primary key                         |
| user\_id    | uuid    | References authenticated user       |
| title       | text    | Task title                          |
| description | text    | Detailed task info                  |
| completed   | boolean | Task completion status (true/false) |

> You may also add: `due_date`, `priority`, `created_at`, `updated_at`, etc. for extended functionality.

Additional tables (as shown):

* `profiles` – to store user-specific info
* `subtasks` – for managing nested task items
* `categories` – to group or label tasks

---

## 📂 Project Structure

```
/                 → Root folder
├── client/       → Vite + React frontend
│   ├── src/
│   │   ├── components/ → React UI components (using shadcn/ui)
│   │   ├── pages/      → Page-level components
│   │   ├── hooks/      → Custom hooks for task management
│   │   └── utils/      → Utility functions and Supabase client
```

---

## 🧪 Running the App Locally

### 1. Clone the repository

```bash
git clone https://github.com/your-username/advanced-todo-app.git
cd advanced-todo-app
```

### 2. Setup Supabase

* Go to [https://supabase.com/](https://supabase.com/)
* Create a new project
* Create a `tasks` table with the fields listed above
* Get your `anon` key and project `url` from project settings

### 3. Create `.env` file

Create a `.env` file in the root of the `client` directory:

```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

### 4. Install dependencies & run frontend

```bash
cd client
npm install
npm run dev
```

### 5. Visit the app

Open your browser at: `http://localhost:5173`

---

## 📌 License

This project is open-source and available under the [MIT License](LICENSE).

---

## 💡 Future Enhancements

* 🔔 Push notifications & reminders
* 📊 Task insights and analytics
* 📱 Mobile responsiveness and PWA support

---

Happy tasking! 📝
