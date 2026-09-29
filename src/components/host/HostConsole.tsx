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
  Flag,
  BookOpen,
  Image as ImageIcon
} from 'lucide-react';
import { useHotel } from '../../context/HotelContext';
import { Attraction, DiningItem, GuideSection } from '../../types/guidebook';
import { generateQrDataUrl, buildWifiQrString } from '../../utils/qrCode';
import { ImageUploadField } from './ImageUploadField';

const resortPresets = [
  { label: 'Resort Exterior', url: '/src/assets/images/ballykisteen_resort_hero_1790677395754.jpg' },
  { label: 'Junction One Restaurant', url: '/src/assets/images/junction_one_dining_1790677408670.jpg' },
  { label: 'Indoor Heated Pool', url: '/src/assets/images/leisure_pool_spa_1790677420010.jpg' },
  { label: 'Championship Golf', url: '/src/assets/images/championship_golf_course_1790677430157.jpg' },
];

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

  const [activeHostTab, setActiveHostTab] = useState<'property' | 'sections' | 'schedules' | 'attractions' | 'wifi' | 'standee'>('property');
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
              Update resort photos, logos, section banners, Wi-Fi credentials & print standees in real time.
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
          { id: 'property', label: 'Property & Logo', icon: Building2 },
          { id: 'sections', label: 'Guidebook Sections & Photos', icon: BookOpen },
          { id: 'schedules', label: 'Dining, Leisure & Golf', icon: Clock },
          { id: 'attractions', label: 'Local Attractions & Photos', icon: MapPin },
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

      {/* Tab 1: Property & Logo */}
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
              Resort Contacts & Information
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

      {/* Tab 2: Guidebook Sections & Photos */}
      {activeHostTab === 'sections' && (
        <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200 shadow-xs space-y-6">
          <div>
            <h3 className="font-serif text-lg font-bold text-[#14382c]">
              Guidebook Sections & Banner Images
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Customize photos and titles for every category in the resident guidebook. When a guest expands a category, the banner image is displayed.
            </p>
          </div>

          <div className="space-y-5">
            {formData.guideSections.map((section, idx) => (
              <div
                key={section.id}
                className="p-4 sm:p-5 rounded-2xl border border-slate-200 bg-[#f8f6f0]/50 space-y-4"
              >
                <div className="flex items-center justify-between gap-2 border-b border-slate-200 pb-2.5">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-[#14382c] text-sm">
                      {idx + 1}. {section.title}
                    </span>
                    {section.badge && (
                      <span className="text-[10px] bg-[#14382c]/10 text-[#14382c] px-2 py-0.5 rounded-full font-semibold">
                        {section.badge}
                      </span>
                    )}
                  </div>
                  <span className="text-[11px] text-slate-500">
                    {section.items.length} guidelines
                  </span>
                </div>

                {/* Section Banner Image Upload */}
                <ImageUploadField
                  label={`Banner Image for "${section.title}"`}
                  value={section.image || ''}
                  onChange={newUrl => {
                    const next = [...formData.guideSections];
                    next[idx] = { ...next[idx], image: newUrl };
                    setFormData({ ...formData, guideSections: next });
                  }}
                  hint="High-resolution photo displayed at the top when this section is opened."
                  aspectRatio="video"
                  presets={resortPresets}
                  placeholderText={`Add image for ${section.title}`}
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs pt-1">
                  <div className="space-y-1">
                    <label className="font-semibold text-slate-700">Category Display Title</label>
                    <input
                      type="text"
                      value={section.title}
                      onChange={e => {
                        const next = [...formData.guideSections];
                        next[idx] = { ...next[idx], title: e.target.value };
                        setFormData({ ...formData, guideSections: next });
                      }}
                      className="w-full p-2 rounded-xl border border-slate-300 bg-white"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-semibold text-slate-700">Badge Label (Optional)</label>
                    <input
                      type="text"
                      value={section.badge || ''}
                      onChange={e => {
                        const next = [...formData.guideSections];
                        next[idx] = { ...next[idx], badge: e.target.value };
                        setFormData({ ...formData, guideSections: next });
                      }}
                      placeholder="e.g. Essential, Des Smyth Design"
                      className="w-full p-2 rounded-xl border border-slate-300 bg-white"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: Dining, Leisure & Golf Schedules */}
      {activeHostTab === 'schedules' && (
        <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200 shadow-xs space-y-6">
          <div>
            <h3 className="font-serif text-lg font-bold text-[#14382c]">
              Resort Amenities & Photos
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Upload photos for the Junction One restaurant, indoor pool/spa, and championship golf course, and update daily schedules.
            </p>
          </div>

          {/* Amenity Photos Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 rounded-2xl bg-[#f8f6f0]/70 border border-[#c5a059]/20">
            {/* Dining Image */}
            <ImageUploadField
              label="Junction One Dining Photo"
              value={formData.diningImage}
              onChange={newUrl => setFormData({ ...formData, diningImage: newUrl })}
              aspectRatio="video"
              presets={resortPresets}
              placeholderText="Restaurant photo"
            />

            {/* Leisure Image */}
            <ImageUploadField
              label="Pool & Spa Leisure Photo"
              value={formData.leisureImage}
              onChange={newUrl => setFormData({ ...formData, leisureImage: newUrl })}
              aspectRatio="video"
              presets={resortPresets}
              placeholderText="Pool & Spa photo"
            />

            {/* Golf Image */}
            <ImageUploadField
              label="Championship Golf Photo"
              value={formData.golfImage}
              onChange={newUrl => setFormData({ ...formData, golfImage: newUrl })}
              aspectRatio="video"
              presets={resortPresets}
              placeholderText="Golf course photo"
            />
          </div>

          <div className="space-y-3 pt-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#14382c]">
              Today's Resort Bulletin & Weather
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
              Leisure Club Timetables
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

      {/* Tab 4: Local Recommendations & Photos */}
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
              className="px-3 py-1.5 bg-[#14382c] text-white rounded-xl text-xs font-semibold hover:bg-[#1c4a3a] flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
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
                    <label className="font-semibold text-slate-700">Google Maps URL</label>
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

      {/* Tab 5: Wi-Fi & Credentials */}
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

      {/* Tab 6: Print & Standee Studio */}
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
