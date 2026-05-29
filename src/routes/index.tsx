import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Hero } from "@/components/Hero";
import { Interrogation, type Answers } from "@/components/Interrogation";
import { DatePlanner, type DatePlan } from "@/components/DatePlanner";
import { Vacation } from "@/components/Vacation";
import { LoveQuiz } from "@/components/LoveQuiz";
import { Compatibility } from "@/components/Compatibility";
import { Dealbreakers } from "@/components/Dealbreakers";
import { Reasons } from "@/components/Reasons";
import { Promises } from "@/components/Promises";
import { OpenWhen } from "@/components/OpenWhen";
import { Letter } from "@/components/Letter";
import { LittleThings } from "@/components/LittleThings";
import { Invite } from "@/components/Invite";
import { Countdown } from "@/components/Countdown";
import { Finale } from "@/components/Finale";
import { FloatingHearts, CursorGlow } from "@/components/FloatingHearts";
import { MusicToggle } from "@/components/MusicToggle";
import { RainToggle } from "@/components/RainToggle";
import { Loader } from "@/components/Loader";
import { TodaysNote } from "@/components/TodaysNote";
import { Soundtrack } from "@/components/Soundtrack";
import { MapOfYou } from "@/components/MapOfYou";
import { Diary } from "@/components/Diary";
import { AlmostTexted } from "@/components/AlmostTexted";
import { ReplyToJack } from "@/components/ReplyToJack";
import { EasterEggs } from "@/components/EasterEggs";

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
      <EasterEggs />
      <Hero />
      <TodaysNote />
      <Interrogation answers={answers} setAnswers={setAnswers} />
      <DatePlanner plan={plan} setPlan={setPlan} />
      <Vacation picks={destinations} setPicks={setDestinations} />
      <LoveQuiz />
      <Compatibility answers={answers} />
      <Dealbreakers />
      <Reasons />
      <Promises />
      <MapOfYou />
      <OpenWhen />
      <LittleThings />
      <AlmostTexted />
      <Soundtrack />
      <Letter />
      <Diary />
      <ReplyToJack />
      <Invite plan={plan} />
      <Countdown plan={plan} />
      <Finale answers={answers} plan={plan} destinations={destinations} />
    </main>
  );
}