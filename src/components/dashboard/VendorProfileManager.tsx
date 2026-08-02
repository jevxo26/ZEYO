"use client";

import React, { useState, useEffect } from "react";
import { CheckCircle2, MapPin, Briefcase, Settings2, Save } from "lucide-react";
import { toast } from "sonner";
import { useAppSelector } from "@/store/store";
import { useDynamicServices } from "@/hooks/useDynamicServices";
import { useDynamicZones } from "@/hooks/useDynamicZones";

export default function VendorProfileManager() {
  const { user } = useAppSelector((state) => state.auth);
  const dynamicServices = useDynamicServices();
  const dynamicZones = useDynamicZones();

  const [supportedServiceKeys, setSupportedServiceKeys] = useState<string[]>([]);
  const [supportedZoneIds, setSupportedZoneIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setSupportedServiceKeys(user.supportedServiceKeys || []);
      setSupportedZoneIds(user.supportedZoneIds || []);
    }
  }, [user]);

  const toggleService = (key: string) => {
    setSupportedServiceKeys(prev => 
      prev.includes(key) ? prev.filter(k => k !== key) : [...prev, key]
    );
  };

  const toggleZone = (id: string) => {
    setSupportedZoneIds(prev => 
      prev.includes(id) ? prev.filter(z => z !== id) : [...prev, id]
    );
  };

  const handleSave = () => {
    setLoading(true);
    setTimeout(() => {
      try {
        const users = JSON.parse(localStorage.getItem("users") || "[]");
        const updatedUsers = users.map((u: any) => {
          if (u.id === user?.id) {
            return {
              ...u,
              supportedServiceKeys,
              supportedZoneIds
            };
          }
          return u;
        });
        localStorage.setItem("users", JSON.stringify(updatedUsers));
        
        // Update current session
        if (user) {
          const updatedUser = { ...user, supportedServiceKeys, supportedZoneIds };
          localStorage.setItem("user", JSON.stringify(updatedUser));
        }

        toast.success("Profile preferences saved successfully!");
      } catch(e) {
        toast.error("Failed to save preferences.");
      }
      setLoading(false);
    }, 600);
  };

  return (
    <div className="max-w-4xl space-y-8">
      <div>
        <h2 className="text-xl font-bold text-slate-900">Vendor Profile & Coverage</h2>
        <p className="text-sm text-slate-500">Define the services you provide and the locations you can travel to.</p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center gap-3">
          <Briefcase className="w-5 h-5 text-indigo-600" />
          <h3 className="font-bold text-slate-900">Supported Services</h3>
        </div>
        <div className="p-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {dynamicServices.map(srv => {
            const isSelected = supportedServiceKeys.includes(srv.key);
            return (
              <label key={srv.key} className={`flex items-start gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${isSelected ? "border-indigo-600 bg-indigo-50/50" : "border-slate-100 hover:border-indigo-200"}`}>
                <input type="checkbox" checked={isSelected} onChange={() => toggleService(srv.key)} className="mt-1 w-4 h-4 text-indigo-600 rounded border-slate-300 focus:ring-indigo-600" />
                <div>
                  <p className={`text-sm font-bold ${isSelected ? "text-indigo-900" : "text-slate-700"}`}>{srv.name}</p>
                </div>
              </label>
            )
          })}
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center gap-3">
          <MapPin className="w-5 h-5 text-indigo-600" />
          <h3 className="font-bold text-slate-900">Working Zones</h3>
        </div>
        <div className="p-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {dynamicZones.map(zone => {
            const isSelected = supportedZoneIds.includes(zone.id);
            return (
              <label key={zone.id} className={`flex items-start gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${isSelected ? "border-indigo-600 bg-indigo-50/50" : "border-slate-100 hover:border-indigo-200"}`}>
                <input type="checkbox" checked={isSelected} onChange={() => toggleZone(zone.id)} className="mt-1 w-4 h-4 text-indigo-600 rounded border-slate-300 focus:ring-indigo-600" />
                <div>
                  <p className={`text-sm font-bold ${isSelected ? "text-indigo-900" : "text-slate-700"}`}>{zone.name}</p>
                </div>
              </label>
            )
          })}
        </div>
      </div>

      <div className="flex justify-end">
        <button onClick={handleSave} disabled={loading} className="inline-flex items-center gap-2 px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold shadow-lg shadow-indigo-500/25 transition-all disabled:opacity-50">
          <Save className="w-4 h-4" />
          {loading ? "Saving..." : "Save Preferences"}
        </button>
      </div>
    </div>
  );
}
