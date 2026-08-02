"use client";

import React, { useState, useEffect } from "react";
import {
  Plus,
  Edit2,
  Trash2,
  CheckCircle2,
  X,
  Layers,
  MapPin,
  Settings2,
  ListPlus,
  PackagePlus,
  BoxSelect,
  Tag,
  AlignLeft,
} from "lucide-react";
import { toast } from "sonner";
import { CalculatorServiceDefinition, ServiceTierOption, CoverageOption, ServiceAddonOption } from "@/types/calculator";
import { CALCULATOR_SERVICES, BANGLADESH_ZONES } from "@/lib/calculatorData";
import { useDynamicZones } from "@/hooks/useDynamicZones";

export default function ServiceCatalogManager() {
  const [services, setServices] = useState<CalculatorServiceDefinition[]>(CALCULATOR_SERVICES);
  const [categories, setCategories] = useState<string[]>(["Media & Captures", "Culinary & Catering", "Event Decor", "Entertainment", "Logistics"]);
  const [serviceTypes, setServiceTypes] = useState<string[]>(["Essential", "Premium", "Luxury", "Add-on Only"]);
  
  const dynamicZones = useDynamicZones();

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<CalculatorServiceDefinition | null>(null);

  // Form State - Base
  const [id, setId] = useState("");
  const [key, setKey] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [iconName, setIconName] = useState("Star");
  const [category, setCategory] = useState("Media & Captures");
  const [serviceType, setServiceType] = useState("Essential");
  const [availableZones, setAvailableZones] = useState<string[] | "all">("all");
  const [isPerGuest, setIsPerGuest] = useState(false);
  const [defaultGuestPrice, setDefaultGuestPrice] = useState<number>(0);

  // Form State - Arrays
  const [tiers, setTiers] = useState<ServiceTierOption[]>([]);
  const [coverages, setCoverages] = useState<CoverageOption[]>([]);
  const [addons, setAddons] = useState<ServiceAddonOption[]>([]);

  // Array Builders
  const [newTierName, setNewTierName] = useState("");
  const [newTierPrice, setNewTierPrice] = useState(0);
  
  const [newCoverageName, setNewCoverageName] = useState("");
  const [newCoverageMult, setNewCoverageMult] = useState(1.0);
  
  const [newAddonName, setNewAddonName] = useState("");
  const [newAddonPrice, setNewAddonPrice] = useState(0);

  const loadData = () => {
    if (typeof window !== "undefined") {
      try {
        const stored = localStorage.getItem("customServices");
        if (stored) setServices(JSON.parse(stored));
        else setServices(CALCULATOR_SERVICES);

        const storedCats = localStorage.getItem("customServiceCategories");
        if (storedCats) setCategories(JSON.parse(storedCats));

        const storedTypes = localStorage.getItem("customServiceTypes");
        if (storedTypes) setServiceTypes(JSON.parse(storedTypes));
      } catch (e) {}
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const saveToLocalStorage = (updatedList: CalculatorServiceDefinition[], updatedCats?: string[], updatedTypes?: string[]) => {
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem("customServices", JSON.stringify(updatedList));
        if (updatedCats) localStorage.setItem("customServiceCategories", JSON.stringify(updatedCats));
        if (updatedTypes) localStorage.setItem("customServiceTypes", JSON.stringify(updatedTypes));
        window.dispatchEvent(new CustomEvent("dashboard-data-update"));
      } catch (e) {}
    }
  };

  const handleOpenModal = (item?: CalculatorServiceDefinition) => {
    if (item) {
      setEditingItem(item);
      setId(item.id);
      setKey(item.key);
      setName(item.name);
      setDescription(item.description);
      setIconName(item.iconName || "Star");
      setCategory(item.category || categories[0]);
      setServiceType(item.serviceType || serviceTypes[0]);
      setAvailableZones(item.availableZones || "all");
      setIsPerGuest(item.isPerGuest || false);
      setDefaultGuestPrice(item.defaultGuestPrice || 0);
      setTiers([...item.tiers]);
      setCoverages([...item.coverages]);
      setAddons([...item.addons]);
    } else {
      setEditingItem(null);
      setId(`srv-${Date.now()}`);
      setKey("");
      setName("");
      setDescription("");
      setIconName("Sparkles");
      setCategory(categories[0]);
      setServiceType(serviceTypes[0]);
      setAvailableZones("all");
      setIsPerGuest(false);
      setDefaultGuestPrice(0);
      setTiers([{ id: "basic", name: "Standard Variant", price: 5000, description: "Default tier", features: [] }]);
      setCoverages([{ id: "std", name: "Standard Coverage", multiplier: 1.0 }]);
      setAddons([]);
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingItem(null);
  };

  const handleSaveService = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !key || tiers.length === 0 || coverages.length === 0) {
      toast.error("Name, Key, at least 1 Tier and 1 Coverage are required.");
      return;
    }

    const updatedService: CalculatorServiceDefinition = {
      id,
      key: key.toLowerCase().replace(/\s+/g, "-"),
      name,
      description,
      iconName,
      category,
      serviceType,
      availableZones,
      isPerGuest,
      defaultGuestPrice,
      tiers,
      coverages,
      addons,
    };

    let updatedList = [...services];
    if (editingItem) {
      updatedList = updatedList.map((s) => (s.id === editingItem.id ? updatedService : s));
      toast.success(`✓ Service "${name}" updated successfully!`);
    } else {
      updatedList.push(updatedService);
      toast.success(`✓ New Service "${name}" published!`);
    }

    setServices(updatedList);
    saveToLocalStorage(updatedList);
    handleCloseModal();
  };

  const handleDelete = (idToDelete: string) => {
    if (confirm("Are you sure you want to delete this service? This may break existing calculator presets!")) {
      const updated = services.filter((s) => s.id !== idToDelete);
      setServices(updated);
      saveToLocalStorage(updated);
      toast.success("✓ Service deleted!");
    }
  };

  const toggleZone = (zoneId: string) => {
    if (availableZones === "all") {
      setAvailableZones([zoneId]);
    } else {
      if (availableZones.includes(zoneId)) {
        const next = availableZones.filter(z => z !== zoneId);
        setAvailableZones(next.length === 0 ? "all" : next);
      } else {
        setAvailableZones([...availableZones, zoneId]);
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Service & Resource Catalog</h2>
          <p className="text-sm text-slate-500">Manage all services, variants, coverages and addons available in the Smart Calculator.</p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-xl transition-all shadow-md hover:shadow-indigo-500/25 shrink-0"
        >
          <Plus className="w-4 h-4" />
          Create Service
        </button>
      </div>

      {/* Grid of Services */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {services.map((srv) => (
          <div key={srv.id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md hover:border-indigo-200 transition-all group flex flex-col">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                  <BoxSelect className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 leading-tight">{srv.name}</h3>
                  <p className="text-xs text-slate-500 font-mono mt-0.5">{srv.key}</p>
                </div>
              </div>
              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={() => handleOpenModal(srv)} className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg">
                  <Edit2 className="w-4 h-4" />
                </button>
                <button onClick={() => handleDelete(srv.id)} className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            <p className="text-sm text-slate-600 line-clamp-2 mb-4 flex-1">{srv.description}</p>
            
            <div className="space-y-2 mt-auto">
              <div className="flex items-center justify-between text-xs py-1.5 border-t border-slate-100">
                <span className="text-slate-500 flex items-center gap-1"><Layers className="w-3.5 h-3.5" /> Variants (Tiers)</span>
                <span className="font-semibold text-slate-900">{srv.tiers.length} Active</span>
              </div>
              <div className="flex items-center justify-between text-xs py-1.5 border-t border-slate-100">
                <span className="text-slate-500 flex items-center gap-1"><Settings2 className="w-3.5 h-3.5" /> Configurations</span>
                <span className="font-semibold text-slate-900">{srv.coverages.length} Options</span>
              </div>
              <div className="flex items-center justify-between text-xs py-1.5 border-t border-slate-100">
                <span className="text-slate-500 flex items-center gap-1"><PackagePlus className="w-3.5 h-3.5" /> Add-ons</span>
                <span className="font-semibold text-slate-900">{srv.addons.length} Extras</span>
              </div>
              <div className="flex items-center justify-between text-xs py-1.5 border-t border-slate-100">
                <span className="text-slate-500 flex items-center gap-1"><MapPin className="w-3.5 h-3.5" /> Zone Access</span>
                <span className={`font-semibold ${!srv.availableZones || srv.availableZones === "all" ? "text-emerald-600" : "text-indigo-600"}`}>
                  {!srv.availableZones || srv.availableZones === "all" ? "All Zones" : `${srv.availableZones.length} Zones`}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white rounded-3xl w-full max-w-4xl shadow-2xl flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100 bg-slate-50/50 rounded-t-3xl shrink-0">
              <h2 className="text-xl font-bold text-slate-900">
                {editingItem ? "Edit Service Definition" : "Create New Service"}
              </h2>
              <button onClick={handleCloseModal} className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto flex-1">
              <form id="serviceForm" onSubmit={handleSaveService} className="space-y-8">
                
                {/* 1. Basic Info */}
                <section>
                  <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4 flex items-center gap-2">
                    <AlignLeft className="w-4 h-4 text-indigo-500" /> Basic Information
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-slate-700">Service Name *</label>
                      <input type="text" required value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Cinematic Videography" className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:border-indigo-500 focus:bg-white transition-all" />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-slate-700">Unique Key *</label>
                      <input type="text" required value={key} onChange={(e) => setKey(e.target.value.toLowerCase())} placeholder="e.g. videography" className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:border-indigo-500 focus:bg-white transition-all font-mono" />
                    </div>
                    <div className="space-y-1.5 sm:col-span-2">
                      <label className="text-xs font-semibold text-slate-700">Short Description</label>
                      <textarea required value={description} onChange={(e) => setDescription(e.target.value)} rows={2} className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:border-indigo-500 focus:bg-white transition-all" />
                    </div>
                    
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-slate-700">Category</label>
                      <select value={category} onChange={e => setCategory(e.target.value)} className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:border-indigo-500 focus:bg-white transition-all">
                        {categories.map(c => <option key={c} value={c}>{c}</option>)}
                      </select>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-slate-700">Service Type</label>
                      <select value={serviceType} onChange={e => setServiceType(e.target.value)} className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:border-indigo-500 focus:bg-white transition-all">
                        {serviceTypes.map(t => <option key={t} value={t}>{t}</option>)}
                      </select>
                    </div>

                    <div className="space-y-1.5 sm:col-span-2">
                      <label className="text-xs font-semibold text-slate-700 flex items-center gap-2">
                        <input type="checkbox" checked={isPerGuest} onChange={e => setIsPerGuest(e.target.checked)} className="w-4 h-4 text-indigo-600 rounded border-slate-300" />
                        Is this a Per-Guest Service? (e.g. Catering)
                      </label>
                    </div>
                  </div>
                </section>

                {/* 2. Zone Availability */}
                <section>
                  <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4 flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-indigo-500" /> Zone Availability
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    <button type="button" onClick={() => setAvailableZones("all")} className={`px-4 py-2 rounded-xl text-sm font-semibold transition-colors border ${availableZones === "all" ? "bg-indigo-600 text-white border-indigo-600" : "bg-white text-slate-600 border-slate-200 hover:border-indigo-300"}`}>
                      Available Everywhere
                    </button>
                    {dynamicZones.map(z => {
                      const isActive = availableZones !== "all" && availableZones.includes(z.id);
                      return (
                        <button key={z.id} type="button" onClick={() => toggleZone(z.id)} className={`px-4 py-2 rounded-xl text-sm font-semibold transition-colors border ${isActive ? "bg-indigo-50 text-indigo-700 border-indigo-200" : "bg-white text-slate-600 border-slate-200 hover:border-indigo-300"}`}>
                          {z.name}
                        </button>
                      );
                    })}
                  </div>
                </section>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Tiers */}
                  <section>
                    <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4 flex items-center gap-2">
                      <Layers className="w-4 h-4 text-indigo-500" /> Service Variants (Tiers)
                    </h3>
                    <div className="space-y-3 mb-4">
                      {tiers.map(t => (
                        <div key={t.id} className="flex items-center justify-between p-3 bg-slate-50 border border-slate-200 rounded-xl">
                          <div>
                            <p className="font-semibold text-sm text-slate-900">{t.name}</p>
                            <p className="text-xs text-indigo-600 font-bold">BDT {t.price}</p>
                          </div>
                          <button type="button" onClick={() => setTiers(tiers.filter(x => x.id !== t.id))} className="text-rose-500 hover:text-rose-700 p-1"><Trash2 className="w-4 h-4" /></button>
                        </div>
                      ))}
                    </div>
                    <div className="flex items-end gap-2">
                      <div className="flex-1 space-y-1">
                        <label className="text-xs font-semibold text-slate-500">Tier Name</label>
                        <input type="text" value={newTierName} onChange={e => setNewTierName(e.target.value)} className="w-full px-3 py-2 border rounded-lg text-sm" placeholder="e.g. Premium" />
                      </div>
                      <div className="w-24 space-y-1">
                        <label className="text-xs font-semibold text-slate-500">Price</label>
                        <input type="number" value={newTierPrice || ""} onChange={e => setNewTierPrice(Number(e.target.value))} className="w-full px-3 py-2 border rounded-lg text-sm" placeholder="10000" />
                      </div>
                      <button type="button" onClick={() => {
                        if (newTierName && newTierPrice > 0) {
                          setTiers([...tiers, { id: `tier-${Date.now()}`, name: newTierName, price: newTierPrice, description: "", features: [] }]);
                          setNewTierName(""); setNewTierPrice(0);
                        }
                      }} className="p-2 bg-slate-900 text-white rounded-lg hover:bg-indigo-600 transition-colors"><Plus className="w-5 h-5"/></button>
                    </div>
                  </section>

                  {/* Coverages */}
                  <section>
                    <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4 flex items-center gap-2">
                      <Settings2 className="w-4 h-4 text-indigo-500" /> Configurations (Coverages)
                    </h3>
                    <div className="space-y-3 mb-4">
                      {coverages.map(c => (
                        <div key={c.id} className="flex items-center justify-between p-3 bg-slate-50 border border-slate-200 rounded-xl">
                          <div>
                            <p className="font-semibold text-sm text-slate-900">{c.name}</p>
                            <p className="text-xs text-indigo-600 font-bold">{c.multiplier}x Multiplier</p>
                          </div>
                          <button type="button" onClick={() => setCoverages(coverages.filter(x => x.id !== c.id))} className="text-rose-500 hover:text-rose-700 p-1"><Trash2 className="w-4 h-4" /></button>
                        </div>
                      ))}
                    </div>
                    <div className="flex items-end gap-2">
                      <div className="flex-1 space-y-1">
                        <label className="text-xs font-semibold text-slate-500">Config Name</label>
                        <input type="text" value={newCoverageName} onChange={e => setNewCoverageName(e.target.value)} className="w-full px-3 py-2 border rounded-lg text-sm" placeholder="e.g. 1 Day" />
                      </div>
                      <div className="w-24 space-y-1">
                        <label className="text-xs font-semibold text-slate-500">Multiplier</label>
                        <input type="number" step="0.1" value={newCoverageMult || ""} onChange={e => setNewCoverageMult(Number(e.target.value))} className="w-full px-3 py-2 border rounded-lg text-sm" placeholder="1.5" />
                      </div>
                      <button type="button" onClick={() => {
                        if (newCoverageName && newCoverageMult > 0) {
                          setCoverages([...coverages, { id: `cov-${Date.now()}`, name: newCoverageName, multiplier: newCoverageMult }]);
                          setNewCoverageName(""); setNewCoverageMult(1.0);
                        }
                      }} className="p-2 bg-slate-900 text-white rounded-lg hover:bg-indigo-600 transition-colors"><Plus className="w-5 h-5"/></button>
                    </div>
                  </section>
                  
                  {/* Addons */}
                  <section className="lg:col-span-2">
                    <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4 flex items-center gap-2">
                      <PackagePlus className="w-4 h-4 text-indigo-500" /> Service Add-ons
                    </h3>
                    <div className="flex flex-wrap gap-3 mb-4">
                      {addons.map(a => (
                        <div key={a.id} className="flex items-center gap-3 p-2.5 pr-4 bg-indigo-50/50 border border-indigo-100 rounded-xl">
                          <button type="button" onClick={() => setAddons(addons.filter(x => x.id !== a.id))} className="text-rose-400 hover:text-rose-600 p-1"><Trash2 className="w-4 h-4" /></button>
                          <div>
                            <p className="font-semibold text-xs text-slate-900">{a.name}</p>
                            <p className="text-[10px] text-indigo-600 font-bold uppercase">BDT {a.price}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="flex items-end gap-2 max-w-md">
                      <div className="flex-1 space-y-1">
                        <input type="text" value={newAddonName} onChange={e => setNewAddonName(e.target.value)} className="w-full px-3 py-2 border rounded-lg text-sm" placeholder="Add-on Name (e.g. Drone)" />
                      </div>
                      <div className="w-24 space-y-1">
                        <input type="number" value={newAddonPrice || ""} onChange={e => setNewAddonPrice(Number(e.target.value))} className="w-full px-3 py-2 border rounded-lg text-sm" placeholder="Price" />
                      </div>
                      <button type="button" onClick={() => {
                        if (newAddonName && newAddonPrice >= 0) {
                          setAddons([...addons, { id: `add-${Date.now()}`, name: newAddonName, price: newAddonPrice, isPerGuest: false }]);
                          setNewAddonName(""); setNewAddonPrice(0);
                        }
                      }} className="p-2 bg-slate-900 text-white rounded-lg hover:bg-indigo-600 transition-colors"><Plus className="w-5 h-5"/></button>
                    </div>
                  </section>
                </div>

              </form>
            </div>
            
            <div className="p-6 border-t border-slate-100 bg-slate-50/50 rounded-b-3xl shrink-0 flex justify-end gap-3">
              <button type="button" onClick={handleCloseModal} className="px-6 py-2.5 text-sm font-bold text-slate-600 hover:bg-slate-200 rounded-xl transition-colors">
                Cancel
              </button>
              <button form="serviceForm" type="submit" className="px-8 py-2.5 text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-lg shadow-indigo-500/25 transition-all">
                {editingItem ? "Save Changes" : "Publish Service"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
