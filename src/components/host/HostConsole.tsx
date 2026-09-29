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
  Unlock, 
  Lock,
  ArrowLeft,
  Sparkles,
  Utensils,
  Waves,
  Sun,
  Flag
} from 'lucide-react';
import { useHotel } from '../../context/HotelContext';
import { Attraction, DiningItem } from '../../types/guidebook';
import { generateQrDataUrl, buildWifiQrString } from '../../utils/qrCode';

export const HostConsole: React.FC = () => {
  const { 
    hotelData, 
    updateHotelData, 
    resetToDefaults, 
    setAppMode, 
    logoutHost, 
    showToast,
    setActiveModal 
  } = useHotel();

  const [activeHostTab, setActiveHostTab] = useState<'property' | 'wifi' | 'schedules' | 'attractions' | 'standee'>('property');
  const [wifiPreviewQr, setWifiPreviewQr] = useState<string>('');

  // Editable local state copies for pristine form management
  const [formData, setFormData] = useState(hotelData);
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    setFormData(hotelData);
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

  const handleSave = () => {
    updateHotelData(formData);
    setIsSaved(true);
    showToast('Changes saved to Guidebook database');
    setTimeout(() => setIsSaved(false), 2000);
  };

  const handleAddAttraction = () => {
    const newAttraction: Attraction = {
      id: `attr-${Date.now()}`,
      name: 'New Tipperary Point of Interest',
      category: 'historic',
      distanceKm: '5 km',
      travelTime: '8 min drive',
      description: 'Describe this scenic location or local highlight...',
      insiderTip: 'Tip for hotel guests...',
      mapsUrl: 'https://www.google.com/maps',
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
    <div className="space-y-6 pb-12 text-slate-800 max-w-4xl mx-auto px-2 sm:px-4">
      {/* Host Bar */}
      <div className="bg-[#14382c] text-white p-5 rounded-3xl flex flex-wrap items-center justify-between gap-4 shadow-lg">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-[#c5a059]/20 flex items-center justify-center text-[#c5a059]">
            <Building2 className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-serif text-xl font-bold text-white">
                Host Management Console
              </h2>
              <span className="text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded-full font-semibold">
                Admin Session Active
              </span>
            </div>
            <p className="text-xs text-white/70">
              Update resort content, Wi-Fi credentials, dining schedules & print standees in real time.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setAppMode('guest')}
            className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            <Eye className="w-4 h-4 text-[#c5a059]" />
            <span>Preview as Guest</span>
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
          { id: 'property', label: 'Property & Branding', icon: Building2 },
          { id: 'wifi', label: 'Wi-Fi & Credentials', icon: Wifi },
          { id: 'schedules', label: 'Dining & Leisure', icon: Clock },
          { id: 'attractions', label: 'Local Attractions', icon: MapPin },
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

      {/* Tab 1: Property & Branding */}
      {activeHostTab === 'property' && (
        <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200 shadow-xs space-y-4">
          <h3 className="font-serif text-lg font-bold text-[#14382c] border-b border-slate-100 pb-2">
            Resort Brand Identity & Contacts
          </h3>

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
      )}

      {/* Tab 2: Wi-Fi & Credentials */}
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

      {/* Tab 3: Schedules & Bulletin */}
      {activeHostTab === 'schedules' && (
        <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200 shadow-xs space-y-5">
          <h3 className="font-serif text-lg font-bold text-[#14382c] border-b border-slate-100 pb-2">
            Today's Resort Bulletin & Timetables
          </h3>

          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#14382c]">
              Resort Bulletin
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="space-y-1">
                <label className="font-semibold text-slate-700">Temperature & Weather</label>
                <input
                  type="text"
                  value={formData.bulletin.weatherTemp}
                  onChange={e => setFormData({
                    ...formData,
                    bulletin: { ...formData.bulletin, weatherTemp: e.target.value }
                  })}
                  className="w-full p-2 rounded-xl border border-slate-300 text-xs"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-700">Weather Condition Description</label>
                <input
                  type="text"
                  value={formData.bulletin.weatherCondition}
                  onChange={e => setFormData({
                    ...formData,
                    bulletin: { ...formData.bulletin, weatherCondition: e.target.value }
                  })}
                  className="w-full p-2 rounded-xl border border-slate-300 text-xs"
                />
              </div>

              <div className="space-y-1 sm:col-span-2">
                <label className="font-semibold text-slate-700">Golf Course Daily Status</label>
                <input
                  type="text"
                  value={formData.bulletin.golfCourseStatus}
                  onChange={e => setFormData({
                    ...formData,
                    bulletin: { ...formData.bulletin, golfCourseStatus: e.target.value }
                  })}
                  className="w-full p-2 rounded-xl border border-slate-300 text-xs"
                />
              </div>

              <div className="space-y-1 sm:col-span-2">
                <label className="font-semibold text-slate-700">Chef's Today Special (Junction One)</label>
                <input
                  type="text"
                  value={formData.bulletin.todaysSpecial}
                  onChange={e => setFormData({
                    ...formData,
                    bulletin: { ...formData.bulletin, todaysSpecial: e.target.value }
                  })}
                  className="w-full p-2 rounded-xl border border-slate-300 text-xs"
                />
              </div>
            </div>
          </div>

          <div className="space-y-3 pt-3 border-t border-slate-100">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#14382c]">
              Leisure Club Hours
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
                  className="w-full p-2 rounded-xl border border-slate-300 text-xs"
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
                  className="w-full p-2 rounded-xl border border-slate-300 text-xs"
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
                  className="w-full p-2 rounded-xl border border-slate-300 text-xs"
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
                  className="w-full p-2 rounded-xl border border-slate-300 text-xs"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: Local Recommendations Editor */}
      {activeHostTab === 'attractions' && (
        <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <h3 className="font-serif text-lg font-bold text-[#14382c]">
              Local Tipperary Attractions ({formData.attractions.length})
            </h3>
            <button
              onClick={handleAddAttraction}
              className="px-3 py-1.5 bg-[#14382c] text-white rounded-xl text-xs font-semibold hover:bg-[#1c4a3a] flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Attraction</span>
            </button>
          </div>

          <div className="space-y-4">
            {formData.attractions.map((attr, idx) => (
              <div key={attr.id} className="p-4 rounded-2xl border border-slate-200 bg-[#f8f6f0]/50 space-y-3 text-xs">
                <div className="flex items-center justify-between gap-2">
                  <span className="font-bold text-slate-400">#{idx + 1}</span>
                  <button
                    onClick={() => handleRemoveAttraction(attr.id)}
                    className="text-red-500 hover:text-red-700 p-1"
                    title="Remove attraction"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
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
                      className="w-full p-2 rounded-xl border border-slate-300"
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
                      className="w-full p-2 rounded-xl border border-slate-300"
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
                      className="w-full p-2 rounded-xl border border-slate-300"
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
                      className="w-full p-2 rounded-xl border border-slate-300"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-semibold text-slate-700">Google Maps URL</label>
                    <input
                      type="text"
                      value={attr.mapsUrl}
                      onChange={e => {
                        const next = [...formData.attractions];
                        next[idx] = { ...next[idx], mapsUrl: e.target.value };
                        setFormData({ ...formData, attractions: next });
                      }}
                      className="w-full p-2 rounded-xl border border-slate-300 font-mono text-[11px]"
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
                      className="w-full p-2 rounded-xl border border-slate-300"
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
                      className="w-full p-2 rounded-xl border border-slate-300 text-amber-900"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 5: Print & Standee Studio */}
      {activeHostTab === 'standee' && (
        <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <h3 className="font-serif text-lg font-bold text-[#14382c]">
              QR Standee & Table Tent Card Studio
            </h3>
            <button
              onClick={() => setActiveModal('standee')}
              className="px-3.5 py-2 bg-[#14382c] text-white rounded-xl text-xs font-semibold hover:bg-[#1c4a3a] flex items-center gap-1.5"
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
      <div className="sticky bottom-4 z-20 bg-white/90 backdrop-blur-md p-3.5 rounded-2xl border border-slate-300 shadow-xl flex items-center justify-between gap-3">
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
            className={`px-5 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 transition-all shadow-md active:scale-98 ${
              isSaved
                ? 'bg-emerald-700 text-white'
                : 'bg-[#14382c] hover:bg-[#1c4a3a] text-white'
            }`}
          >
            {isSaved ? (
              <>
                <Check className="w-4 h-4" />
                <span>Saved & Synced!</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4 text-[#c5a059]" />
                <span>Save All Changes</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
