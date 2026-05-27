import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Hero } from "@/components/Hero";
import { Interrogation, type Answers } from "@/components/Interrogation";
import { DatePlanner, type DatePlan } from "@/components/DatePlanner";
import { Vacation } from "@/components/Vacation";
import { LoveQuiz } from "@/components/LoveQuiz";
import { Reasons } from "@/components/Reasons";
import { Promises } from "@/components/Promises";
import { Finale } from "@/components/Finale";
import { FloatingHearts, CursorGlow } from "@/components/FloatingHearts";
import { MusicToggle } from "@/components/MusicToggle";
import { RainToggle } from "@/components/RainToggle";
import { Loader } from "@/components/Loader";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  const [loaded, setLoaded] = useState(false);
  const [answers, setAnswers] = useState<Answers>({});
  const [plan, setPlan] = useState<DatePlan>({ date: "", time: "", activity: "", mood: "" });
  const [destinations, setDestinations] = useState<string[]>([]);

  return (
    <main className="relative">
      {!loaded && <Loader onDone={() => setLoaded(true)} />}
      <FloatingHearts />
      <CursorGlow />
      <MusicToggle />
      <RainToggle />
      <Hero />
      <Interrogation answers={answers} setAnswers={setAnswers} />
      <DatePlanner plan={plan} setPlan={setPlan} />
      <Vacation picks={destinations} setPicks={setDestinations} />
      <LoveQuiz />
      <Reasons />
      <Promises />
      <Finale answers={answers} plan={plan} destinations={destinations} />
    </main>
  );
}