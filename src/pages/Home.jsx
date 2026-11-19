import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import About from "../components/About";
import Skills from "../components/Skills";
import Projects from "../components/Projects";
import Experience from "../components/Experience";
import Certificates from "../components/Certificates";
import Contact from "../components/Contact";
import ScrollProgress from "../components/ScrollProgress";
import BackToTop from "../components/BackToTop";
import { personal as defaultProfile } from "../data/personal";
import { subscribePublicProfile } from "../services/portfolioService";

export default function Home() {
  const [profile, setProfile] = useState(defaultProfile);

  // Live real-time subscription to public profile in Firestore database
  useEffect(() => {
    const unsubscribe = subscribePublicProfile((liveProfile) => {
      if (liveProfile) {
        setProfile((prev) => ({ ...prev, ...liveProfile }));
      }
    });
    return () => unsubscribe?.();
  }, []);

  return (
    <>
      <ScrollProgress />
      <Navbar profile={profile} />
      <main>
        <Hero profile={profile} />
        <About profile={profile} />
        <Skills />
        <Projects />
        <Experience />
        <Certificates />
        <Contact profile={profile} />
      </main>
      <BackToTop />
    </>
  );
}
