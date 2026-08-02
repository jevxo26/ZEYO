"use client";

import React, { useState, useEffect } from "react";
import {
  Plus,
  Edit2,
  Trash2,
  X,
  PackageSearch,
  CheckCircle2,
  Settings2,
  Image as ImageIcon,
  Tag,
  Percent,
} from "lucide-react";
import { toast } from "sonner";
import { EventPackage, ConfiguredPackageService } from "@/types/package";
import { DEFAULT_PACKAGES } from "@/hooks/useDynamicPackages";
import { useDynamicServices } from "@/hooks/useDynamicServices";

// We need EVENT_TYPES to pick from. Since we have a hook or file, we'll import it.
// If EVENT_TYPES is in calculatorData, let's import it.
import { EVENT_TYPES } from "@/lib/calculatorData";

export default function PackageCatalogManager() {
  const [packages, setPackages] = useState<EventPackage[]>(DEFAULT_PACKAGES);
  const dynamicServices = useDynamicServices();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<EventPackage | null>(null);

  // Form State
  const [id, setId] = useState("");
  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [eventTypeId, setEventTypeId] = useState(EVENT_TYPES[0]?.id || "");
  const [basePrice, setBasePrice] = useState(0);
  const [discountPercentage, setDiscountPercentage] = useState(0);
  const [imageUrl, setImageUrl] = useState("");
  const [popular, setPopular] = useState(false);
  const [configuredServices, setConfiguredServices] = useState<ConfiguredPackageService[]>([]);

  // Add Service State
  const [newSrvKey, setNewSrvKey] = useState("");
  const [newTierId, setNewTierId] = useState("");
  const [newCovId, setNewCovId] = useState("");

  const loadData = () => {
    if (typeof window !== "undefined") {
      try {
        const stored = localStorage.getItem("customPackages");
        if (stored) {
          setPackages(JSON.parse(stored));
        } else {
          setPackages(DEFAULT_PACKAGES);
        }
      } catch (e) {}
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const saveToLocalStorage = (updatedList: EventPackage[]) => {
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem("customPackages", JSON.stringify(updatedList));
        window.dispatchEvent(new CustomEvent("dashboard-data-update"));
      } catch (e) {}
    }
  };

  const handleOpenModal = (item?: EventPackage) => {
    if (item) {
      setEditingItem(item);
      setId(item.id);
      setTitle(item.title);
      setSubtitle(item.subtitle);
      setEventTypeId(item.eventTypeId);
      setBasePrice(item.basePrice);
      setDiscountPercentage(item.discountPercentage);
      setImageUrl(item.imageUrl || "");
      setPopular(item.popular || false);
      setConfiguredServices([...item.configuredServices]);
    } else {
      setEditingItem(null);
      setId(`pkg-${Date.now()}`);
      setTitle("");
      setSubtitle("");
      setEventTypeId(EVENT_TYPES[0]?.id || "");
      setBasePrice(0);
      setDiscountPercentage(0);
      setImageUrl("");
      setPopular(false);
      setConfiguredServices([]);
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingItem(null);
  };

  const handleSavePackage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !eventTypeId) {
      toast.error("Title and Event Type are required.");
      return;
    }

    const updatedPackage: EventPackage = {
      id,
      title,
      subtitle,
      eventTypeId,
      basePrice,
      discountPercentage,
      imageUrl,
      popular,
      configuredServices,
    };

    let updatedList = [...packages];
    if (editingItem) {
      updatedList = updatedList.map((p) => (p.id === editingItem.id ? updatedPackage : p));
      toast.success(`✓ Package "${title}" updated successfully!`);
    } else {
      updatedList.push(updatedPackage);
      toast.success(`✓ New Package "${title}" published!`);
    }

    setPackages(updatedList);
    saveToLocalStorage(updatedList);
    handleCloseModal();
  };

  const handleDelete = (idToDelete: string) => {
    if (confirm("Are you sure you want to delete this package?")) {
      const updated = packages.filter((p) => p.id !== idToDelete);
      setPackages(updated);
      saveToLocalStorage(updated);
      toast.success("✓ Package deleted!");
    }
  };

  const addConfiguredService = () => {
    if (!newSrvKey) return;
    const srv = dynamicServices.find(s => s.key === newSrvKey);
    if (!srv) return;

    setConfiguredServices([
      ...configuredServices,
      {
        serviceKey: newSrvKey,
        tierId: newTierId || srv.tiers[0]?.id || "",
        coverageId: newCovId || srv.coverages[0]?.id || "",
        addons: [],
      }
    ]);
    setNewSrvKey("");
    setNewTierId("");
    setNewCovId("");
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Preset Packages</h2>
          <p className="text-sm text-slate-500">Create bundled service packages for customers to book directly.</p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-xl transition-all shadow-md hover:shadow-indigo-500/25 shrink-0"
        >
          <Plus className="w-4 h-4" />
          Create Package
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {packages.map((pkg) => {
          const eventType = EVENT_TYPES.find(e => e.id === pkg.eventTypeId);
          return (
            <div key={pkg.id} className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-all group flex flex-col">
              <div className="h-32 w-full bg-slate-100 relative">
                {pkg.imageUrl ? (
                  <img src={pkg.imageUrl} alt={pkg.title} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-400">
                    <ImageIcon className="w-8 h-8" />
                  </div>
                )}
                {pkg.popular && (
                  <span className="absolute top-2 left-2 px-2 py-1 bg-amber-500 text-white text-[10px] font-bold uppercase rounded-lg shadow-sm">Popular</span>
                )}
                <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => handleOpenModal(pkg)} className="p-1.5 bg-white/90 text-slate-700 hover:text-indigo-600 rounded-lg backdrop-blur-sm"><Edit2 className="w-4 h-4" /></button>
                  <button onClick={() => handleDelete(pkg.id)} className="p-1.5 bg-white/90 text-slate-700 hover:text-rose-600 rounded-lg backdrop-blur-sm"><Trash2 className="w-4 h-4" /></button>
                </div>
              </div>
              <div className="p-5 flex-1 flex flex-col">
                <div className="mb-3">
                  <h3 className="font-bold text-slate-900 text-lg leading-tight">{pkg.title}</h3>
                  <p className="text-xs text-indigo-600 font-semibold mt-1">{eventType?.name || pkg.eventTypeId}</p>
                </div>
                <p className="text-sm text-slate-500 line-clamp-2 mb-4 flex-1">{pkg.subtitle}</p>
                
                <div className="pt-4 border-t border-slate-100">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-semibold text-slate-500 uppercase">Base Price</span>
                    <span className="font-bold text-slate-900">BDT {pkg.basePrice.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-500 uppercase">Services</span>
                    <span className="font-semibold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md text-xs">{pkg.configuredServices.length} Included</span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white rounded-3xl w-full max-w-4xl shadow-2xl flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100 bg-slate-50/50 rounded-t-3xl shrink-0">
              <h2 className="text-xl font-bold text-slate-900">
                {editingItem ? "Edit Package" : "Create New Package"}
              </h2>
              <button onClick={handleCloseModal} className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto flex-1">
              <form id="packageForm" onSubmit={handleSavePackage} className="space-y-8">
                
                <section>
                  <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4 flex items-center gap-2">
                    <PackageSearch className="w-4 h-4 text-indigo-500" /> Package Info
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-slate-700">Package Title *</label>
                      <input type="text" required value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Premium Wedding" className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:border-indigo-500 focus:bg-white" />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-slate-700">Target Event Type *</label>
                      <select required value={eventTypeId} onChange={(e) => setEventTypeId(e.target.value)} className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:border-indigo-500 focus:bg-white">
                        {EVENT_TYPES.map(e => <option key={e.id} value={e.id}>{e.name}</option>)}
                      </select>
                    </div>
                    <div className="space-y-1.5 md:col-span-2">
                      <label className="text-xs font-semibold text-slate-700">Subtitle / Short Description</label>
                      <input type="text" value={subtitle} onChange={(e) => setSubtitle(e.target.value)} placeholder="Brief summary of what's included" className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:border-indigo-500 focus:bg-white" />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-slate-700">Image URL</label>
                      <input type="text" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} placeholder="https://..." className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:border-indigo-500 focus:bg-white" />
                    </div>
                    <div className="flex gap-4">
                      <div className="space-y-1.5 flex-1">
                        <label className="text-xs font-semibold text-slate-700 flex items-center gap-1"><Tag className="w-3 h-3"/> Base Price (BDT)</label>
                        <input type="number" required value={basePrice || ""} onChange={(e) => setBasePrice(Number(e.target.value))} placeholder="100000" className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:border-indigo-500 focus:bg-white" />
                      </div>
                      <div className="space-y-1.5 flex-1">
                        <label className="text-xs font-semibold text-slate-700 flex items-center gap-1"><Percent className="w-3 h-3"/> Discount (%)</label>
                        <input type="number" value={discountPercentage || ""} onChange={(e) => setDiscountPercentage(Number(e.target.value))} placeholder="15" className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:border-indigo-500 focus:bg-white" />
                      </div>
                    </div>
                    <div className="md:col-span-2 mt-2">
                      <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 cursor-pointer">
                        <input type="checkbox" checked={popular} onChange={(e) => setPopular(e.target.checked)} className="w-4 h-4 text-amber-500 rounded border-slate-300" />
                        Mark as Popular (Highlights package on frontend)
                      </label>
                    </div>
                  </div>
                </section>

                <section>
                  <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4 flex items-center gap-2">
                    <Settings2 className="w-4 h-4 text-indigo-500" /> Included Services (Configuration Presets)
                  </h3>
                  
                  <div className="space-y-3 mb-6">
                    {configuredServices.map((cs, idx) => {
                      const srv = dynamicServices.find(s => s.key === cs.serviceKey);
                      if (!srv) return null;
                      return (
                        <div key={idx} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 bg-slate-50 border border-slate-200 rounded-xl">
                          <div>
                            <h4 className="font-bold text-slate-900 flex items-center gap-2">{srv.name} <span className="px-2 py-0.5 bg-indigo-100 text-indigo-700 rounded text-[10px] uppercase font-bold">{srv.key}</span></h4>
                            <div className="flex items-center gap-3 mt-2 text-xs text-slate-600">
                              <span><span className="font-semibold text-slate-800">Tier:</span> {srv.tiers.find(t => t.id === cs.tierId)?.name || cs.tierId}</span>
                              <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                              <span><span className="font-semibold text-slate-800">Coverage:</span> {srv.coverages.find(c => c.id === cs.coverageId)?.name || cs.coverageId}</span>
                            </div>
                          </div>
                          <button type="button" onClick={() => {
                            const updated = [...configuredServices];
                            updated.splice(idx, 1);
                            setConfiguredServices(updated);
                          }} className="text-rose-500 hover:text-rose-700 p-2 hover:bg-rose-50 rounded-lg transition-colors shrink-0 self-start sm:self-center">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      )
                    })}
                    {configuredServices.length === 0 && (
                      <div className="p-8 border-2 border-dashed border-slate-200 rounded-2xl text-center text-slate-500 text-sm">
                        No services added yet. Add preset configurations below to build this package.
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col sm:flex-row items-end gap-3 p-4 bg-indigo-50/50 rounded-2xl border border-indigo-100">
                    <div className="flex-1 w-full space-y-1.5">
                      <label className="text-xs font-semibold text-indigo-900">Select Service</label>
                      <select value={newSrvKey} onChange={(e) => {
                        setNewSrvKey(e.target.value);
                        const s = dynamicServices.find(x => x.key === e.target.value);
                        if (s) {
                          setNewTierId(s.tiers[0]?.id || "");
                          setNewCovId(s.coverages[0]?.id || "");
                        }
                      }} className="w-full px-3 py-2 bg-white border border-indigo-200 rounded-lg text-sm">
                        <option value="">-- Choose --</option>
                        {dynamicServices.map(s => <option key={s.id} value={s.key}>{s.name}</option>)}
                      </select>
                    </div>
                    {newSrvKey && dynamicServices.find(s => s.key === newSrvKey) && (
                      <>
                        <div className="flex-1 w-full space-y-1.5">
                          <label className="text-xs font-semibold text-indigo-900">Preset Tier</label>
                          <select value={newTierId} onChange={e => setNewTierId(e.target.value)} className="w-full px-3 py-2 bg-white border border-indigo-200 rounded-lg text-sm">
                            {dynamicServices.find(s => s.key === newSrvKey)?.tiers.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                          </select>
                        </div>
                        <div className="flex-1 w-full space-y-1.5">
                          <label className="text-xs font-semibold text-indigo-900">Preset Coverage</label>
                          <select value={newCovId} onChange={e => setNewCovId(e.target.value)} className="w-full px-3 py-2 bg-white border border-indigo-200 rounded-lg text-sm">
                            {dynamicServices.find(s => s.key === newSrvKey)?.coverages.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                          </select>
                        </div>
                      </>
                    )}
                    <button type="button" onClick={addConfiguredService} disabled={!newSrvKey} className="w-full sm:w-auto px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-bold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-indigo-700 transition-colors shrink-0">
                      Add to Package
                    </button>
                  </div>
                </section>
                
              </form>
            </div>
            
            <div className="p-6 border-t border-slate-100 bg-slate-50/50 rounded-b-3xl shrink-0 flex justify-end gap-3">
              <button type="button" onClick={handleCloseModal} className="px-6 py-2.5 text-sm font-bold text-slate-600 hover:bg-slate-200 rounded-xl transition-colors">
                Cancel
              </button>
              <button form="packageForm" type="submit" className="px-8 py-2.5 text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-lg shadow-indigo-500/25 transition-all">
                {editingItem ? "Save Changes" : "Publish Package"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
