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
import { Headlines } from "@/components/Headlines";
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
import { PhotoAlbum } from "@/components/PhotoAlbum";
import { SideNav } from "@/components/SideNav";
import { Mirror } from "@/components/Mirror";
import { BirthdayVault } from "@/components/BirthdayVault";
import { LoveLanguage } from "@/components/LoveLanguage";
import { JokesMuseum } from "@/components/JokesMuseum";
import { TimeCapsule } from "@/components/TimeCapsule";
import { Universe } from "@/components/Universe";
import { SweetnessIndex } from "@/components/SweetnessIndex";
import { WishICould } from "@/components/WishICould";
import { ComfortMode } from "@/components/ComfortMode";
import { CompassOfUs } from "@/components/CompassOfUs";

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
      <SideNav />
      <div id="hero"><Hero /></div>
      <div id="todays-note"><TodaysNote /></div>
      <div id="interrogation"><Interrogation answers={answers} setAnswers={setAnswers} /></div>
      <div id="date-planner"><DatePlanner plan={plan} setPlan={setPlan} /></div>
      <div id="vacation"><Vacation picks={destinations} setPicks={setDestinations} /></div>
      <div id="love-quiz"><LoveQuiz /></div>
      <div id="compatibility"><Compatibility answers={answers} /></div>
      <div id="dealbreakers"><Dealbreakers /></div>
      <div id="reasons"><Reasons /></div>
      <div id="promises"><Promises /></div>
      <div id="headlines"><Headlines /></div>
      <div id="map-of-you"><MapOfYou /></div>
      <div id="open-when"><OpenWhen /></div>
      <div id="little-things"><LittleThings /></div>
      <div id="almost-texted"><AlmostTexted /></div>
      <div id="soundtrack"><Soundtrack /></div>
      <div id="letter"><Letter /></div>
      <div id="diary"><Diary /></div>
      <div id="photo-album"><PhotoAlbum /></div>
      <div id="mirror"><Mirror /></div>
      <div id="birthday-vault"><BirthdayVault /></div>
      <div id="love-language"><LoveLanguage /></div>
      <div id="jokes-museum"><JokesMuseum /></div>
      <div id="time-capsule"><TimeCapsule /></div>
      <div id="universe"><Universe /></div>
      <div id="sweetness"><SweetnessIndex /></div>
      <div id="wish-i-could"><WishICould /></div>
      <div id="comfort-mode"><ComfortMode /></div>
      <div id="compass"><CompassOfUs /></div>
      <div id="reply-to-jack"><ReplyToJack /></div>
      <div id="invite"><Invite plan={plan} /></div>
      <div id="countdown"><Countdown plan={plan} /></div>
      <div id="finale"><Finale answers={answers} plan={plan} destinations={destinations} /></div>
    </main>
  );
}