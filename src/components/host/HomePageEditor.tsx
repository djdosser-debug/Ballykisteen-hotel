import React, { useState } from 'react';
import { 
  Sparkles, 
  ArrowUp, 
  ArrowDown, 
  Plus, 
  Trash2, 
  Eye, 
  EyeOff, 
  Wifi, 
  KeyRound, 
  Utensils, 
  Waves, 
  Phone, 
  Sun, 
  Flag, 
  Star, 
  MapPin, 
  Clock, 
  Coffee, 
  Info, 
  Car, 
  Tv, 
  ShieldAlert, 
  Heart, 
  Award, 
  BedDouble, 
  BookOpen, 
  Calendar, 
  HelpCircle, 
  ExternalLink, 
  MessageSquare, 
  Bell, 
  ChevronRight, 
  Building2, 
  RotateCcw,
  Check
} from 'lucide-react';
import { HotelData, QuickActionItem, HomeHighlightCard, HomeConfig } from '../../types/guidebook';
import { defaultQuickActions, defaultHomeConfig } from '../../data/initialData';
import { ImageUploadField } from './ImageUploadField';

const AVAILABLE_ACTION_ICONS: { name: string; label: string; icon: React.ElementType }[] = [
  { name: 'Wifi', label: 'Wi-Fi / Internet', icon: Wifi },
  { name: 'KeyRound', label: 'Key / Access', icon: KeyRound },
  { name: 'Utensils', label: 'Dining & Food', icon: Utensils },
  { name: 'Waves', label: 'Pool & Spa', icon: Waves },
  { name: 'Phone', label: 'Reception / Call', icon: Phone },
  { name: 'Coffee', label: 'Breakfast / Café', icon: Coffee },
  { name: 'Flag', label: 'Golf & Course', icon: Flag },
  { name: 'Sparkles', label: 'Luxury & Special', icon: Sparkles },
  { name: 'Car', label: 'Taxi & Transport', icon: Car },
  { name: 'Clock', label: 'Hours & Times', icon: Clock },
  { name: 'Heart', label: 'Wellness & Care', icon: Heart },
  { name: 'BedDouble', label: 'Room Service & Bed', icon: BedDouble },
  { name: 'BookOpen', label: 'Full Guidebook', icon: BookOpen },
  { name: 'MapPin', label: 'Directions & Map', icon: MapPin },
  { name: 'Calendar', label: 'Events & Booking', icon: Calendar },
  { name: 'MessageSquare', label: 'Concierge Chat', icon: MessageSquare },
  { name: 'Bell', label: 'Duty Manager / Alert', icon: Bell },
  { name: 'HelpCircle', label: 'Assistance & FAQ', icon: HelpCircle },
  { name: 'ExternalLink', label: 'Web Link', icon: ExternalLink },
  { name: 'Info', label: 'Information', icon: Info },
  { name: 'Award', label: 'Awards & Quality', icon: Award },
];

const COLOR_THEMES: { id: QuickActionItem['bgColor']; label: string; previewClass: string }[] = [
  { id: 'emerald', label: 'Emerald Green', previewClass: 'bg-emerald-600 text-white' },
  { id: 'amber', label: 'Warm Amber', previewClass: 'bg-amber-600 text-white' },
  { id: 'orange', label: 'Vibrant Orange', previewClass: 'bg-orange-600 text-white' },
  { id: 'teal', label: 'Aqua Teal', previewClass: 'bg-teal-600 text-white' },
  { id: 'primary', label: 'Forest Green (GN Brand)', previewClass: 'bg-[#14382c] text-[#c5a059]' },
  { id: 'blue', label: 'Ocean Blue', previewClass: 'bg-blue-600 text-white' },
  { id: 'purple', label: 'Royal Purple', previewClass: 'bg-purple-600 text-white' },
  { id: 'rose', label: 'Rose Pink', previewClass: 'bg-rose-600 text-white' },
];

const resortPresets = [
  { label: 'Resort Exterior', url: '/images/ballykisteen_resort_hero_1790677395754.jpg' },
  { label: 'Junction One Restaurant', url: '/images/junction_one_dining_1790677408670.jpg' },
  { label: 'Indoor Heated Pool', url: '/images/leisure_pool_spa_1790677420010.jpg' },
  { label: 'Championship Golf', url: '/images/championship_golf_course_1790677430157.jpg' },
];

interface HomePageEditorProps {
  formData: HotelData;
  setFormData: React.Dispatch<React.SetStateAction<HotelData>>;
  handleUpdateImage: (field: 'heroImage' | 'logoImage' | 'diningImage' | 'leisureImage' | 'golfImage', newUrl: string) => Promise<void>;
  showToast: (msg: string) => void;
  isDirtyRef: React.MutableRefObject<boolean>;
  updateHotelData: (updater: Partial<HotelData> | ((prev: HotelData) => HotelData)) => Promise<void>;
}

