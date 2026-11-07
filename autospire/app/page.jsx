"use client";
import { useState } from "react";
import Header from "@/components/Header/Header";
import Hero from "@/components/Hero/Hero";
import Services from "@/components/Services/Services";
import Garages from "@/components/Garages/Garages";
import HowItWorks from "@/components/HowItWorks/HowItWorks";
import Enquiry from "@/components/Enquiry/Enquiry";
import Footer from "@/components/Footer/Footer";
import ServiceModal from "@/components/ServiceModal/ServiceModal";
import GarageModal from "@/components/GarageModal/GarageModal";
import { services, garages } from "@/lib/data";

// Smoothly scrolls to the section with this id.
// The tiny delay lets the page finish updating first.
function scrollToSection(id) {
  setTimeout(() => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" }), 30);
}

export default function Page() {
  /* ---------- choices shared by the Hero search and the Enquiry form ---------- */
  const [emirate, setEmirate] = useState("Dubai");
  const [vehicle, setVehicle] = useState("");
  const [service, setService] = useState("");

  /* ---------- which Hero tab is open: "book" | "quote" | "garage" ---------- */
  const [tab, setTab] = useState("book");

  /* ---------- pop-ups: the id of the open service or garage (null = closed) ---------- */
  const [openServiceId, setOpenServiceId] = useState(null);
  const [openGarageId, setOpenGarageId] = useState(null);
  const openService = services.find((s) => s.id === openServiceId);
  const openGarage = garages.find((g) => g.id === openGarageId);

  /* ---------- message shown above the garages after a search ---------- */
  const [garageNote, setGarageNote] = useState("");

  /* ---------- car noise recording and video from the Hero "Book a Service" tab ---------- */
  // { audio, video }. Send these with the booking once you add a backend.
  const [issue, setIssue] = useState({ audio: null, video: null });

  // Opens a Hero tab (optionally pre-selecting a service), closes any pop-up, scrolls to the top
  function goToTab(tabId, serviceTitle) {
    setTab(tabId);
    if (serviceTitle) setService(serviceTitle);
    setOpenServiceId(null);
    setOpenGarageId(null);
    scrollToSection("top");
  }

  // Runs when the Hero search button is clicked
  function handleSearch() {
    if (tab === "quote") {
      scrollToSection("enquiry");
      return;
    }
    setGarageNote(`Showing garages for ${service || "all services"} in ${emirate}.`);
    scrollToSection("garages");
  }

  return (
    <>
      <Header emirate={emirate} setEmirate={setEmirate} openService={setOpenServiceId} goTab={goToTab} />

      <main>
        <Hero
          tab={tab} setTab={setTab}
          vehicle={vehicle} setVehicle={setVehicle}
          service={service} setService={setService}
          emirate={emirate} setEmirate={setEmirate}
          onSearch={handleSearch}
          onIssueChange={setIssue}
        />
        <Services open={setOpenServiceId} />
        <Garages open={setOpenGarageId} note={garageNote} />
        <HowItWorks />
        <Enquiry
          vehicle={vehicle} setVehicle={setVehicle}
          service={service} setService={setService}
          emirate={emirate} setEmirate={setEmirate}
        />
      </main>

      <Footer />

      {/* pop-ups (only rendered while one is open) */}
        {openService && <ServiceModal service={openService} onClose={() => setOpenServiceId(null)} goTab={goToTab} />}
        {openGarage && <GarageModal garage={openGarage} onClose={() => setOpenGarageId(null)} goTab={goToTab} />}
    </>
  );
}