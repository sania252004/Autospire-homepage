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

const jump = (id) => setTimeout(() => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" }), 30);

export default function Page() {
  const [emirate, setEmirate] = useState("Dubai");
  const [tab, setTab] = useState("book");
  const [vehicle, setVehicle] = useState("");
  const [service, setService] = useState("");
  const [svcId, setSvcId] = useState(null);
  const [garId, setGarId] = useState(null);
  const [note, setNote] = useState("");

  const svc = services.find((s) => s.id === svcId);
  const gar = garages.find((g) => g.id === garId);

  const goTab = (t, title) => {
    setTab(t); if (title) setService(title);
    setSvcId(null); setGarId(null); jump("top");
  };
  const search = () => {
    if (tab === "quote") return jump("enquiry");
    setNote(`Showing garages for ${service || "all services"} in ${emirate}.`);
    jump("garages");
  };

  return (
    <>
      <Header emirate={emirate} setEmirate={setEmirate} openService={setSvcId} goTab={goTab} />
      <main>
        <Hero tab={tab} setTab={setTab} vehicle={vehicle} setVehicle={setVehicle} service={service} setService={setService} emirate={emirate} setEmirate={setEmirate} onSearch={search} />
        <Services open={setSvcId} />
        <Garages open={setGarId} note={note} />
        <HowItWorks />
        <Enquiry vehicle={vehicle} setVehicle={setVehicle} service={service} setService={setService} emirate={emirate} setEmirate={setEmirate} />
      </main>
      <Footer />
      {svc && <ServiceModal svc={svc} onClose={() => setSvcId(null)} goTab={goTab} />}
      {gar && <GarageModal gar={gar} onClose={() => setGarId(null)} goTab={goTab} />}
    </>
  );
}
