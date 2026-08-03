import { useState, useEffect } from "react";
import { CALCULATOR_SERVICES } from "@/lib/calculatorData";
import { CalculatorServiceDefinition } from "@/types/calculator";

export function useDynamicServices() {
  const [services, setServices] = useState<CalculatorServiceDefinition[]>(CALCULATOR_SERVICES);

  useEffect(() => {
    const loadServices = () => {
      try {
        const stored = localStorage.getItem("customServices");
        if (stored) {
          const parsed = JSON.parse(stored);
          if (parsed && parsed.length > 0) {
            setServices(parsed);
          } else {
            // Fallback if none exist
            setServices(CALCULATOR_SERVICES);
          }
        }
      } catch (e) {
        console.error("Failed to load custom services", e);
      }
    };

    loadServices();

    window.addEventListener("dashboard-data-update", loadServices);
    return () => {
      window.removeEventListener("dashboard-data-update", loadServices);
    };
  }, []);

  return services;
}
