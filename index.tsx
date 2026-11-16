import { createFileRoute, Link } from "@tanstack/react-router";
import { CheckCircle2, Clock, ListTodo, Plus, Sparkles, TrendingUp } from "lucide-react";
import { AppShell, EmptyState } from "@/components/study/AppShell";
import { TaskCard } from "@/components/study/TaskCard";
import { useTasks } from "@/hooks/use-tasks";
import { addDays, computeStats, sortTasks, todayStr } from "@/lib/tasks";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "StudySync — Student Study Planner" },
      { name: "description", content: "Plan study tasks, track deadlines and see your progress with StudySync." },
      { property: "og:title", content: "StudySync — Student Study Planner" },
      { property: "og:description", content: "Plan study tasks, track deadlines and see your progress." },
    ],
  }),
  component: Dashboard,
});

const QUOTES = [
  "Small steps every day add up to big results. Keep going!",
  "Consistency beats intensity — 30 focused minutes today matters.",
  "You don't have to be perfect, just a little better than yesterday.",
  "Your future self will thank you for the work you do today.",
];

function Dashboard() {
  const { tasks, ready } = useTasks();
  const s = computeStats(tasks);
  const today = todayStr();
  const todays = tasks.filter((t) => t.dueDate === today && !t.completed);
  const upcoming = sortTasks(tasks.filter((t) => !t.completed && t.dueDate > today && t.dueDate <= addDays(7)), "dueDate").slice(0, 4);
  const quote = QUOTES[new Date().getDate() % QUOTES.length];

  const cards = [
    { label: "Total Tasks", value: s.total, icon: ListTodo },
    { label: "Completed", value: s.completed, icon: CheckCircle2 },
    { label: "Pending", value: s.pending, icon: Clock },
    { label: "Completion Rate", value: `${s.rate}%`, icon: TrendingUp },
  ];

  return (
    <AppShell>
      <section className="rounded-3xl bg-gradient-brand p-6 text-primary-foreground shadow-soft sm:p-8">
        <p className="text-sm font-medium opacity-80">{new Date().toLocaleDateString(undefined, { weekday: "long", month: "long", day: "numeric" })}</p>
        <h1 className="mt-1 font-display text-2xl font-extrabold tracking-tight sm:text-3xl">Welcome back! Ready to achieve your goals?</h1>
        <div className="mt-6">
          <div className="flex justify-between text-sm font-medium"><span>Study progress</span><span>{s.completed}/{s.total} done</span></div>
          <div className="mt-2 h-3 overflow-hidden rounded-full bg-progress-track" role="progressbar" aria-valuenow={s.rate} aria-valuemin={0} aria-valuemax={100} aria-label="Completion">
            <div className="h-full rounded-full bg-progress-fill transition-all duration-500" style={{ width: `${s.rate}%` }} />
          </div>
        </div>
      </section>

      <section className="mt-6 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        {cards.map(({ label, value, icon: Icon }) => (
          <div key={label} className="card card-hover p-4 sm:p-5">
            <div className="grid h-10 w-10 place-items-center rounded-xl bg-accent text-accent-foreground"><Icon className="h-5 w-5" /></div>
            <p className="mt-3 text-2xl font-extrabold sm:text-3xl">{ready ? value : "–"}</p>
            <p className="text-sm text-muted-foreground">{label}</p>
          </div>
        ))}
      </section>

      <div className="card mt-6 flex items-start gap-3 p-5">
        <Sparkles className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
        <p className="text-sm font-medium">{quote}</p>
      </div>

      {ready && tasks.length === 0 ? (
        <div className="mt-6">
          <EmptyState title="No tasks yet" text="Add your first study task and start building a steady routine."
            action={<Link to="/add" className="btn btn-primary"><Plus className="h-4 w-4" /> Add a task</Link>} />
        </div>
      ) : (
        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          <TaskSection title="Today's tasks" empty="Nothing due today — nice!" list={todays} />
          <TaskSection title="Upcoming deadlines" empty="No deadlines in the next 7 days." list={upcoming} />
        </div>
      )}
    </AppShell>
  );
}

function TaskSection({ title, empty, list }: { title: string; empty: string; list: ReturnType<typeof useTasks>["tasks"] }) {
  return (
    <section>
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-lg font-bold">{title}</h2>
        <Link to="/tasks" className="text-sm font-semibold text-primary hover:underline">View all</Link>
      </div>
      <div className="space-y-3">
        {list.length === 0 ? <p className="card p-5 text-sm text-muted-foreground">{empty}</p> : list.map((t) => <TaskCard key={t.id} task={t} compact />)}
      </div>
    </section>
  );
}
