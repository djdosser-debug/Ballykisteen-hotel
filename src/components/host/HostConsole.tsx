import React, { useState, useEffect } from 'react';
import { 
  Building2, 
  Wifi, 
  Clock, 
  MapPin, 
  Printer, 
  Save, 
  RotateCcw, 
  Eye, 
  Plus, 
  Trash2, 
  Check, 
  Lock,
  ArrowUp,
  ArrowDown,
  Globe,
  Utensils,
  ExternalLink,
  BookOpen,
  Waves,
  Sparkles,
  ChevronDown,
  ChevronUp,
  KeyRound,
  Flag,
  Coffee,
  Car,
  Tv,
  ShieldAlert,
  Heart,
  Award,
  HelpCircle,
  BedDouble,
  Phone,
  Calendar,
  AlertCircle
} from 'lucide-react';
import { useHotel } from '../../context/HotelContext';
import { Attraction, DiningItem, GuideSection } from '../../types/guidebook';
import { generateQrDataUrl, buildWifiQrString } from '../../utils/qrCode';
import { ImageUploadField } from './ImageUploadField';

const resortPresets = [
  { label: 'Resort Exterior', url: '/images/ballykisteen_resort_hero_1790677395754.jpg' },
  { label: 'Junction One Restaurant', url: '/images/junction_one_dining_1790677408670.jpg' },
  { label: 'Indoor Heated Pool', url: '/images/leisure_pool_spa_1790677420010.jpg' },
  { label: 'Championship Golf', url: '/images/championship_golf_course_1790677430157.jpg' },
];

const logoPresets = [
  { label: 'Official GN Crest Logo', url: '/ballykisteen_hotel_logo.jpg' },
];

const AVAILABLE_ICONS = [
  { name: 'KeyRound', label: 'Key / Access' },
  { name: 'Utensils', label: 'Dining & Menus' },
  { name: 'Flag', label: 'Golf & Course' },
  { name: 'Waves', label: 'Pool & Spa' },
  { name: 'Coffee', label: 'Breakfast & Café' },
  { name: 'Car', label: 'Transport & Parking' },
  { name: 'MapPin', label: 'Location & Map' },
  { name: 'Tv', label: 'Room Tech & TV' },
  { name: 'ShieldAlert', label: 'Policies & Safety' },
  { name: 'Sparkles', label: 'Luxury & Services' },
  { name: 'Clock', label: 'Hours & Times' },
  { name: 'Heart', label: 'Wellness' },
  { name: 'Award', label: 'Excellence' },
  { name: 'BedDouble', label: 'Room & Bedding' },
  { name: 'BookOpen', label: 'Guide Directory' },
  { name: 'Phone', label: 'Phone & Contacts' },
  { name: 'Wifi', label: 'Wi-Fi & Internet' },
  { name: 'Calendar', label: 'Schedule & Events' },
];