export const HomePageEditor: React.FC<HomePageEditorProps> = ({
  formData,
  setFormData,
  handleUpdateImage,
  showToast,
  isDirtyRef,
  updateHotelData,
}) => {
  const [activeSubSection, setActiveSubSection] = useState<'quickActions' | 'hero' | 'bulletin' | 'highlights' | 'reviews'>('quickActions');
  const [editingActionId, setEditingActionId] = useState<string | null>(null);
  const [editingHighlightId, setEditingHighlightId] = useState<string | null>(null);

  const quickActions = formData.quickActions || defaultQuickActions;
  const homeConfig = formData.homeConfig || defaultHomeConfig;

  // -------------------------------------------------------------
  // Quick Actions Operations: Swap, Edit, Add, Delete, Toggle
  // -------------------------------------------------------------
  const handleSwapQuickActions = (index: number, direction: 'up' | 'down') => {
    isDirtyRef.current = true;
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= quickActions.length) return;

    const updated = [...quickActions];
    const temp = updated[index];
    updated[index] = updated[targetIndex];
    updated[targetIndex] = temp;

    setFormData(prev => ({ ...prev, quickActions: updated }));
    updateHotelData({ quickActions: updated }).catch(console.error);
    showToast(`Quick action swapped ${direction}! Broadcasted live.`);
  };

  const handleUpdateQuickAction = (id: string, updates: Partial<QuickActionItem>) => {
    isDirtyRef.current = true;
    const updated = quickActions.map(qa => (qa.id === id ? { ...qa, ...updates } : qa));
    setFormData(prev => ({ ...prev, quickActions: updated }));
  };

  const handleToggleQuickAction = (id: string) => {
    isDirtyRef.current = true;
    const updated = quickActions.map(qa => 
      qa.id === id ? { ...qa, enabled: qa.enabled === false ? true : false } : qa
    );
    setFormData(prev => ({ ...prev, quickActions: updated }));
    updateHotelData({ quickActions: updated }).catch(console.error);
    showToast('Action visibility updated.');
  };

  const handleDeleteQuickAction = (id: string) => {
    isDirtyRef.current = true;
    const updated = quickActions.filter(qa => qa.id !== id);
    setFormData(prev => ({ ...prev, quickActions: updated }));
    updateHotelData({ quickActions: updated }).catch(console.error);
    showToast('Quick action removed.');
    if (editingActionId === id) setEditingActionId(null);
  };

  const handleAddQuickAction = (template?: Partial<QuickActionItem>) => {
    isDirtyRef.current = true;
    const newAction: QuickActionItem = {
      id: `qa-${Date.now()}`,
      title: template?.title || 'New Quick Action',
      subtitle: template?.subtitle || 'Tap for details',
      iconName: template?.iconName || 'Sparkles',
      actionType: template?.actionType || 'modal',
      actionPayload: template?.actionPayload || 'wifi',
      bgColor: template?.bgColor || 'emerald',
      isFullWidth: template?.isFullWidth || false,
      badge: template?.badge || '',
      enabled: true,
    };

    const updated = [...quickActions, newAction];
    setFormData(prev => ({ ...prev, quickActions: updated }));
    updateHotelData({ quickActions: updated }).catch(console.error);
    setEditingActionId(newAction.id);
    showToast('New quick action created! Configure below.');
  };

  const handleResetQuickActions = () => {
    if (window.confirm('Reset quick actions to the default 5 resort buttons?')) {
      isDirtyRef.current = true;
      setFormData(prev => ({ ...prev, quickActions: defaultQuickActions }));
      updateHotelData({ quickActions: defaultQuickActions }).catch(console.error);
      showToast('Quick actions reset to defaults.');
    }
  };

  // -------------------------------------------------------------
  // Highlights Operations: Swap, Edit, Add, Delete, Toggle
  // -------------------------------------------------------------
  const highlights = homeConfig.highlights || defaultHomeConfig.highlights || [];

  const handleSwapHighlights = (index: number, direction: 'up' | 'down') => {
    isDirtyRef.current = true;
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= highlights.length) return;

    const updated = [...highlights];
    const temp = updated[index];
    updated[index] = updated[targetIndex];
    updated[targetIndex] = temp;

    const newHomeConfig = { ...homeConfig, highlights: updated };
    setFormData(prev => ({ ...prev, homeConfig: newHomeConfig }));
    updateHotelData({ homeConfig: newHomeConfig }).catch(console.error);
    showToast(`Highlight swapped ${direction}!`);
  };

  const handleUpdateHighlight = (id: string, updates: Partial<HomeHighlightCard>) => {
    isDirtyRef.current = true;
    const updated = highlights.map(hl => (hl.id === id ? { ...hl, ...updates } : hl));
    const newHomeConfig = { ...homeConfig, highlights: updated };
    setFormData(prev => ({ ...prev, homeConfig: newHomeConfig }));
  };

  const handleAddHighlight = () => {
    isDirtyRef.current = true;
    const newCard: HomeHighlightCard = {
      id: `hl-${Date.now()}`,
      title: 'New Resort Highlight',
      subtitle: 'Featured experience for guests',
      badge: 'Resort Exclusive',
      image: '/images/ballykisteen_resort_hero_1790677395754.jpg',
      actionType: 'tab',
      actionPayload: 'guide',
      actionLabel: 'Explore Details →',
      enabled: true,
    };
    const updated = [...highlights, newCard];
    const newHomeConfig = { ...homeConfig, highlights: updated };
    setFormData(prev => ({ ...prev, homeConfig: newHomeConfig }));
    updateHotelData({ homeConfig: newHomeConfig }).catch(console.error);
    setEditingHighlightId(newCard.id);
    showToast('New highlight card added.');
  };

  const handleDeleteHighlight = (id: string) => {
    isDirtyRef.current = true;
    const updated = highlights.filter(hl => hl.id !== id);
    const newHomeConfig = { ...homeConfig, highlights: updated };
    setFormData(prev => ({ ...prev, homeConfig: newHomeConfig }));
    updateHotelData({ homeConfig: newHomeConfig }).catch(console.error);
    showToast('Highlight card removed.');
  };

  // Helper for homeConfig updates
  const updateHomeConfigField = (updater: Partial<HomeConfig>) => {
    isDirtyRef.current = true;
    const nextConfig: HomeConfig = { ...homeConfig, ...updater };
    setFormData(prev => ({ ...prev, homeConfig: nextConfig }));
  };

  return (
    <div className="space-y-6">
      {/* Sub navigation bar for Home Page Editor */}
      <div className="bg-slate-100 p-1.5 rounded-2xl flex items-center gap-1.5 overflow-x-auto no-scrollbar border border-slate-200">
        <button
          onClick={() => setActiveSubSection('quickActions')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
            activeSubSection === 'quickActions'
              ? 'bg-[#14382c] text-[#c5a059] shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Resort Quick Actions ({quickActions.length})</span>
        </button>

        <button
          onClick={() => setActiveSubSection('hero')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
            activeSubSection === 'hero'
              ? 'bg-[#14382c] text-[#c5a059] shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
          }`}
        >
          <Building2 className="w-3.5 h-3.5" />
          <span>Hero Banner & Header</span>
        </button>

        <button
          onClick={() => setActiveSubSection('bulletin')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
            activeSubSection === 'bulletin'
              ? 'bg-[#14382c] text-[#c5a059] shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
          }`}
        >
          <Sun className="w-3.5 h-3.5" />
          <span>Daily Bulletin & Weather</span>
        </button>

        <button
          onClick={() => setActiveSubSection('highlights')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
            activeSubSection === 'highlights'
              ? 'bg-[#14382c] text-[#c5a059] shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
          }`}
        >
          <Flag className="w-3.5 h-3.5" />
          <span>Promo Highlights ({highlights.length})</span>
        </button>

        <button
          onClick={() => setActiveSubSection('reviews')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
            activeSubSection === 'reviews'
              ? 'bg-[#14382c] text-[#c5a059] shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
          }`}
        >
          <Star className="w-3.5 h-3.5" />
          <span>Reviews & Location Bar</span>
        </button>
      </div>

      {/* ========================================================================= */}
      {/* SUB-SECTION 1: RESORT QUICK ACTIONS (ONE-TAP ACCESS)                      */}
      {/* ========================================================================= */}
      {activeSubSection === 'quickActions' && (
        <div className="space-y-5 animate-in fade-in duration-200">
          <div className="bg-[#f8f6f0] p-4 rounded-2xl border border-[#c5a059]/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="font-serif font-bold text-base text-[#14382c] flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#c5a059]" />
                <span>Resort Quick Actions Management</span>
              </h3>
              <p className="text-xs text-slate-600 mt-0.5">
                Swap order, edit titles/icons/actions, add new one-tap shortcuts, or hide actions. Live on all guest devices.
              </p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={handleResetQuickActions}
                className="px-3 py-1.5 rounded-xl border border-slate-300 hover:bg-slate-100 text-slate-700 text-xs font-medium flex items-center gap-1.5 transition-colors"
                title="Reset to default 5 actions"
              >
                <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
                <span>Reset Defaults</span>
              </button>
              <button
                onClick={() => handleAddQuickAction()}
                className="px-3.5 py-1.5 rounded-xl bg-[#14382c] hover:bg-[#1c4a3a] text-white text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-2xs"
              >
                <Plus className="w-4 h-4 text-[#c5a059]" />
                <span>Add Quick Action</span>
              </button>
            </div>
          </div>

          {/* Quick preset templates */}
          <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-2xs space-y-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block">
              Quick Add From Templates:
            </span>
            <div className="flex flex-wrap gap-2">
              {[
                { title: 'Room Service', subtitle: 'Dial 0 for in-room orders', iconName: 'BedDouble', actionType: 'tel' as const, actionPayload: '+3536233333', bgColor: 'amber' as const, badge: 'Daily' },
                { title: 'Book Spa Treatment', subtitle: 'Facials, thermal & massage', iconName: 'Heart', actionType: 'modal' as const, actionPayload: 'leisure', bgColor: 'teal' as const, badge: 'Spa' },
                { title: 'Golf Pro Shop', subtitle: 'Tee times & club rental', iconName: 'Flag', actionType: 'tel' as const, actionPayload: '+3536232117', bgColor: 'emerald' as const, badge: 'Ext. 117' },
                { title: 'Local Taxi Service', subtitle: 'Tipperary & Junction cabs', iconName: 'Car', actionType: 'tel' as const, actionPayload: '+3536233333', bgColor: 'blue' as const, badge: '24/7' },
                { title: 'Afternoon Tea', subtitle: 'Reserve in Junction One', iconName: 'Coffee', actionType: 'modal' as const, actionPayload: 'dining', bgColor: 'orange' as const, badge: 'Booking' },
                { title: 'Duty Manager Help', subtitle: 'Immediate hotel support', iconName: 'Bell', actionType: 'tel' as const, actionPayload: '+3536233333', bgColor: 'primary' as const, isFullWidth: true, badge: 'Urgent' },
              ].map((template, idx) => (
                <button
                  key={idx}
                  onClick={() => handleAddQuickAction(template)}
                  className="px-2.5 py-1.5 rounded-xl bg-slate-50 hover:bg-[#14382c]/10 hover:border-[#14382c]/30 border border-slate-200 text-xs font-semibold text-slate-700 hover:text-[#14382c] transition-all flex items-center gap-1.5 active:scale-95"
                >
                  <Plus className="w-3.5 h-3.5 text-[#c5a059]" />
                  <span>{template.title}</span>
                </button>
              ))}
            </div>
          </div>

          {/* List of Quick Actions with Swap, Edit, Delete */}
          <div className="space-y-3">
            {quickActions.map((action, index) => {
              const isEditing = editingActionId === action.id;
              const isEnabled = action.enabled !== false;
              const matchedIconObj = AVAILABLE_ACTION_ICONS.find(i => i.name === action.iconName) || AVAILABLE_ACTION_ICONS[0];
              const ActionIcon = matchedIconObj.icon;

              return (
                <div
                  key={action.id}
                  className={`rounded-2xl border transition-all duration-200 overflow-hidden ${
                    !isEnabled
                      ? 'bg-slate-50 border-slate-200 opacity-60'
                      : isEditing
                      ? 'bg-white border-[#14382c] shadow-md ring-1 ring-[#14382c]/20'
                      : 'bg-white border-slate-200 hover:border-slate-300 shadow-2xs'
                  }`}
                >
                  {/* Action Summary Row */}
                  <div className="p-3.5 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      {/* Icon preview */}
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                        action.bgColor === 'amber' ? 'bg-amber-100 text-amber-800' :
                        action.bgColor === 'orange' ? 'bg-orange-100 text-orange-800' :
                        action.bgColor === 'teal' ? 'bg-teal-100 text-teal-800' :
                        action.bgColor === 'primary' ? 'bg-[#14382c] text-[#c5a059]' :
                        action.bgColor === 'blue' ? 'bg-blue-100 text-blue-800' :
                        action.bgColor === 'purple' ? 'bg-purple-100 text-purple-800' :
                        action.bgColor === 'rose' ? 'bg-rose-100 text-rose-800' :
                        'bg-emerald-100 text-emerald-800'
                      }`}>
                        <ActionIcon className="w-5 h-5" />
                      </div>

                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-semibold text-sm text-slate-900 truncate">
                            {action.title || 'Untitled Action'}
                          </span>
                          {action.badge && (
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#14382c]/10 text-[#14382c]">
                              {action.badge}
                            </span>
                          )}
                          {action.isFullWidth && (
                            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
                              Full-Width Banner
                            </span>
                          )}
                          {!isEnabled && (
                            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-red-100 text-red-700">
                              Hidden from guests
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-slate-500 truncate mt-0.5">
                          {action.subtitle || 'No subtitle'} · Target: <span className="font-mono text-[11px] text-slate-700">{action.actionType}: {action.actionPayload}</span>
                        </p>
                      </div>
                    </div>

                    {/* Controls: Swap Up/Down, Visibility, Edit, Delete */}
                    <div className="flex items-center gap-1 shrink-0">
                      {/* Swap Buttons */}
                      <button
                        onClick={() => handleSwapQuickActions(index, 'up')}
                        disabled={index === 0}
                        className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100 disabled:opacity-30 disabled:pointer-events-none transition-colors"
                        title="Swap Up (reorder)"
                      >
                        <ArrowUp className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleSwapQuickActions(index, 'down')}
                        disabled={index === quickActions.length - 1}
                        className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100 disabled:opacity-30 disabled:pointer-events-none transition-colors"
                        title="Swap Down (reorder)"
                      >
                        <ArrowDown className="w-3.5 h-3.5" />
                      </button>

                      {/* Enable/Disable Toggle */}
                      <button
                        onClick={() => handleToggleQuickAction(action.id)}
                        className={`p-1.5 rounded-lg border transition-colors ${
                          isEnabled
                            ? 'border-slate-200 text-slate-600 hover:bg-slate-100'
                            : 'border-red-200 bg-red-50 text-red-600'
                        }`}
                        title={isEnabled ? 'Hide from guests' : 'Show on home screen'}
                      >
                        {isEnabled ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                      </button>

                      {/* Edit Expand Toggle */}
                      <button
                        onClick={() => setEditingActionId(isEditing ? null : action.id)}
                        className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                          isEditing
                            ? 'bg-[#14382c] text-white'
                            : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                        }`}
                      >
                        {isEditing ? 'Close' : 'Edit'}
                      </button>

                      {/* Delete Button */}
                      <button
                        onClick={() => handleDeleteQuickAction(action.id)}
                        className="p-1.5 rounded-lg text-red-600 hover:bg-red-50 transition-colors"
                        title="Delete action"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Inline Edit Form for this Quick Action */}
                  {isEditing && (
                    <div className="p-4 border-t border-slate-100 bg-slate-50/70 space-y-4 animate-in fade-in duration-200">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                        <div>
                          <label className="font-semibold text-slate-700 block mb-1">
                            Action Title
                          </label>
                          <input
                            type="text"
                            value={action.title}
                            onChange={e => handleUpdateQuickAction(action.id, { title: e.target.value })}
                            className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 focus:outline-hidden focus:border-[#14382c]"
                            placeholder="e.g. Wi-Fi Connect"
                          />
                        </div>

                        <div>
                          <label className="font-semibold text-slate-700 block mb-1">
                            Subtitle / Secondary Hint
                          </label>
                          <input
                            type="text"
                            value={action.subtitle}
                            onChange={e => handleUpdateQuickAction(action.id, { subtitle: e.target.value })}
                            className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 focus:outline-hidden focus:border-[#14382c]"
                            placeholder="e.g. 1-tap copy & QR scan"
                          />
                        </div>

                        <div>
                          <label className="font-semibold text-slate-700 block mb-1">
                            Icon Selection
                          </label>
                          <select
                            value={action.iconName}
                            onChange={e => handleUpdateQuickAction(action.id, { iconName: e.target.value })}
                            className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 focus:outline-hidden focus:border-[#14382c]"
                          >
                            {AVAILABLE_ACTION_ICONS.map(i => (
                              <option key={i.name} value={i.name}>
                                {i.label}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label className="font-semibold text-slate-700 block mb-1">
                            Color Accent Theme
                          </label>
                          <select
                            value={action.bgColor || 'emerald'}
                            onChange={e => handleUpdateQuickAction(action.id, { bgColor: e.target.value as any })}
                            className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 focus:outline-hidden focus:border-[#14382c]"
                          >
                            {COLOR_THEMES.map(c => (
                              <option key={c.id} value={c.id}>
                                {c.label}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label className="font-semibold text-slate-700 block mb-1">
                            Action Behavior / Trigger Type
                          </label>
                          <select
                            value={action.actionType}
                            onChange={e => {
                              const newType = e.target.value as QuickActionItem['actionType'];
                              const defaultPayload = 
                                newType === 'modal' ? 'wifi' :
                                newType === 'tel' ? formData.contact.receptionPhone :
                                newType === 'tab' ? 'guide' : 'https://';
                              handleUpdateQuickAction(action.id, { 
                                actionType: newType,
                                actionPayload: defaultPayload 
                              });
                            }}
                            className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 focus:outline-hidden focus:border-[#14382c]"
                          >
                            <option value="modal">Open App Feature Dialog (Modal)</option>
                            <option value="tel">Direct Phone Call (tel:...)</option>
                            <option value="tab">Switch to App Tab (Guidebook, Explore, Info)</option>
                            <option value="link">External Website Link</option>
                          </select>
                        </div>

                        <div>
                          <label className="font-semibold text-slate-700 block mb-1">
                            Action Target / Payload
                          </label>
                          {action.actionType === 'modal' ? (
                            <select
                              value={action.actionPayload}
                              onChange={e => handleUpdateQuickAction(action.id, { actionPayload: e.target.value })}
                              className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 focus:outline-hidden focus:border-[#14382c]"
                            >
                              <option value="wifi">Wi-Fi Connect Dialog</option>
                              <option value="roomKey">Check-in & Room Key Dialog</option>
                              <option value="dining">Junction One Dining & Menus</option>
                              <option value="leisure">Pool, Spa & Leisure Timetable</option>
                            </select>
                          ) : action.actionType === 'tab' ? (
                            <select
                              value={action.actionPayload}
                              onChange={e => handleUpdateQuickAction(action.id, { actionPayload: e.target.value })}
                              className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 focus:outline-hidden focus:border-[#14382c]"
                            >
                              <option value="guide">Guidebook Directory Tab</option>
                              <option value="explore">Tipperary Local Attractions Tab</option>
                              <option value="info">Essential Resort Information Tab</option>
                            </select>
                          ) : (
                            <input
                              type="text"
                              value={action.actionPayload}
                              onChange={e => handleUpdateQuickAction(action.id, { actionPayload: e.target.value })}
                              className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 focus:outline-hidden focus:border-[#14382c]"
                              placeholder={action.actionType === 'tel' ? '+3536233333' : 'https://...'}
                            />
                          )}
                        </div>

                        <div>
                          <label className="font-semibold text-slate-700 block mb-1">
                            Optional Badge / Pill (e.g. "24/7 Ext. 0")
                          </label>
                          <input
                            type="text"
                            value={action.badge || ''}
                            onChange={e => handleUpdateQuickAction(action.id, { badge: e.target.value })}
                            className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 focus:outline-hidden focus:border-[#14382c]"
                            placeholder="Optional badge tag"
                          />
                        </div>

                        <div className="flex items-center gap-4 pt-4">
                          <label className="flex items-center gap-2 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={action.isFullWidth || false}
                              onChange={e => handleUpdateQuickAction(action.id, { isFullWidth: e.target.checked })}
                              className="rounded border-slate-300 text-[#14382c] focus:ring-[#14382c]"
                            />
                            <span className="font-semibold text-slate-700">
                              Full-Width Card (Row Banner)
                            </span>
                          </label>

                          <label className="flex items-center gap-2 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={action.enabled !== false}
                              onChange={e => handleUpdateQuickAction(action.id, { enabled: e.target.checked })}
                              className="rounded border-slate-300 text-[#14382c] focus:ring-[#14382c]"
                            />
                            <span className="font-semibold text-slate-700">
                              Visible to Guests
                            </span>
                          </label>
                        </div>
                      </div>

                      <div className="pt-2 flex justify-end">
                        <button
                          onClick={async () => {
                            try {
                              await updateHotelData({ quickActions });
                              showToast('Quick actions saved & broadcasted!');
                              setEditingActionId(null);
                            } catch (e) {
                              console.error(e);
                            }
                          }}
                          className="px-4 py-2 rounded-xl bg-[#14382c] text-white text-xs font-semibold hover:bg-[#1c4a3a] transition-all flex items-center gap-1.5"
                        >
                          <Check className="w-3.5 h-3.5 text-[#c5a059]" />
                          <span>Save & Broadcast This Action</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SUB-SECTION 2: HERO BANNER & BRAND HEADER                                  */}
      {/* ========================================================================= */}
      {activeSubSection === 'hero' && (
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-5 animate-in fade-in duration-200">
          <div>
            <h3 className="font-serif font-bold text-base text-slate-900 flex items-center gap-2">
              <Building2 className="w-4 h-4 text-[#14382c]" />
              <span>Hero Banner & Header Customization</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Full control over the guest welcome cover, badges, and top notification strip.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="font-semibold text-slate-700 block mb-1">
                Property Headline Name
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={e => {
                  isDirtyRef.current = true;
                  setFormData({ ...formData, name: e.target.value });
                }}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-hidden focus:border-[#14382c]"
              />
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">
                Resort Tagline / Subtitle
              </label>
              <input
                type="text"
                value={formData.tagline}
                onChange={e => {
                  isDirtyRef.current = true;
                  setFormData({ ...formData, tagline: e.target.value });
                }}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-hidden focus:border-[#14382c]"
              />
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">
                Welcome Subtitle (Top of Hero)
              </label>
              <input
                type="text"
                value={homeConfig.welcomeSubtitle || ''}
                onChange={e => updateHomeConfigField({ welcomeSubtitle: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-hidden focus:border-[#14382c]"
                placeholder="e.g. Welcome to Tipperary"
              />
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">
                Star Rating Badge Text
              </label>
              <input
                type="text"
                value={homeConfig.starRatingText || ''}
                onChange={e => updateHomeConfigField({ starRatingText: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-hidden focus:border-[#14382c]"
                placeholder="e.g. 4-Star Resort"
              />
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">
                Check-In Strip Display Note
              </label>
              <input
                type="text"
                value={homeConfig.checkInStripText || ''}
                onChange={e => updateHomeConfigField({ checkInStripText: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-hidden focus:border-[#14382c]"
                placeholder="e.g. Check-in: 3:00 PM"
              />
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">
                Wi-Fi Strip Display Note
              </label>
              <input
                type="text"
                value={homeConfig.wifiStripText || ''}
                onChange={e => updateHomeConfigField({ wifiStripText: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-hidden focus:border-[#14382c]"
                placeholder="e.g. Wi-Fi: Ballykisteen_Guest"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <ImageUploadField
              label="Resort Hero Cover Photo"
              value={formData.heroImage}
              onChange={newUrl => handleUpdateImage('heroImage', newUrl)}
              hint="Primary banner photo displayed at the top of the guest portal."
              aspectRatio="video"
              presets={resortPresets}
              placeholderText="Upload hero photo"
            />

            <ImageUploadField
              label="Property Logo / Crest"
              value={formData.logoImage || ''}
              onChange={newUrl => handleUpdateImage('logoImage', newUrl)}
              hint="Displayed in header bar and atop hero banner."
              aspectRatio="square"
              presets={[{ label: 'Official GN Crest Logo', url: '/ballykisteen_hotel_logo.jpg' }]}
              placeholderText="Upload property logo"
            />
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SUB-SECTION 3: TODAY'S RESORT BULLETIN & WEATHER                           */}
      {/* ========================================================================= */}
      {activeSubSection === 'bulletin' && (
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-5 animate-in fade-in duration-200">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-serif font-bold text-base text-slate-900 flex items-center gap-2">
                <Sun className="w-4 h-4 text-amber-500" />
                <span>Today's Resort Bulletin & Weather</span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Daily briefing shown directly on the guest home screen for morning weather, dining specials & golf conditions.
              </p>
            </div>
            <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 cursor-pointer">
              <input
                type="checkbox"
                checked={homeConfig.bulletinEnabled !== false}
                onChange={e => updateHomeConfigField({ bulletinEnabled: e.target.checked })}
                className="rounded border-slate-300 text-[#14382c] focus:ring-[#14382c]"
              />
              <span>Show Bulletin on Home Page</span>
            </label>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="font-semibold text-slate-700 block mb-1">
                Bulletin Headline
              </label>
              <input
                type="text"
                value={homeConfig.bulletinTitle || "Today's Resort Bulletin"}
                onChange={e => updateHomeConfigField({ bulletinTitle: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-hidden focus:border-[#14382c]"
              />
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">
                Location Badge Subtitle
              </label>
              <input
                type="text"
                value={homeConfig.bulletinLocation || 'Limerick Junction'}
                onChange={e => updateHomeConfigField({ bulletinLocation: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-hidden focus:border-[#14382c]"
              />
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">
                Weather Temperature
              </label>
              <input
                type="text"
                value={formData.bulletin.weatherTemp}
                onChange={e => {
                  isDirtyRef.current = true;
                  setFormData({
                    ...formData,
                    bulletin: { ...formData.bulletin, weatherTemp: e.target.value }
                  });
                }}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-hidden focus:border-[#14382c]"
                placeholder="e.g. 16°C"
              />
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">
                Weather Condition
              </label>
              <input
                type="text"
                value={formData.bulletin.weatherCondition}
                onChange={e => {
                  isDirtyRef.current = true;
                  setFormData({
                    ...formData,
                    bulletin: { ...formData.bulletin, weatherCondition: e.target.value }
                  });
                }}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-hidden focus:border-[#14382c]"
                placeholder="e.g. Crisp Irish Sunshine"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="font-semibold text-slate-700 block mb-1">
                Weather Note / Advice
              </label>
              <input
                type="text"
                value={formData.bulletin.weatherNote}
                onChange={e => {
                  isDirtyRef.current = true;
                  setFormData({
                    ...formData,
                    bulletin: { ...formData.bulletin, weatherNote: e.target.value }
                  });
                }}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-hidden focus:border-[#14382c]"
                placeholder="e.g. Gentle breeze from the Galtee Mountains · Ideal golfing conditions"
              />
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">
                Golf Course Daily Status
              </label>
              <input
                type="text"
                value={formData.bulletin.golfCourseStatus}
                onChange={e => {
                  isDirtyRef.current = true;
                  setFormData({
                    ...formData,
                    bulletin: { ...formData.bulletin, golfCourseStatus: e.target.value }
                  });
                }}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-hidden focus:border-[#14382c]"
                placeholder="e.g. Course Open · Greens fast · Buggies permitted"
              />
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">
                Breakfast Service Status
              </label>
              <input
                type="text"
                value={formData.bulletin.breakfastStatus}
                onChange={e => {
                  isDirtyRef.current = true;
                  setFormData({
                    ...formData,
                    bulletin: { ...formData.bulletin, breakfastStatus: e.target.value }
                  });
                }}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-hidden focus:border-[#14382c]"
                placeholder="e.g. Served in Junction One Restaurant until 10:30 AM"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="font-semibold text-slate-700 block mb-1">
                Chef's Today Special / Culinary Feature
              </label>
              <input
                type="text"
                value={formData.bulletin.todaysSpecial}
                onChange={e => {
                  isDirtyRef.current = true;
                  setFormData({
                    ...formData,
                    bulletin: { ...formData.bulletin, todaysSpecial: e.target.value }
                  });
                }}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-hidden focus:border-[#14382c]"
                placeholder="e.g. Slow-Braised Tipperary Beef Featherblade with creamy colcannon"
              />
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SUB-SECTION 4: PROMO HIGHLIGHT CARDS                                      */}
      {/* ========================================================================= */}
      {activeSubSection === 'highlights' && (
        <div className="space-y-5 animate-in fade-in duration-200">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="font-serif font-bold text-base text-slate-900 flex items-center gap-2">
                  <Flag className="w-4 h-4 text-emerald-700" />
                  <span>Resort Highlights & Promotional Cards</span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Visual promo cards on the home page (Golf, Dining, Spa, Events). Swap, edit photos, or add new promotions.
                </p>
              </div>
              <button
                onClick={handleAddHighlight}
                className="px-3.5 py-1.5 rounded-xl bg-[#14382c] hover:bg-[#1c4a3a] text-white text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-2xs shrink-0"
              >
                <Plus className="w-4 h-4 text-[#c5a059]" />
                <span>Add Highlight Card</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs pt-1">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">
                  Section Header Title
                </label>
                <input
                  type="text"
                  value={homeConfig.highlightsTitle || 'Resort Highlights'}
                  onChange={e => updateHomeConfigField({ highlightsTitle: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-hidden focus:border-[#14382c]"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">
                  Section Link Label
                </label>
                <input
                  type="text"
                  value={homeConfig.highlightsSubtitle || 'Explore all guides →'}
                  onChange={e => updateHomeConfigField({ highlightsSubtitle: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-hidden focus:border-[#14382c]"
                />
              </div>
            </div>
          </div>

          {/* Cards List */}
          <div className="space-y-4">
            {highlights.map((card, index) => {
              const isEditing = editingHighlightId === card.id;

              return (
                <div
                  key={card.id}
                  className={`rounded-2xl border transition-all duration-200 overflow-hidden ${
                    !card.enabled
                      ? 'bg-slate-50 border-slate-200 opacity-60'
                      : isEditing
                      ? 'bg-white border-[#14382c] shadow-md ring-1 ring-[#14382c]/20'
                      : 'bg-white border-slate-200 hover:border-slate-300 shadow-2xs'
                  }`}
                >
                  <div className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-16 h-12 rounded-xl overflow-hidden bg-slate-100 shrink-0 border border-slate-200">
                        <img
                          src={card.image}
                          alt={card.title}
                          className="w-full h-full object-cover"
                          onError={e => {
                            (e.currentTarget as HTMLImageElement).src = '/images/ballykisteen_resort_hero_1790677395754.jpg';
                          }}
                        />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-semibold text-sm text-slate-900 truncate">
                            {card.title}
                          </span>
                          {card.badge && (
                            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[#c5a059]/15 text-[#14382c]">
                              {card.badge}
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-slate-500 truncate mt-0.5">
                          {card.subtitle} · Action: <span className="font-medium text-slate-700">{card.actionLabel}</span>
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0 self-end sm:self-center">
                      <button
                        onClick={() => handleSwapHighlights(index, 'up')}
                        disabled={index === 0}
                        className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100 disabled:opacity-30 disabled:pointer-events-none transition-colors"
                        title="Swap Up"
                      >
                        <ArrowUp className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleSwapHighlights(index, 'down')}
                        disabled={index === highlights.length - 1}
                        className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100 disabled:opacity-30 disabled:pointer-events-none transition-colors"
                        title="Swap Down"
                      >
                        <ArrowDown className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => handleUpdateHighlight(card.id, { enabled: !card.enabled })}
                        className={`p-1.5 rounded-lg border transition-colors ${
                          card.enabled
                            ? 'border-slate-200 text-slate-600 hover:bg-slate-100'
                            : 'border-red-200 bg-red-50 text-red-600'
                        }`}
                        title={card.enabled ? 'Hide card' : 'Show card'}
                      >
                        {card.enabled ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                      </button>

                      <button
                        onClick={() => setEditingHighlightId(isEditing ? null : card.id)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                          isEditing
                            ? 'bg-[#14382c] text-white'
                            : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                        }`}
                      >
                        {isEditing ? 'Close' : 'Edit Card'}
                      </button>

                      <button
                        onClick={() => handleDeleteHighlight(card.id)}
                        className="p-1.5 rounded-lg text-red-600 hover:bg-red-50 transition-colors"
                        title="Delete highlight card"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Edit Panel for this highlight card */}
                  {isEditing && (
                    <div className="p-4 border-t border-slate-100 bg-slate-50/70 space-y-4 animate-in fade-in duration-200">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                        <div>
                          <label className="font-semibold text-slate-700 block mb-1">
                            Card Title
                          </label>
                          <input
                            type="text"
                            value={card.title}
                            onChange={e => handleUpdateHighlight(card.id, { title: e.target.value })}
                            className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 focus:outline-hidden focus:border-[#14382c]"
                          />
                        </div>

                        <div>
                          <label className="font-semibold text-slate-700 block mb-1">
                            Card Subtitle / Description
                          </label>
                          <input
                            type="text"
                            value={card.subtitle}
                            onChange={e => handleUpdateHighlight(card.id, { subtitle: e.target.value })}
                            className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 focus:outline-hidden focus:border-[#14382c]"
                          />
                        </div>

                        <div>
                          <label className="font-semibold text-slate-700 block mb-1">
                            Top Badge Tag
                          </label>
                          <input
                            type="text"
                            value={card.badge}
                            onChange={e => handleUpdateHighlight(card.id, { badge: e.target.value })}
                            className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 focus:outline-hidden focus:border-[#14382c]"
                            placeholder="e.g. Des Smyth Design · 18 Holes"
                          />
                        </div>

                        <div>
                          <label className="font-semibold text-slate-700 block mb-1">
                            Bottom Button Label
                          </label>
                          <input
                            type="text"
                            value={card.actionLabel}
                            onChange={e => handleUpdateHighlight(card.id, { actionLabel: e.target.value })}
                            className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 focus:outline-hidden focus:border-[#14382c]"
                            placeholder="e.g. Book Tee Time →"
                          />
                        </div>

                        <div>
                          <label className="font-semibold text-slate-700 block mb-1">
                            Target Action Type
                          </label>
                          <select
                            value={card.actionType}
                            onChange={e => handleUpdateHighlight(card.id, { actionType: e.target.value as any })}
                            className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 focus:outline-hidden focus:border-[#14382c]"
                          >
                            <option value="tab">Switch Tab (Guidebook, Explore, Info)</option>
                            <option value="modal">Open Modal (Dining, Leisure, Wi-Fi)</option>
                            <option value="link">External Web Link</option>
                          </select>
                        </div>

                        <div>
                          <label className="font-semibold text-slate-700 block mb-1">
                            Action Target Payload
                          </label>
                          {card.actionType === 'tab' ? (
                            <select
                              value={card.actionPayload}
                              onChange={e => handleUpdateHighlight(card.id, { actionPayload: e.target.value })}
                              className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 focus:outline-hidden focus:border-[#14382c]"
                            >
                              <option value="guide">Guidebook Directory Tab</option>
                              <option value="explore">Tipperary Local Attractions</option>
                              <option value="info">Resort Info & Contacts</option>
                            </select>
                          ) : card.actionType === 'modal' ? (
                            <select
                              value={card.actionPayload}
                              onChange={e => handleUpdateHighlight(card.id, { actionPayload: e.target.value })}
                              className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 focus:outline-hidden focus:border-[#14382c]"
                            >
                              <option value="dining">Dining & Menus Modal</option>
                              <option value="leisure">Pool, Spa & Golf Modal</option>
                              <option value="wifi">Wi-Fi Connect Modal</option>
                              <option value="roomKey">Check-in & Room Key Modal</option>
                            </select>
                          ) : (
                            <input
                              type="text"
                              value={card.actionPayload}
                              onChange={e => handleUpdateHighlight(card.id, { actionPayload: e.target.value })}
                              className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 focus:outline-hidden focus:border-[#14382c]"
                              placeholder="https://..."
                            />
                          )}
                        </div>
                      </div>

                      <div className="pt-2">
                        <ImageUploadField
                          label="Highlight Card Photo"
                          value={card.image}
                          onChange={newUrl => handleUpdateHighlight(card.id, { image: newUrl })}
                          aspectRatio="video"
                          presets={resortPresets}
                          placeholderText="Card photo"
                        />
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SUB-SECTION 5: REVIEWS & LOCATION BAR                                     */}
      {/* ========================================================================= */}
      {activeSubSection === 'reviews' && (
        <div className="space-y-5 animate-in fade-in duration-200">
          {/* Review Banner Configuration */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-serif font-bold text-base text-slate-900 flex items-center gap-2">
                  <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                  <span>Google / TripAdvisor Review Callout</span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Guest feedback callout displayed near the bottom of the home screen.
                </p>
              </div>
              <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={homeConfig.reviewCard?.enabled !== false}
                  onChange={e => updateHomeConfigField({
                    reviewCard: {
                      ...homeConfig.reviewCard,
                      enabled: e.target.checked,
                      rating: homeConfig.reviewCard?.rating || '4.5 / 5.0',
                      title: homeConfig.reviewCard?.title || 'Enjoying your stay at Ballykisteen?',
                      subtitle: homeConfig.reviewCard?.subtitle || 'Share your feedback on Google Maps reviews.',
                      buttonText: homeConfig.reviewCard?.buttonText || 'Review Us',
                      reviewUrl: homeConfig.reviewCard?.reviewUrl || 'https://www.google.com/maps/place/Great+National+Ballykisteen+Golf+Hotel/@52.502931,-8.204561,15z'
                    }
                  })}
                  className="rounded border-slate-300 text-[#14382c] focus:ring-[#14382c]"
                />
                <span>Enable Review Banner</span>
              </label>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">
                  Card Headline Title
                </label>
                <input
                  type="text"
                  value={homeConfig.reviewCard?.title || ''}
                  onChange={e => updateHomeConfigField({
                    reviewCard: { ...homeConfig.reviewCard!, title: e.target.value }
                  })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-hidden focus:border-[#14382c]"
                  placeholder="e.g. Enjoying your stay at Ballykisteen?"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">
                  Star Rating Display
                </label>
                <input
                  type="text"
                  value={homeConfig.reviewCard?.rating || ''}
                  onChange={e => updateHomeConfigField({
                    reviewCard: { ...homeConfig.reviewCard!, rating: e.target.value }
                  })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-hidden focus:border-[#14382c]"
                  placeholder="e.g. 4.5 / 5.0"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">
                  Subtext Description
                </label>
                <input
                  type="text"
                  value={homeConfig.reviewCard?.subtitle || ''}
                  onChange={e => updateHomeConfigField({
                    reviewCard: { ...homeConfig.reviewCard!, subtitle: e.target.value }
                  })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-hidden focus:border-[#14382c]"
                  placeholder="e.g. Share your feedback on Google Maps reviews."
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">
                  Review Button Label
                </label>
                <input
                  type="text"
                  value={homeConfig.reviewCard?.buttonText || ''}
                  onChange={e => updateHomeConfigField({
                    reviewCard: { ...homeConfig.reviewCard!, buttonText: e.target.value }
                  })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-hidden focus:border-[#14382c]"
                  placeholder="e.g. Review Us"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="font-semibold text-slate-700 block mb-1">
                  Review Destination Web URL
                </label>
                <input
                  type="url"
                  value={homeConfig.reviewCard?.reviewUrl || ''}
                  onChange={e => updateHomeConfigField({
                    reviewCard: { ...homeConfig.reviewCard!, reviewUrl: e.target.value }
                  })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-hidden focus:border-[#14382c]"
                  placeholder="https://..."
                />
              </div>
            </div>
          </div>

          {/* Location & Address Bar Configuration */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-serif font-bold text-base text-slate-900 flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-[#14382c]" />
                  <span>Property Address & Maps Bar</span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Footer location strip at the base of the home screen.
                </p>
              </div>
              <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={homeConfig.locationBar?.enabled !== false}
                  onChange={e => updateHomeConfigField({
                    locationBar: {
                      ...homeConfig.locationBar,
                      enabled: e.target.checked,
                      eircodeNote: homeConfig.locationBar?.eircodeNote || `Eircode: ${formData.contact.eircode} · N24 Route`,
                      mapsButtonText: homeConfig.locationBar?.mapsButtonText || 'Maps →'
                    }
                  })}
                  className="rounded border-slate-300 text-[#14382c] focus:ring-[#14382c]"
                />
                <span>Show Location Bar</span>
              </label>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">
                  Address Line
                </label>
                <input
                  type="text"
                  value={formData.contact.address}
                  onChange={e => {
                    isDirtyRef.current = true;
                    setFormData({
                      ...formData,
                      contact: { ...formData.contact, address: e.target.value }
                    });
                  }}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-hidden focus:border-[#14382c]"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">
                  Eircode & Route Note
                </label>
                <input
                  type="text"
                  value={homeConfig.locationBar?.eircodeNote || ''}
                  onChange={e => updateHomeConfigField({
                    locationBar: { ...homeConfig.locationBar!, eircodeNote: e.target.value }
                  })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-hidden focus:border-[#14382c]"
                  placeholder="e.g. Eircode: E34 VK12 · N24 Route"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">
                  Maps Button Label
                </label>
                <input
                  type="text"
                  value={homeConfig.locationBar?.mapsButtonText || 'Maps →'}
                  onChange={e => updateHomeConfigField({
                    locationBar: { ...homeConfig.locationBar!, mapsButtonText: e.target.value }
                  })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-hidden focus:border-[#14382c]"
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
