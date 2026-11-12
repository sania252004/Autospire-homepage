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
import { services, garages, savedVehicles, vehicleLabel } from "@/lib/data";
import { useRouter } from "next/navigation";

// Smoothly scrolls to the section with this id.
function scrollToSection(id) {
  setTimeout(() => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" }), 30);
}

export default function Page() {
  /* ---------- choices shared by the Hero search and the Enquiry form ---------- */
  const router = useRouter();
  const [emirate, setEmirate] = useState("Dubai");
  const [service, setService] = useState("");

  // the saved (primary) vehicle is pre-selected, so returning customers don't re-enter it
  const [vehicle, setVehicle] = useState(() => {
    const primary = savedVehicles.find((v) => v.primary) || savedVehicles[0];
    return primary ? vehicleLabel(primary) : "";
  });

  // written description of the problem (Request Quotations tab)
  const [problem, setProblem] = useState("");

  /* ---------- which Hero tab is open: "book" | "quote" | "garage" ---------- */
  const [tab, setTab] = useState("book");

  /* ---------- pop-ups ---------- */
  const [openServiceId, setOpenServiceId] = useState(null);
  const [openGarageId, setOpenGarageId] = useState(null);
  const openService = services.find((s) => s.id === openServiceId);
  const openGarage = garages.find((g) => g.id === openGarageId);

  /* ---------- message shown above the garages after a search ---------- */
  const [garageNote, setGarageNote] = useState("");

  /* ---------- car noise recording and video (Request Quotations tab only) ---------- */
  const [issue, setIssue] = useState({ audio: null, video: null });

  function goToTab(tabId, serviceTitle) {
    setTab(tabId);
    if (serviceTitle) setService(serviceTitle);
    setOpenServiceId(null);
    setOpenGarageId(null);
    scrollToSection("top");
  }

  // Runs when the Hero main button is clicked
  function handleSearch() {
    if (tab === "quote") {
      // send the request to the quotation journey
      const params = new URLSearchParams({ vehicle, service, problem, emirate });
      if (issue.audio) params.set("noise", "1");
      if (issue.video) params.set("video", "1");
      router.push(`/my-quotes?${params.toString()}`);
      return;
    }

    if (tab === "book") {
      // send the choices to the booking flow
      const params = new URLSearchParams({ vehicle, service, emirate });
      router.push(`/book?${params.toString()}`);
      return;
    }

    // "garage" tab: stay on this page and show the garages
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
          problem={problem} setProblem={setProblem}
          onSearch={handleSearch}
          onIssueChange={setIssue}
        />
        <Services open={setOpenServiceId} />
        <Garages open={setOpenGarageId} note={garageNote} goTab={goToTab} />
        <HowItWorks />
        <Enquiry
          vehicle={vehicle} setVehicle={setVehicle}
          service={service} setService={setService}
          emirate={emirate} setEmirate={setEmirate}
        />
      </main>

      <Footer />

      {openService && <ServiceModal service={openService} onClose={() => setOpenServiceId(null)} goTab={goToTab} />}
      {openGarage && <GarageModal garage={openGarage} onClose={() => setOpenGarageId(null)} goTab={goToTab} />}
    </>
  );
}