export const HostConsole: React.FC = () => {
  const { 
    hotelData, 
    updateHotelData, 
    resetToDefaults, 
    setAppMode, 
    logoutHost, 
    showToast,
    setActiveModal,
    syncStatus,
    lastSyncTime
  } = useHotel();

  const [activeHostTab, setActiveHostTab] = useState<
    'sections' | 'links' | 'property' | 'dining' | 'amenities' | 'attractions' | 'wifi' | 'standee'
  >('sections');
  
  const [wifiPreviewQr, setWifiPreviewQr] = useState<string>('');
  const [formData, setFormData] = useState(hotelData);
  const [isSaved, setIsSaved] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [expandedSectionId, setExpandedSectionId] = useState<string>('');

  useEffect(() => {
    setFormData(hotelData);
    if (hotelData.guideSections.length > 0 && !expandedSectionId) {
      setExpandedSectionId(hotelData.guideSections[0].id);
    }
  }, [hotelData]);

  // Update QR preview on Wi-Fi changes
  useEffect(() => {
    const wifiString = buildWifiQrString(
      formData.wifi.ssid,
      formData.wifi.password,
      formData.wifi.security,
      formData.wifi.hidden
    );
    generateQrDataUrl(wifiString, { width: 240, darkColor: '#14382c' }).then(url => {
      setWifiPreviewQr(url);
    });
  }, [formData.wifi]);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await updateHotelData(formData);
      setIsSaved(true);
      showToast('All changes broadcasted live to Cloud Firestore & in-room devices!');
      setTimeout(() => setIsSaved(false), 2500);
    } catch (err: any) {
      console.error('Save error:', err);
      showToast(`Warning: Cloud sync error (${err?.message || 'check connection'}). Data saved locally.`);
    } finally {
      setIsSaving(false);
    }
  };

  // --- Guide Sections Handlers ---
  const handleAddSection = () => {
    const newId = `section-${Date.now()}`;
    const newSection: GuideSection = {
      id: newId,
      title: 'New Guide Section',
      iconName: 'BookOpen',
      badge: '',
      image: '',
      items: [
        {
          heading: 'Overview & Information',
          details: 'Provide helpful guidance, hours, or policies for your guests here...',
          actionLabel: '',
          actionType: 'link',
          actionPayload: '',
        }
      ]
    };
    setFormData(prev => ({
      ...prev,
      guideSections: [...prev.guideSections, newSection]
    }));
    setExpandedSectionId(newId);
    showToast('New section added! Customize it below.');
  };

  const handleRemoveSection = (id: string) => {
    if (formData.guideSections.length <= 1) {
      alert('You must keep at least one guide section in your guidebook.');
      return;
    }
    if (window.confirm('Are you sure you want to remove this section from the resident guidebook?')) {
      setFormData(prev => ({
        ...prev,
        guideSections: prev.guideSections.filter(s => s.id !== id)
      }));
      showToast('Section removed');
    }
  };

  const handleMoveSection = (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= formData.guideSections.length) return;
    const nextSections = [...formData.guideSections];
    const temp = nextSections[index];
    nextSections[index] = nextSections[targetIndex];
    nextSections[targetIndex] = temp;
    setFormData(prev => ({ ...prev, guideSections: nextSections }));
  };

  const handleAddItemToSection = (sectionIndex: number) => {
    const nextSections = [...formData.guideSections];
    nextSections[sectionIndex].items.push({
      heading: 'New Topic Title',
      details: 'Provide detailed instructions or useful information for this topic...',
      actionLabel: '',
      actionType: 'link',
      actionPayload: '',
    });
    setFormData(prev => ({ ...prev, guideSections: nextSections }));
  };

  const handleRemoveItemFromSection = (sectionIndex: number, itemIndex: number) => {
    const nextSections = [...formData.guideSections];
    nextSections[sectionIndex].items.splice(itemIndex, 1);
    setFormData(prev => ({ ...prev, guideSections: nextSections }));
  };

  // --- Dining Items Handlers ---
  const handleAddDiningItem = () => {
    const newItem: DiningItem = {
      id: `dining-${Date.now()}`,
      name: 'Chef Specialty Dish',
      category: 'dinner',
      description: 'Prepared with seasonal Irish ingredients sourced from local farms.',
      hours: '5:30 PM – 9:30 PM',
      highlight: "Chef's Recommendation",
      image: '',
    };
    setFormData(prev => ({
      ...prev,
      dining: [newItem, ...prev.dining]
    }));
    showToast('New menu item added');
  };

  const handleRemoveDiningItem = (id: string) => {
    setFormData(prev => ({
      ...prev,
      dining: prev.dining.filter(d => d.id !== id)
    }));
  };

  // --- Attractions Handlers ---
  const handleAddAttraction = () => {
    const newAttraction: Attraction = {
      id: `attr-${Date.now()}`,
      name: 'Scenic Destination / Attraction',
      category: 'historic',
      distanceKm: '10 km',
      travelTime: '12 min drive',
      description: 'Highlight why guests should visit this destination...',
      insiderTip: 'Tip from hotel concierge...',
      mapsUrl: 'https://www.google.com/maps',
      image: '',
    };
    setFormData(prev => ({
      ...prev,
      attractions: [newAttraction, ...prev.attractions],
    }));
  };

  const handleRemoveAttraction = (id: string) => {
    setFormData(prev => ({
      ...prev,
      attractions: prev.attractions.filter(a => a.id !== id),
    }));
  };

  return (
    <div className="space-y-6 pb-16 text-slate-800 max-w-4xl mx-auto px-2 sm:px-4">
      {/* Host Bar Header */}
      <div className="bg-[#14382c] text-white p-5 rounded-3xl flex flex-wrap items-center justify-between gap-4 shadow-lg">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-[#c5a059]/20 flex items-center justify-center text-[#c5a059]">
            <Building2 className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="font-serif text-xl font-bold text-white">
                Host Management Suite
              </h2>
              <span className="text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded-full font-semibold">
                Admin Session Active
              </span>
              <span className="text-[10px] bg-emerald-950/80 text-emerald-300 border border-emerald-500/40 px-2.5 py-0.5 rounded-full font-medium flex items-center gap-1.5 shadow-2xs">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span>Firestore: dub-girder-kdw25</span>
              </span>
            </div>
            <p className="text-xs text-white/70">
              Complete control: add/remove sections, edit web links, upload photos & configure resort guidelines.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={async () => {
              try {
                await updateHotelData(formData);
                showToast('Changes saved & synced to Guest Portal');
              } catch (e) {
                console.warn('Auto-save error:', e);
              }
              setAppMode('guest');
            }}
            className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            <Eye className="w-4 h-4 text-[#c5a059]" />
            <span>Save & Preview</span>
          </button>
          <button
            onClick={logoutHost}
            className="px-3 py-2 rounded-xl bg-red-950/60 hover:bg-red-900 border border-red-500/30 text-red-200 text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            <Lock className="w-3.5 h-3.5" />
            <span>Lock</span>
          </button>
        </div>
      </div>

      {/* Host Navigation Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1 border-b border-slate-200">
        {[
          { id: 'sections', label: 'Guidebook Sections (Add/Remove)', icon: BookOpen },
          { id: 'links', label: 'Web Links & Bookings', icon: Globe },
          { id: 'property', label: 'Property & Branding', icon: Building2 },
          { id: 'dining', label: 'Dining & Menus', icon: Utensils },
          { id: 'amenities', label: 'Golf & Leisure Pool', icon: Clock },
          { id: 'attractions', label: 'Local Attractions', icon: MapPin },
          { id: 'wifi', label: 'Wi-Fi & Credentials', icon: Wifi },
          { id: 'standee', label: 'Print & Standee Studio', icon: Printer },
        ].map(tab => {
          const Icon = tab.icon;
          const isActive = activeHostTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveHostTab(tab.id as typeof activeHostTab)}
              className={`flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                isActive
                  ? 'bg-[#14382c] text-[#c5a059] shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* ========================================================= */}
      {/* Tab 1: Guidebook Sections (Add / Remove / Reorder / Edit) */}
      {/* ========================================================= */}
      {activeHostTab === 'sections' && (
        <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200 shadow-xs space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-3">
            <div>
              <h3 className="font-serif text-lg font-bold text-[#14382c]">
                Resident Guidebook Sections ({formData.guideSections.length})
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Add new sections, delete unwanted sections, reorder them, set custom banner photos, and edit topics and action links.
              </p>
            </div>
            <button
              onClick={handleAddSection}
              className="px-4 py-2 bg-[#14382c] text-white rounded-xl text-xs font-bold hover:bg-[#1c4a3a] flex items-center gap-1.5 shadow-xs active:scale-95 transition-all"
            >
              <Plus className="w-4 h-4 text-[#c5a059]" />
              <span>Add New Section</span>
            </button>
          </div>

          {/* Section List */}
          <div className="space-y-4">
            {formData.guideSections.map((section, sIdx) => {
              const isExpanded = expandedSectionId === section.id;
              return (
                <div
                  key={section.id}
                  className="rounded-2xl border border-slate-200 bg-[#f8f6f0]/60 overflow-hidden transition-all shadow-2xs"
                >
                  {/* Section Title Header Row */}
                  <div className="p-4 bg-white flex flex-wrap items-center justify-between gap-2 border-b border-slate-200/80">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span className="w-6 h-6 rounded-lg bg-[#14382c] text-[#c5a059] flex items-center justify-center text-xs font-bold shrink-0">
                        {sIdx + 1}
                      </span>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <h4 className="font-serif font-bold text-sm text-[#14382c] truncate">
                            {section.title}
                          </h4>
                          {section.badge && (
                            <span className="text-[10px] bg-[#14382c]/10 text-[#14382c] px-2 py-0.5 rounded-full font-semibold shrink-0">
                              {section.badge}
                            </span>
                          )}
                        </div>
                        <span className="text-[11px] text-slate-400">
                          {section.items.length} topics & guidelines
                        </span>
                      </div>
                    </div>

                    {/* Order Controls & Toggle */}
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => handleMoveSection(sIdx, 'up')}
                        disabled={sIdx === 0}
                        title="Move Section Up"
                        className="p-1.5 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 disabled:opacity-30 disabled:hover:bg-slate-50 text-slate-600 text-xs"
                      >
                        <ArrowUp className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleMoveSection(sIdx, 'down')}
                        disabled={sIdx === formData.guideSections.length - 1}
                        title="Move Section Down"
                        className="p-1.5 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 disabled:opacity-30 disabled:hover:bg-slate-50 text-slate-600 text-xs"
                      >
                        <ArrowDown className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleRemoveSection(section.id)}
                        title="Delete Section"
                        className="p-1.5 rounded-lg border border-red-200 bg-red-50 text-red-600 hover:bg-red-100 text-xs ml-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => setExpandedSectionId(isExpanded ? '' : section.id)}
                        className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold flex items-center gap-1 ml-1"
                      >
                        <span>{isExpanded ? 'Collapse' : 'Edit Section'}</span>
                        {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>

                  {/* Expanded Section Details Editor */}
                  {isExpanded && (
                    <div className="p-4 sm:p-5 space-y-5 animate-in fade-in duration-150">
                      {/* Section Main Image Banner */}
                      <ImageUploadField
                        label={`Banner Image for "${section.title}"`}
                        value={section.image || ''}
                        onChange={newUrl => {
                          const next = [...formData.guideSections];
                          next[sIdx] = { ...next[sIdx], image: newUrl };
                          setFormData({ ...formData, guideSections: next });
                        }}
                        hint="Cover photo displayed inside the expanded guidebook accordion."
                        aspectRatio="video"
                        presets={resortPresets}
                        placeholderText="Upload section banner photo"
                      />

                      {/* Title & Icon Settings */}
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs pt-1">
                        <div className="space-y-1 sm:col-span-2">
                          <label className="font-semibold text-slate-700">Section Title</label>
                          <input
                            type="text"
                            value={section.title}
                            onChange={e => {
                              const next = [...formData.guideSections];
                              next[sIdx] = { ...next[sIdx], title: e.target.value };
                              setFormData({ ...formData, guideSections: next });
                            }}
                            className="w-full p-2.5 rounded-xl border border-slate-300 bg-white"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="font-semibold text-slate-700">Display Icon</label>
                          <select
                            value={section.iconName}
                            onChange={e => {
                              const next = [...formData.guideSections];
                              next[sIdx] = { ...next[sIdx], iconName: e.target.value };
                              setFormData({ ...formData, guideSections: next });
                            }}
                            className="w-full p-2.5 rounded-xl border border-slate-300 bg-white"
                          >
                            {AVAILABLE_ICONS.map(ic => (
                              <option key={ic.name} value={ic.name}>
                                {ic.label} ({ic.name})
                              </option>
                            ))}
                          </select>
                        </div>

                        <div className="space-y-1 sm:col-span-3">
                          <label className="font-semibold text-slate-700">Badge Label (Optional)</label>
                          <input
                            type="text"
                            value={section.badge || ''}
                            onChange={e => {
                              const next = [...formData.guideSections];
                              next[sIdx] = { ...next[sIdx], badge: e.target.value };
                              setFormData({ ...formData, guideSections: next });
                            }}
                            placeholder="e.g. Essential, Complimentary, Junction One"
                            className="w-full p-2 rounded-xl border border-slate-300 bg-white"
                          />
                        </div>
                      </div>

                      {/* Topics / Items List inside this section */}
                      <div className="pt-3 border-t border-slate-200/80 space-y-3">
                        <div className="flex items-center justify-between">
                          <h5 className="font-bold text-xs uppercase tracking-wider text-[#14382c] flex items-center gap-1.5">
                            <BookOpen className="w-3.5 h-3.5 text-[#c5a059]" />
                            <span>Topics in this Section ({section.items.length})</span>
                          </h5>
                          <button
                            type="button"
                            onClick={() => handleAddItemToSection(sIdx)}
                            className="px-2.5 py-1 rounded-lg bg-[#14382c] text-white text-[11px] font-semibold hover:bg-[#1c4a3a] flex items-center gap-1 shadow-2xs"
                          >
                            <Plus className="w-3 h-3 text-[#c5a059]" />
                            <span>Add Topic</span>
                          </button>
                        </div>

                        <div className="space-y-3">
                          {section.items.map((item, iIdx) => (
                            <div
                              key={iIdx}
                              className="p-3.5 rounded-xl border border-slate-300 bg-white space-y-2.5 text-xs shadow-2xs"
                            >
                              <div className="flex items-center justify-between gap-2 border-b border-slate-100 pb-1.5">
                                <span className="font-semibold text-slate-500 text-[11px]">
                                  Topic #{iIdx + 1}
                                </span>
                                <button
                                  type="button"
                                  onClick={() => handleRemoveItemFromSection(sIdx, iIdx)}
                                  className="text-red-500 hover:text-red-700 p-0.5 text-[11px] flex items-center gap-1"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                  <span>Delete Topic</span>
                                </button>
                              </div>

                              <div className="space-y-1">
                                <label className="font-semibold text-slate-700">Topic Heading</label>
                                <input
                                  type="text"
                                  value={item.heading}
                                  onChange={e => {
                                    const next = [...formData.guideSections];
                                    next[sIdx].items[iIdx].heading = e.target.value;
                                    setFormData({ ...formData, guideSections: next });
                                  }}
                                  className="w-full p-2 rounded-lg border border-slate-200 font-medium"
                                />
                              </div>

                              <div className="space-y-1">
                                <label className="font-semibold text-slate-700">Details & Description</label>
                                <textarea
                                  rows={2}
                                  value={item.details}
                                  onChange={e => {
                                    const next = [...formData.guideSections];
                                    next[sIdx].items[iIdx].details = e.target.value;
                                    setFormData({ ...formData, guideSections: next });
                                  }}
                                  className="w-full p-2 rounded-lg border border-slate-200"
                                />
                              </div>

                              {/* Action Button Settings */}
                              <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200/80 space-y-2">
                                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
                                  Optional Action Button for Guests
                                </span>
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                                  <div>
                                    <label className="text-[10px] font-medium text-slate-600 block mb-0.5">Button Label</label>
                                    <input
                                      type="text"
                                      placeholder="e.g. Book Online, View Map"
                                      value={item.actionLabel || ''}
                                      onChange={e => {
                                        const next = [...formData.guideSections];
                                        next[sIdx].items[iIdx].actionLabel = e.target.value;
                                        setFormData({ ...formData, guideSections: next });
                                      }}
                                      className="w-full p-1.5 rounded-md border border-slate-200 bg-white text-xs"
                                    />
                                  </div>

                                  <div>
                                    <label className="text-[10px] font-medium text-slate-600 block mb-0.5">Action Type</label>
                                    <select
                                      value={item.actionType || 'link'}
                                      onChange={e => {
                                        const next = [...formData.guideSections];
                                        next[sIdx].items[iIdx].actionType = e.target.value as any;
                                        setFormData({ ...formData, guideSections: next });
                                      }}
                                      className="w-full p-1.5 rounded-md border border-slate-200 bg-white text-xs"
                                    >
                                      <option value="link">Web Link (External URL)</option>
                                      <option value="call">Phone Call</option>
                                      <option value="wifi">Connect to Wi-Fi</option>
                                      <option value="modal">Open Popup Dialog</option>
                                    </select>
                                  </div>

                                  <div>
                                    <label className="text-[10px] font-medium text-slate-600 block mb-0.5">Target Web URL / Phone</label>
                                    <input
                                      type="text"
                                      placeholder="https://... or +353..."
                                      value={item.actionPayload || ''}
                                      onChange={e => {
                                        const next = [...formData.guideSections];
                                        next[sIdx].items[iIdx].actionPayload = e.target.value;
                                        setFormData({ ...formData, guideSections: next });
                                      }}
                                      className="w-full p-1.5 rounded-md border border-slate-200 bg-white text-xs font-mono"
                                    />
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* Tab 2: Web Links & Direct Booking URLs */}
      {/* ========================================================= */}
      {activeHostTab === 'links' && (
        <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200 shadow-xs space-y-6">
          <div>
            <h3 className="font-serif text-lg font-bold text-[#14382c]">
              Resort Web Links & Direct Booking Engines
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Configure every external link and booking platform URL. Guests tapping action buttons throughout the guidebook will be directed immediately to these links.
            </p>
          </div>

          <div className="space-y-4 text-xs">
            {/* Table Booking Link */}
            <div className="p-4 rounded-2xl bg-[#f8f6f0]/70 border border-[#c5a059]/20 space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="font-semibold text-slate-800 flex items-center gap-1.5">
                  <Utensils className="w-3.5 h-3.5 text-[#c5a059]" />
                  <span>Junction One Online Table Reservation Link</span>
                </label>
                {formData.bookingLinks?.tableBookingUrl && (
                  <a
                    href={formData.bookingLinks.tableBookingUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[11px] text-[#14382c] font-semibold hover:underline flex items-center gap-1"
                  >
                    <span>Test Link</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>
              <input
                type="text"
                value={formData.bookingLinks?.tableBookingUrl || ''}
                onChange={e => setFormData({
                  ...formData,
                  bookingLinks: { ...formData.bookingLinks, tableBookingUrl: e.target.value }
                })}
                placeholder="https://... (e.g. OpenTable, ResDiary, or Hotel Table Booking Page)"
                className="w-full p-2.5 rounded-xl border border-slate-300 font-mono bg-white focus:border-[#14382c] focus:outline-hidden"
              />
              <p className="text-[11px] text-slate-500">
                Connected to the "Book Table Online" button on the Dining popup and the guidebook dining guide.
              </p>
            </div>

            {/* Golf Tee Time Booking Link */}
            <div className="p-4 rounded-2xl bg-[#f8f6f0]/70 border border-[#c5a059]/20 space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="font-semibold text-slate-800 flex items-center gap-1.5">
                  <Flag className="w-3.5 h-3.5 text-[#c5a059]" />
                  <span>Championship Golf Tee Times Reservation Link</span>
                </label>
                {formData.bookingLinks?.teeTimeBookingUrl && (
                  <a
                    href={formData.bookingLinks.teeTimeBookingUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[11px] text-[#14382c] font-semibold hover:underline flex items-center gap-1"
                  >
                    <span>Test Link</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>
              <input
                type="text"
                value={formData.bookingLinks?.teeTimeBookingUrl || ''}
                onChange={e => setFormData({
                  ...formData,
                  bookingLinks: { ...formData.bookingLinks, teeTimeBookingUrl: e.target.value }
                })}
                placeholder="https://... (e.g. BRS Golf, GolfNow, or Club Tee Booking Page)"
                className="w-full p-2.5 rounded-xl border border-slate-300 font-mono bg-white focus:border-[#14382c] focus:outline-hidden"
              />
              <p className="text-[11px] text-slate-500">
                Connected to the "Book Tee Time" action button in the golf course section.
              </p>
            </div>

            {/* Spa & Beauty Treatment Booking Link */}
            <div className="p-4 rounded-2xl bg-[#f8f6f0]/70 border border-[#c5a059]/20 space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="font-semibold text-slate-800 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-[#c5a059]" />
                  <span>Spa & Beauty Treatments Booking Link</span>
                </label>
                {formData.bookingLinks?.spaBookingUrl && (
                  <a
                    href={formData.bookingLinks.spaBookingUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[11px] text-[#14382c] font-semibold hover:underline flex items-center gap-1"
                  >
                    <span>Test Link</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>
              <input
                type="text"
                value={formData.bookingLinks?.spaBookingUrl || ''}
                onChange={e => setFormData({
                  ...formData,
                  bookingLinks: { ...formData.bookingLinks, spaBookingUrl: e.target.value }
                })}
                placeholder="https://... (e.g. Premier Spa booking link or brochure)"
                className="w-full p-2.5 rounded-xl border border-slate-300 font-mono bg-white focus:border-[#14382c] focus:outline-hidden"
              />
              <p className="text-[11px] text-slate-500">
                Connected to the "Book Spa Online" button in the pool & beauty rooms dialog.
              </p>
            </div>

            {/* Official Hotel Website */}
            <div className="p-4 rounded-2xl bg-white border border-slate-200 space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="font-semibold text-slate-800 flex items-center gap-1.5">
                  <Globe className="w-3.5 h-3.5 text-[#14382c]" />
                  <span>Official Hotel Website URL</span>
                </label>
                {formData.contact.website && (
                  <a
                    href={formData.contact.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[11px] text-[#14382c] font-semibold hover:underline flex items-center gap-1"
                  >
                    <span>Test Link</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>
              <input
                type="text"
                value={formData.contact.website}
                onChange={e => setFormData({
                  ...formData,
                  contact: { ...formData.contact, website: e.target.value },
                  bookingLinks: { ...formData.bookingLinks, hotelWebsite: e.target.value }
                })}
                placeholder="https://www.ballykisteenhotel.com"
                className="w-full p-2.5 rounded-xl border border-slate-300 font-mono bg-white"
              />
            </div>

            {/* Room Reservations Link */}
            <div className="p-4 rounded-2xl bg-white border border-slate-200 space-y-1.5">
              <label className="font-semibold text-slate-800 flex items-center gap-1.5">
                <BedDouble className="w-3.5 h-3.5 text-[#14382c]" />
                <span>Direct Room Booking Engine URL</span>
              </label>
              <input
                type="text"
                value={formData.bookingLinks?.roomBookingUrl || ''}
                onChange={e => setFormData({
                  ...formData,
                  bookingLinks: { ...formData.bookingLinks, roomBookingUrl: e.target.value }
                })}
                placeholder="https://www.ballykisteenhotel.com/rooms/"
                className="w-full p-2.5 rounded-xl border border-slate-300 font-mono bg-white"
              />
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* Tab 3: Property & Visual Branding */}
      {/* ========================================================= */}
      {activeHostTab === 'property' && (
        <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200 shadow-xs space-y-6">
          <div>
            <h3 className="font-serif text-lg font-bold text-[#14382c]">
              Resort Visual Branding & Logos
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Upload your hotel logo and main hero image. You can upload files directly from your computer/phone or paste an external URL.
            </p>
          </div>

          {/* Image Uploaders */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-2 border-t border-slate-100">
            {/* Logo Image */}
            <div className="bg-[#f8f6f0]/70 p-4 rounded-2xl border border-[#c5a059]/20">
              <ImageUploadField
                label="Property Logo / Crest"
                value={formData.logoImage || ''}
                onChange={newUrl => setFormData({ ...formData, logoImage: newUrl })}
                hint="Displayed in top header bar, hero badge, and on printable table standees."
                aspectRatio="square"
                presets={logoPresets}
                placeholderText="Upload Logo (PNG/SVG recommended)"
              />
            </div>

            {/* Main Hero Banner Image */}
            <div className="bg-[#f8f6f0]/70 p-4 rounded-2xl border border-[#c5a059]/20">
              <ImageUploadField
                label="Main Resort Hero Banner Image"
                value={formData.heroImage}
                onChange={newUrl => setFormData({ ...formData, heroImage: newUrl })}
                hint="Full-width cover photo on the guest guidebook home screen."
                aspectRatio="video"
                presets={resortPresets}
                placeholderText="Upload Hero Banner"
              />
            </div>
          </div>

          <div className="border-t border-slate-100 pt-4">
            <h4 className="font-serif text-base font-bold text-[#14382c] mb-3">
              Resort Contacts & Basic Information
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="space-y-1">
                <label className="font-semibold text-slate-700">Property Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-300 focus:border-[#14382c] focus:outline-hidden"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-700">Tagline / Subtitle</label>
                <input
                  type="text"
                  value={formData.tagline}
                  onChange={e => setFormData({ ...formData, tagline: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-300 focus:border-[#14382c] focus:outline-hidden"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-700">Reception Phone</label>
                <input
                  type="text"
                  value={formData.contact.receptionPhone}
                  onChange={e => setFormData({
                    ...formData,
                    contact: { ...formData.contact, receptionPhone: e.target.value }
                  })}
                  className="w-full p-2.5 rounded-xl border border-slate-300 focus:border-[#14382c] focus:outline-hidden"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-700">Golf Pro Shop Phone</label>
                <input
                  type="text"
                  value={formData.contact.golfPhone}
                  onChange={e => setFormData({
                    ...formData,
                    contact: { ...formData.contact, golfPhone: e.target.value }
                  })}
                  className="w-full p-2.5 rounded-xl border border-slate-300 focus:border-[#14382c] focus:outline-hidden"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-700">Front Desk Email</label>
                <input
                  type="email"
                  value={formData.contact.email}
                  onChange={e => setFormData({
                    ...formData,
                    contact: { ...formData.contact, email: e.target.value }
                  })}
                  className="w-full p-2.5 rounded-xl border border-slate-300 focus:border-[#14382c] focus:outline-hidden"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-700">Eircode</label>
                <input
                  type="text"
                  value={formData.contact.eircode}
                  onChange={e => setFormData({
                    ...formData,
                    contact: { ...formData.contact, eircode: e.target.value }
                  })}
                  className="w-full p-2.5 rounded-xl border border-slate-300 focus:border-[#14382c] focus:outline-hidden"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-700">Standard Check-In Time</label>
                <input
                  type="text"
                  value={formData.stayHours.checkIn}
                  onChange={e => setFormData({
                    ...formData,
                    stayHours: { ...formData.stayHours, checkIn: e.target.value }
                  })}
                  className="w-full p-2.5 rounded-xl border border-slate-300 focus:border-[#14382c] focus:outline-hidden"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-700">Standard Check-Out Time</label>
                <input
                  type="text"
                  value={formData.stayHours.checkOut}
                  onChange={e => setFormData({
                    ...formData,
                    stayHours: { ...formData.stayHours, checkOut: e.target.value }
                  })}
                  className="w-full p-2.5 rounded-xl border border-slate-300 focus:border-[#14382c] focus:outline-hidden"
                />
              </div>

              <div className="space-y-1 sm:col-span-2">
                <label className="font-semibold text-slate-700">Host Console Passcode (Password)</label>
                <input
                  type="text"
                  value={formData.hostPasscode}
                  onChange={e => setFormData({ ...formData, hostPasscode: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-300 font-mono text-sm focus:border-[#14382c] focus:outline-hidden"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* Tab 4: Dining & Menus (Photo, Hours, Add/Remove Items) */}
      {/* ========================================================= */}
      {activeHostTab === 'dining' && (
        <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200 shadow-xs space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-3">
            <div>
              <h3 className="font-serif text-lg font-bold text-[#14382c]">
                Junction One Restaurant & Menus ({formData.dining.length} items)
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Update restaurant photos, today's chef specials, and add or remove menu items.
              </p>
            </div>
            <button
              onClick={handleAddDiningItem}
              className="px-3.5 py-2 bg-[#14382c] text-white rounded-xl text-xs font-bold hover:bg-[#1c4a3a] flex items-center gap-1.5 shadow-xs"
            >
              <Plus className="w-3.5 h-3.5 text-[#c5a059]" />
              <span>Add Menu Item</span>
            </button>
          </div>

          {/* Dining Cover Image */}
          <div className="p-4 rounded-2xl bg-[#f8f6f0]/70 border border-[#c5a059]/20">
            <ImageUploadField
              label="Junction One Dining Main Image"
              value={formData.diningImage}
              onChange={newUrl => setFormData({ ...formData, diningImage: newUrl })}
              aspectRatio="video"
              presets={resortPresets}
              placeholderText="Upload restaurant image"
            />
          </div>

          {/* Daily Chef Special & Breakfast Hours */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs pt-1">
            <div className="space-y-1 sm:col-span-2">
              <label className="font-semibold text-slate-700">Chef's Today Special (Featured on Home)</label>
              <input
                type="text"
                value={formData.bulletin.todaysSpecial}
                onChange={e => setFormData({
                  ...formData,
                  bulletin: { ...formData.bulletin, todaysSpecial: e.target.value }
                })}
                className="w-full p-2.5 rounded-xl border border-slate-300"
              />
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-slate-700">Breakfast Status (Home Banner)</label>
              <input
                type="text"
                value={formData.bulletin.breakfastStatus}
                onChange={e => setFormData({
                  ...formData,
                  bulletin: { ...formData.bulletin, breakfastStatus: e.target.value }
                })}
                className="w-full p-2 rounded-xl border border-slate-300"
              />
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-slate-700">Breakfast Hours (Weekdays)</label>
              <input
                type="text"
                value={formData.stayHours.breakfastWeekdays}
                onChange={e => setFormData({
                  ...formData,
                  stayHours: { ...formData.stayHours, breakfastWeekdays: e.target.value }
                })}
                className="w-full p-2 rounded-xl border border-slate-300"
              />
            </div>
          </div>

          {/* Menu Items List */}
          <div className="space-y-4 pt-2 border-t border-slate-100">
            <h4 className="font-bold text-xs uppercase tracking-wider text-[#14382c]">
              Menu Offerings
            </h4>
            <div className="space-y-3">
              {formData.dining.map((item, idx) => (
                <div
                  key={item.id}
                  className="p-4 rounded-2xl border border-slate-200 bg-[#f8f6f0]/50 space-y-3 text-xs"
                >
                  <div className="flex items-center justify-between gap-2 border-b border-slate-200/80 pb-2">
                    <span className="font-bold text-[#14382c]">
                      #{idx + 1} {item.name}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleRemoveDiningItem(item.id)}
                      className="text-red-500 hover:text-red-700 flex items-center gap-1 text-[11px]"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Remove Item</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                    <div className="space-y-1 sm:col-span-2">
                      <label className="font-semibold text-slate-700">Dish / Service Name</label>
                      <input
                        type="text"
                        value={item.name}
                        onChange={e => {
                          const next = [...formData.dining];
                          next[idx].name = e.target.value;
                          setFormData({ ...formData, dining: next });
                        }}
                        className="w-full p-2 rounded-xl border border-slate-300 bg-white"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="font-semibold text-slate-700">Category</label>
                      <select
                        value={item.category}
                        onChange={e => {
                          const next = [...formData.dining];
                          next[idx].category = e.target.value as any;
                          setFormData({ ...formData, dining: next });
                        }}
                        className="w-full p-2 rounded-xl border border-slate-300 bg-white"
                      >
                        <option value="breakfast">Breakfast</option>
                        <option value="lunch">Carvery & Lunch</option>
                        <option value="dinner">Evening Dinner</option>
                        <option value="drinks">Cocktails & Drinks</option>
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="font-semibold text-slate-700">Serving Hours</label>
                      <input
                        type="text"
                        value={item.hours}
                        onChange={e => {
                          const next = [...formData.dining];
                          next[idx].hours = e.target.value;
                          setFormData({ ...formData, dining: next });
                        }}
                        className="w-full p-2 rounded-xl border border-slate-300 bg-white"
                      />
                    </div>

                    <div className="space-y-1 sm:col-span-2">
                      <label className="font-semibold text-slate-700">Highlight Badge</label>
                      <input
                        type="text"
                        value={item.highlight || ''}
                        onChange={e => {
                          const next = [...formData.dining];
                          next[idx].highlight = e.target.value;
                          setFormData({ ...formData, dining: next });
                        }}
                        placeholder="e.g. Tipperary Beef, Sunday Roast"
                        className="w-full p-2 rounded-xl border border-slate-300 bg-white"
                      />
                    </div>

                    <div className="space-y-1 sm:col-span-3">
                      <label className="font-semibold text-slate-700">Dish Description</label>
                      <textarea
                        rows={2}
                        value={item.description}
                        onChange={e => {
                          const next = [...formData.dining];
                          next[idx].description = e.target.value;
                          setFormData({ ...formData, dining: next });
                        }}
                        className="w-full p-2 rounded-xl border border-slate-300 bg-white"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* Tab 5: Golf & Leisure Amenities (Photos, Status, Timetables) */}
      {/* ========================================================= */}
      {activeHostTab === 'amenities' && (
        <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200 shadow-xs space-y-6">
          <div>
            <h3 className="font-serif text-lg font-bold text-[#14382c]">
              Golf Course & Leisure Club Amenities
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Upload photos and manage opening hours, golf green conditions, and pool timetables.
            </p>
          </div>

          {/* Photos Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 rounded-2xl bg-[#f8f6f0]/70 border border-[#c5a059]/20">
            <ImageUploadField
              label="Indoor Heated Pool & Spa Photo"
              value={formData.leisureImage}
              onChange={newUrl => setFormData({ ...formData, leisureImage: newUrl })}
              aspectRatio="video"
              presets={resortPresets}
              placeholderText="Pool & Spa photo"
            />

            <ImageUploadField
              label="Championship Golf Course Photo"
              value={formData.golfImage}
              onChange={newUrl => setFormData({ ...formData, golfImage: newUrl })}
              aspectRatio="video"
              presets={resortPresets}
              placeholderText="Golf course photo"
            />
          </div>

          {/* Daily Status & Weather */}
          <div className="space-y-3 pt-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#14382c]">
              Golf Status & Weather Bulletin
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="space-y-1 sm:col-span-2">
                <label className="font-semibold text-slate-700">Course Condition Status</label>
                <input
                  type="text"
                  value={formData.bulletin.golfCourseStatus}
                  onChange={e => setFormData({
                    ...formData,
                    bulletin: { ...formData.bulletin, golfCourseStatus: e.target.value }
                  })}
                  className="w-full p-2.5 rounded-xl border border-slate-300"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-700">Temperature & Units</label>
                <input
                  type="text"
                  value={formData.bulletin.weatherTemp}
                  onChange={e => setFormData({
                    ...formData,
                    bulletin: { ...formData.bulletin, weatherTemp: e.target.value }
                  })}
                  className="w-full p-2 rounded-xl border border-slate-300"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-700">Weather Condition Summary</label>
                <input
                  type="text"
                  value={formData.bulletin.weatherCondition}
                  onChange={e => setFormData({
                    ...formData,
                    bulletin: { ...formData.bulletin, weatherCondition: e.target.value }
                  })}
                  className="w-full p-2 rounded-xl border border-slate-300"
                />
              </div>
            </div>
          </div>

          {/* Leisure Pool Timetables */}
          <div className="space-y-3 pt-3 border-t border-slate-100">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#14382c]">
              Pool & Spa Timetables
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="space-y-1">
                <label className="font-semibold text-slate-700">Pool Hours (Mon–Fri)</label>
                <input
                  type="text"
                  value={formData.leisure.poolWeekdays}
                  onChange={e => setFormData({
                    ...formData,
                    leisure: { ...formData.leisure, poolWeekdays: e.target.value }
                  })}
                  className="w-full p-2 rounded-xl border border-slate-300"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-700">Pool Hours (Sat–Sun)</label>
                <input
                  type="text"
                  value={formData.leisure.poolWeekends}
                  onChange={e => setFormData({
                    ...formData,
                    leisure: { ...formData.leisure, poolWeekends: e.target.value }
                  })}
                  className="w-full p-2 rounded-xl border border-slate-300"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-700">Children's Swim Times</label>
                <input
                  type="text"
                  value={formData.leisure.kidsSwimHours}
                  onChange={e => setFormData({
                    ...formData,
                    leisure: { ...formData.leisure, kidsSwimHours: e.target.value }
                  })}
                  className="w-full p-2 rounded-xl border border-slate-300"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-700">Adult-Only Peaceful Swim</label>
                <input
                  type="text"
                  value={formData.leisure.adultOnlyHours}
                  onChange={e => setFormData({
                    ...formData,
                    leisure: { ...formData.leisure, adultOnlyHours: e.target.value }
                  })}
                  className="w-full p-2 rounded-xl border border-slate-300"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-700">Silicone Swim Cap Price</label>
                <input
                  type="text"
                  value={formData.leisure.swimCapPrice}
                  onChange={e => setFormData({
                    ...formData,
                    leisure: { ...formData.leisure, swimCapPrice: e.target.value }
                  })}
                  className="w-full p-2 rounded-xl border border-slate-300"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* Tab 6: Local Attractions & Directions */}
      {/* ========================================================= */}
      {activeHostTab === 'attractions' && (
        <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <div>
              <h3 className="font-serif text-lg font-bold text-[#14382c]">
                Local Tipperary Attractions ({formData.attractions.length})
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Upload custom photos, directions and insider tips for every nearby attraction.
              </p>
            </div>
            <button
              onClick={handleAddAttraction}
              className="px-3.5 py-2 bg-[#14382c] text-white rounded-xl text-xs font-semibold hover:bg-[#1c4a3a] flex items-center gap-1.5 shadow-xs"
            >
              <Plus className="w-3.5 h-3.5 text-[#c5a059]" />
              <span>Add Attraction</span>
            </button>
          </div>

          <div className="space-y-5">
            {formData.attractions.map((attr, idx) => (
              <div key={attr.id} className="p-4 sm:p-5 rounded-2xl border border-slate-200 bg-[#f8f6f0]/50 space-y-4 text-xs">
                <div className="flex items-center justify-between gap-2 border-b border-slate-200/60 pb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-[#14382c] text-sm">#{idx + 1} {attr.name}</span>
                  </div>
                  <button
                    onClick={() => handleRemoveAttraction(attr.id)}
                    className="text-red-500 hover:text-red-700 p-1 flex items-center gap-1 text-[11px]"
                    title="Remove attraction"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Delete</span>
                  </button>
                </div>

                {/* Attraction Image Upload */}
                <ImageUploadField
                  label={`Photo for ${attr.name}`}
                  value={attr.image || ''}
                  onChange={newUrl => {
                    const next = [...formData.attractions];
                    next[idx] = { ...next[idx], image: newUrl };
                    setFormData({ ...formData, attractions: next });
                  }}
                  hint="Visual preview card displayed in the Explore & Map tab."
                  aspectRatio="video"
                  presets={resortPresets}
                  placeholderText="Upload attraction photo"
                />

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1">
                  <div className="space-y-1 sm:col-span-2">
                    <label className="font-semibold text-slate-700">Attraction Name</label>
                    <input
                      type="text"
                      value={attr.name}
                      onChange={e => {
                        const next = [...formData.attractions];
                        next[idx] = { ...next[idx], name: e.target.value };
                        setFormData({ ...formData, attractions: next });
                      }}
                      className="w-full p-2 rounded-xl border border-slate-300 bg-white"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-semibold text-slate-700">Category</label>
                    <select
                      value={attr.category}
                      onChange={e => {
                        const next = [...formData.attractions];
                        next[idx] = { ...next[idx], category: e.target.value as any };
                        setFormData({ ...formData, attractions: next });
                      }}
                      className="w-full p-2 rounded-xl border border-slate-300 bg-white"
                    >
                      <option value="racing">Golf & Racing</option>
                      <option value="dining">Dining & Pubs</option>
                      <option value="historic">Historic Castles</option>
                      <option value="nature">Scenic Nature</option>
                      <option value="transport">Transport</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="font-semibold text-slate-700">Travel Time</label>
                    <input
                      type="text"
                      value={attr.travelTime}
                      onChange={e => {
                        const next = [...formData.attractions];
                        next[idx] = { ...next[idx], travelTime: e.target.value };
                        setFormData({ ...formData, attractions: next });
                      }}
                      className="w-full p-2 rounded-xl border border-slate-300 bg-white"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-semibold text-slate-700">Distance</label>
                    <input
                      type="text"
                      value={attr.distanceKm}
                      onChange={e => {
                        const next = [...formData.attractions];
                        next[idx] = { ...next[idx], distanceKm: e.target.value };
                        setFormData({ ...formData, attractions: next });
                      }}
                      className="w-full p-2 rounded-xl border border-slate-300 bg-white"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-semibold text-slate-700">Google Maps / Directions Link</label>
                    <input
                      type="text"
                      value={attr.mapsUrl}
                      onChange={e => {
                        const next = [...formData.attractions];
                        next[idx] = { ...next[idx], mapsUrl: e.target.value };
                        setFormData({ ...formData, attractions: next });
                      }}
                      className="w-full p-2 rounded-xl border border-slate-300 font-mono text-[11px] bg-white"
                    />
                  </div>

                  <div className="space-y-1 sm:col-span-3">
                    <label className="font-semibold text-slate-700">Description</label>
                    <input
                      type="text"
                      value={attr.description}
                      onChange={e => {
                        const next = [...formData.attractions];
                        next[idx] = { ...next[idx], description: e.target.value };
                        setFormData({ ...formData, attractions: next });
                      }}
                      className="w-full p-2 rounded-xl border border-slate-300 bg-white"
                    />
                  </div>

                  <div className="space-y-1 sm:col-span-3">
                    <label className="font-semibold text-slate-700">Insider Tip for Guests</label>
                    <input
                      type="text"
                      value={attr.insiderTip}
                      onChange={e => {
                        const next = [...formData.attractions];
                        next[idx] = { ...next[idx], insiderTip: e.target.value };
                        setFormData({ ...formData, attractions: next });
                      }}
                      className="w-full p-2 rounded-xl border border-slate-300 text-amber-900 bg-white"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* Tab 7: Wi-Fi Credentials & QR */}
      {/* ========================================================= */}
      {activeHostTab === 'wifi' && (
        <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200 shadow-xs space-y-4">
          <h3 className="font-serif text-lg font-bold text-[#14382c] border-b border-slate-100 pb-2">
            Guest Wi-Fi & QR Auto-Connect Setup
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="font-semibold text-slate-700">Network Name (SSID)</label>
                <input
                  type="text"
                  value={formData.wifi.ssid}
                  onChange={e => setFormData({
                    ...formData,
                    wifi: { ...formData.wifi, ssid: e.target.value }
                  })}
                  className="w-full p-2.5 rounded-xl border border-slate-300 font-semibold text-slate-900 focus:border-[#14382c] focus:outline-hidden"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-700">Wi-Fi Password</label>
                <input
                  type="text"
                  value={formData.wifi.password}
                  onChange={e => setFormData({
                    ...formData,
                    wifi: { ...formData.wifi, password: e.target.value }
                  })}
                  className="w-full p-2.5 rounded-xl border border-slate-300 font-mono font-bold text-slate-900 focus:border-[#14382c] focus:outline-hidden"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-700">Security Encryption</label>
                <select
                  value={formData.wifi.security}
                  onChange={e => setFormData({
                    ...formData,
                    wifi: { ...formData.wifi, security: e.target.value as 'WPA' | 'WEP' | 'nopass' }
                  })}
                  className="w-full p-2.5 rounded-xl border border-slate-300 text-xs focus:border-[#14382c] focus:outline-hidden"
                >
                  <option value="WPA">WPA / WPA2 / WPA3 (Standard)</option>
                  <option value="WEP">WEP (Legacy)</option>
                  <option value="nopass">None (Open Network)</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-700">Network Notes for Guests</label>
                <textarea
                  rows={3}
                  value={formData.wifi.notes}
                  onChange={e => setFormData({
                    ...formData,
                    wifi: { ...formData.wifi, notes: e.target.value }
                  })}
                  className="w-full p-2.5 rounded-xl border border-slate-300 text-xs focus:border-[#14382c] focus:outline-hidden"
                />
              </div>
            </div>

            {/* Live QR Preview */}
            <div className="bg-[#f8f6f0] p-5 rounded-2xl border border-[#c5a059]/25 flex flex-col items-center justify-center text-center">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#14382c] mb-2">
                Live Wi-Fi QR Preview
              </span>
              {wifiPreviewQr ? (
                <img src={wifiPreviewQr} alt="QR Preview" className="w-40 h-40 bg-white p-2 rounded-xl shadow-xs" />
              ) : (
                <div className="w-40 h-40 bg-slate-100 rounded-xl" />
              )}
              <span className="text-[11px] text-slate-500 mt-2">
                Scanning connects phones instantly without typing
              </span>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* Tab 8: Print & Standee Studio */}
      {/* ========================================================= */}
      {activeHostTab === 'standee' && (
        <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <div>
              <h3 className="font-serif text-lg font-bold text-[#14382c]">
                QR Standee & Table Tent Card Studio
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Configure your printable guestroom standee card with custom logos and welcome messages.
              </p>
            </div>
            <button
              onClick={() => setActiveModal('standee')}
              className="px-3.5 py-2 bg-[#14382c] text-white rounded-xl text-xs font-semibold hover:bg-[#1c4a3a] flex items-center gap-1.5 shadow-xs"
            >
              <Printer className="w-3.5 h-3.5 text-[#c5a059]" />
              <span>Open Print Dialog</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="space-y-1">
              <label className="font-semibold text-slate-700">Standee Main Title</label>
              <input
                type="text"
                value={formData.standee.title}
                onChange={e => setFormData({
                  ...formData,
                  standee: { ...formData.standee, title: e.target.value }
                })}
                className="w-full p-2.5 rounded-xl border border-slate-300 text-xs"
              />
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-slate-700">Standee Subtitle</label>
              <input
                type="text"
                value={formData.standee.subtitle}
                onChange={e => setFormData({
                  ...formData,
                  standee: { ...formData.standee, subtitle: e.target.value }
                })}
                className="w-full p-2.5 rounded-xl border border-slate-300 text-xs"
              />
            </div>

            <div className="space-y-1 sm:col-span-2">
              <label className="font-semibold text-slate-700">Standee Welcome Message</label>
              <textarea
                rows={3}
                value={formData.standee.welcomeMessage}
                onChange={e => setFormData({
                  ...formData,
                  standee: { ...formData.standee, welcomeMessage: e.target.value }
                })}
                className="w-full p-2.5 rounded-xl border border-slate-300 text-xs"
              />
            </div>

            <div className="space-y-1 sm:col-span-2">
              <label className="font-semibold text-slate-700">Custom Target Guidebook URL (Optional, defaults to this site)</label>
              <input
                type="text"
                placeholder="Leave blank to use current URL..."
                value={formData.standee.customUrl}
                onChange={e => setFormData({
                  ...formData,
                  standee: { ...formData.standee, customUrl: e.target.value }
                })}
                className="w-full p-2.5 rounded-xl border border-slate-300 text-xs font-mono"
              />
            </div>
          </div>
        </div>
      )}

      {/* Floating Save Actions Bar */}
      <div className="sticky bottom-4 z-20 bg-white/95 backdrop-blur-md p-3.5 rounded-2xl border border-slate-300 shadow-xl flex items-center justify-between gap-3">
        <button
          onClick={resetToDefaults}
          className="px-3.5 py-2 rounded-xl text-xs font-semibold text-red-700 hover:bg-red-50 transition-colors flex items-center gap-1.5"
          title="Restore factory default content"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset Defaults</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setAppMode('guest')}
            className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-100 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={isSaving}
            className={`px-5 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 transition-all shadow-md active:scale-98 ${
              isSaved
                ? 'bg-emerald-700 text-white'
                : isSaving
                ? 'bg-amber-700 text-white opacity-90'
                : 'bg-[#14382c] hover:bg-[#1c4a3a] text-white'
            }`}
          >
            {isSaved ? (
              <>
                <Check className="w-4 h-4" />
                <span>Broadcasted to Firestore!</span>
              </>
            ) : isSaving ? (
              <>
                <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Broadcasting to Estate...</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4 text-[#c5a059]" />
                <span>Save & Broadcast to Estate</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
