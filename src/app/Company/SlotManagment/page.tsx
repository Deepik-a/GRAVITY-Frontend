"use client";

import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { setSlotConfig, deleteSlotConfig, getSlotConfigs, getCompanyBookings } from "@/services/CompanyService";
import { Plus, Trash2, Calendar, Clock, Save, AlertCircle, Edit2, X } from "lucide-react";

const weekdaysList = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

interface SlotConfig {
  id?: string;
  startDate: string;
  endDate: string;
  startTime: string;
  endTime: string;
  slotDuration: number;
  bufferTime: number;
  weekdays: string[];
  exceptionalDays: string[];
  createdAt?: Date;
  [key: string]: string | number | string[] | Date | undefined;
}

export default function SlotManagement() {
  const [loading, setLoading] = useState(false);
  const [configs, setConfigs] = useState<SlotConfig[]>([]);
  const [, setBookings] = useState<{ date: string }[]>([]);
  const [bookingCounts, setBookingCounts] = useState<Record<string, number>>({});
  const [showModal, setShowModal] = useState(false);
  const [config, setConfig] = useState<SlotConfig>({
    startDate: "",
    endDate: "",
    startTime: "09:00",
    endTime: "17:00",
    slotDuration: 60,
    bufferTime: 10,
    weekdays: [],
    exceptionalDays: [],
  });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newExDate, setNewExDate] = useState("");

  // Validation errors
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Load existing configs and bookings
  useEffect(() => {
    fetchConfigs();
    fetchBookings();
  }, []);

  const fetchConfigs = async () => {
    try {
      const data = await getSlotConfigs();
      setConfigs(data);
    } catch (error) {
      console.error("Failed to fetch configs:", error);
    }
  };

  const fetchBookings = async () => {
    try {
      const data = await getCompanyBookings();
      setBookings(data);
      
      // Calculate counts
      const counts: Record<string, number> = {};
      (data as { date: string }[]).forEach((b: { date: string }) => {
        const dateStr = new Date(b.date).toISOString().split('T')[0];
        counts[dateStr] = (counts[dateStr] || 0) + 1;
      });
      setBookingCounts(counts);
    } catch (error) {
      console.error("Failed to fetch bookings:", error);
    }
  };

  const validateConfig = () => {
    const newErrors: Record<string, string> = {};
    const today = new Date().toISOString().split('T')[0];
    
    // Start date validation
    if (!config.startDate) {
      newErrors.startDate = "Start date is required";
    } else if (config.startDate < today) {
      newErrors.startDate = "Start date must be today or later";
    }
    
    // End date validation
    if (!config.endDate) {
      newErrors.endDate = "End date is required";
    } else if (config.endDate <= config.startDate) {
      newErrors.endDate = "End date must be after start date";
    }
    
    // Time validation
    if (!config.startTime) {
      newErrors.startTime = "Start time is required";
    }
    
    if (!config.endTime) {
      newErrors.endTime = "End time is required";
    } else if (config.startTime && config.endTime <= config.startTime) {
      newErrors.endTime = "End time must be after start time";
    }
    
    // Duration validation
    if (!config.slotDuration || config.slotDuration < 15) {
      newErrors.slotDuration = "Slot duration must be at least 15 minutes";
    }
    
    // Buffer time validation
    if (config.bufferTime < 10) {
      newErrors.bufferTime = "Buffer time must be at least 10 minutes";
    }
    
    // Weekdays validation
    if (config.weekdays.length === 0) {
      newErrors.weekdays = "Select at least one weekday";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleWeekdayToggle = (day: string) => {
    setConfig((prev: SlotConfig) => ({
      ...prev,
      weekdays: prev.weekdays.includes(day)
        ? prev.weekdays.filter((d: string) => d !== day)
        : [...prev.weekdays, day],
    }));
    // Clear error if exists
    if (errors.weekdays) {
      setErrors(prev => ({ ...prev, weekdays: "" }));
    }
  };

  const addExDate = () => {
    if (!newExDate) return;
    
    // Validate date is within range
    if (newExDate < config.startDate || newExDate > config.endDate) {
      toast.error("Exceptional date must be within the date range");
      return;
    }

    // Check booking count
    if (bookingCounts[newExDate] > 5) {
      toast.error(`Cannot set ${formatDate(newExDate)} as holiday: it already has ${bookingCounts[newExDate]} bookings.`);
      return;
    }
    
    if (config.exceptionalDays.includes(newExDate)) {
      toast.warn("Date already added");
      return;
    }
    
    setConfig((prev: SlotConfig) => ({
      ...prev,
      exceptionalDays: [...prev.exceptionalDays, newExDate],
    }));
    setNewExDate("");
  };

  const removeExDate = (date: string) => {
    setConfig((prev: SlotConfig) => ({
      ...prev,
      exceptionalDays: prev.exceptionalDays.filter((d: string) => d !== date),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateConfig()) {
      toast.error("Please fix validation errors");
      return;
    }
    
    setLoading(true);
    try {
      if (editingId) {
        // Update existing config
        await setSlotConfig({ ...config, id: editingId });
        toast.success("Slot configuration updated successfully!");
        setEditingId(null);
      } else {
        // Create new config
        await setSlotConfig({ ...config, createdAt: new Date() });
        toast.success("Slot configuration created successfully!");
      }
      
      // Refresh configs
      await fetchConfigs();
      resetForm();
      setShowModal(false);
    } catch (error: unknown) {
      const err = error as { message?: string };
      toast.error(err.message || "Failed to save configuration");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (config: SlotConfig) => {
    if (!config.id) return;
    
    // Check if any day in the range has > 5 bookings
    const start = new Date(config.startDate);
    const end = new Date(config.endDate);
    
    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
      const dateStr = d.toISOString().split('T')[0];
      if (bookingCounts[dateStr] > 5) {
        toast.error(`Cannot edit: ${formatDate(dateStr)} has more than 5 bookings.`);
        return;
      }
    }
    
    setConfig(config);
    setEditingId(config.id);
    setShowModal(true);
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this rule?")) return;
    
    setLoading(true);
    try {
      await deleteSlotConfig();
      toast.success("Rule deleted successfully");
      await fetchConfigs();
    } catch (error: unknown) {
      const err = error as { message?: string };
      toast.error(err.message || "Failed to delete rule");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setConfig({
      startDate: "",
      endDate: "",
      startTime: "09:00",
      endTime: "17:00",
      slotDuration: 60,
      bufferTime: 10,
      weekdays: [],
      exceptionalDays: [],
    });
    setEditingId(null);
    setErrors({});
  };

  const openCreateModal = () => {
    resetForm();
    setShowModal(true);
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const formatTime = (time: string) => {
    return new Date(`2000-01-01T${time}`).toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  const getMinDate = () => {
    return new Date().toISOString().split('T')[0];
  };

  const getMinEndDate = () => {
    return config.startDate || getMinDate();
  };

  const hasActiveRule = configs.length > 0 && new Date(configs[0].endDate) >= new Date(new Date().setHours(0,0,0,0));

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Slot Management</h1>
          <p className="text-gray-600 mt-1">Configure and manage your consultation slots</p>
        </div>
        <button
          onClick={openCreateModal}
          disabled={hasActiveRule}
          className={`px-6 py-3 rounded-xl font-semibold transition-all shadow-lg flex items-center gap-2 ${
            hasActiveRule 
              ? "bg-gray-100 text-gray-400 cursor-not-allowed shadow-none" 
              : "bg-gradient-to-r from-[#081C45] to-[#1E40AF] text-white hover:opacity-90 hover:shadow-xl"
          }`}
          title={hasActiveRule ? "A rule is already active. You can create a new one after the current rule expires." : "Create a new slot rule"}
        >
          <Plus size={20} />
          Create New Rule
        </button>
      </div>

  {/* Alert */}
  <div className="bg-gradient-to-r from-yellow-50 to-yellow-100 border-l-4 border-yellow-400 p-4 rounded-r-lg flex items-start gap-3">
    <AlertCircle className="text-yellow-600 mt-1" size={20} />
    <div>
      <p className="text-sm text-yellow-800 font-medium">Editing Policy</p>
      <p className="text-xs text-yellow-700">
        When editing an existing rule, only exceptional days (holidays) can be modified. 
        Editing is disabled if any day in the rule&apos;s range has more than 5 bookings.
      </p>
    </div>
  </div>

  {/* Existing Rules */}
  {configs.length > 0 ? (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-gray-800">Existing Rules</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {configs.map((config) => {
    const canEdit = Object.keys(bookingCounts).every(dateStr => {
      const d = new Date(dateStr);
      if (d >= new Date(config.startDate) && d <= new Date(config.endDate)) {
        return bookingCounts[dateStr] <= 5;
      }
      return true;
    });
          
          return (
            <div key={config.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-4 hover:shadow-md transition-all">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold text-gray-800">
                    {formatDate(config.startDate)} - {formatDate(config.endDate)}
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">
                    {formatTime(config.startTime)} - {formatTime(config.endTime)}
                  </p>
                </div>
                <span className={`text-xs px-2 py-1 rounded-full ${canEdit ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                  {canEdit ? 'Editable' : 'Read-only'}
                </span>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Slot Duration:</span>
                  <span className="font-medium">{config.slotDuration} mins</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Buffer Time:</span>
                  <span className="font-medium">{config.bufferTime} mins</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Days:</span>
                  <span className="font-medium">{config.weekdays.length} days/week</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Holidays:</span>
                  <span className="font-medium">{config.exceptionalDays.length} days</span>
                </div>
              </div>
              
              <div className="flex gap-2 pt-4 border-t border-gray-100">
                <button
                  onClick={() => handleEdit(config)}
                  disabled={!canEdit}
                  className={`flex-1 py-2 rounded-lg font-medium flex items-center justify-center gap-2 transition-all ${
                    canEdit 
                      ? 'bg-gradient-to-r from-[#081C45] to-[#1E40AF] text-white hover:opacity-90' 
                      : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  <Edit2 size={16} />
                  Edit
                </button>
                <button
                  onClick={() => handleDelete()}
                  className="flex-1 py-2 bg-red-50 text-red-600 rounded-lg font-medium hover:bg-red-100 transition-all flex items-center justify-center gap-2"
                >
                  <Trash2 size={16} />
                  Delete
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  ) : (
    <div className="text-center py-12">
      <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
        <Calendar className="text-gray-400" size={40} />
      </div>
      <h3 className="text-xl font-semibold text-gray-700 mb-2">No rules created yet</h3>
      <p className="text-gray-500">Create your first slot configuration rule to get started</p>
    </div>
  )}

  {/* Modal */}
  {showModal && (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Modal Header */}
        <div className="sticky top-0 bg-white p-6 border-b border-gray-200 rounded-t-2xl flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-800">
            {editingId ? 'Edit Rule' : 'Create New Rule'}
          </h2>
          <button
            onClick={() => {
              setShowModal(false);
              resetForm();
            }}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X size={24} />
          </button>
        </div>
        
        {/* Modal Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Date Range */}
        {/* Date Range */}
<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
  <div className="space-y-2">
    <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
      <Calendar size={16} /> Start Date *
    </label>
    <div className="relative">
      <input
        type="date"
        required
        min={getMinDate()}
        value={config.startDate}
        disabled={!!editingId}
        onChange={(e) => {
          setConfig({ ...config, startDate: e.target.value });
          if (errors.startDate) setErrors(prev => ({ ...prev, startDate: "" }));
        }}
        className={`w-full p-3 rounded-xl border ${errors.startDate ? 'border-red-300' : 'border-gray-200'} focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none text-black ${editingId ? 'bg-gray-50' : ''} pr-10`}
      />
      {/* Always show calendar icon even when disabled */}
      <div className="absolute right-3 top-3 text-gray-400 pointer-events-none">
        <Calendar size={20} />
      </div>
    </div>
    {errors.startDate && (
      <p className="text-sm text-red-600">{errors.startDate}</p>
    )}
  </div>
  <div className="space-y-2">
    <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
      <Calendar size={16} /> End Date *
    </label>
    <div className="relative">
      <input
        type="date"
        required
        min={getMinEndDate()}
        value={config.endDate}
        disabled={!!editingId}
        onChange={(e) => {
          setConfig({ ...config, endDate: e.target.value });
          if (errors.endDate) setErrors(prev => ({ ...prev, endDate: "" }));
        }}
        className={`w-full p-3 rounded-xl border ${errors.endDate ? 'border-red-300' : 'border-gray-200'} focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none text-black ${editingId ? 'bg-gray-50' : ''} pr-10`}
      />
      {/* Always show calendar icon even when disabled */}
      <div className="absolute right-3 top-3 text-gray-400 pointer-events-none">
        <Calendar size={20} />
      </div>
    </div>
    {errors.endDate && (
      <p className="text-sm text-red-600">{errors.endDate}</p>
    )}
  </div>
</div>

          {/* Time Range */}
         {/* Time Range */}
<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
  <div className="space-y-2">
    <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
      <Clock size={16} /> Start Time *
    </label>
    <div className="relative">
      <input
        type="time"
        required
        value={config.startTime}
        disabled={!!editingId}
        onChange={(e) => {
          setConfig({ ...config, startTime: e.target.value });
          if (errors.startTime) setErrors(prev => ({ ...prev, startTime: "" }));
        }}
        className={`w-full p-3 rounded-xl border ${errors.startTime ? 'border-red-300' : 'border-gray-200'} focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none text-black ${editingId ? 'bg-gray-50' : ''} pr-10`}
      />
      <div className="absolute right-3 top-3 text-gray-400 pointer-events-none">
        <Clock size={20} />
      </div>
    </div>
    {errors.startTime && (
      <p className="text-sm text-red-600">{errors.startTime}</p>
    )}
  </div>
  <div className="space-y-2">
    <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
      <Clock size={16} /> End Time *
    </label>
    <div className="relative">
      <input
        type="time"
        required
        value={config.endTime}
        disabled={!!editingId}
        onChange={(e) => {
          setConfig({ ...config, endTime: e.target.value });
          if (errors.endTime) setErrors(prev => ({ ...prev, endTime: "" }));
        }}
        className={`w-full p-3 rounded-xl border ${errors.endTime ? 'border-red-300' : 'border-gray-200'} focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none text-black ${editingId ? 'bg-gray-50' : ''} pr-10`}
      />
      <div className="absolute right-3 top-3 text-gray-400 pointer-events-none">
        <Clock size={20} />
      </div>
    </div>
    {errors.endTime && (
      <p className="text-sm text-red-600">{errors.endTime}</p>
    )}
  </div>
</div>

          {/* Duration and Buffer */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">Slot Duration (minutes) *</label>
              <input
                type="number"
                required
                min="15"
                value={config.slotDuration}
                disabled={!!editingId}
                onChange={(e) => {
                  setConfig({ ...config, slotDuration: Number(e.target.value) });
                  if (errors.slotDuration) setErrors(prev => ({ ...prev, slotDuration: "" }));
                }}
                className={`w-full p-3 rounded-xl border ${errors.slotDuration ? 'border-red-300' : 'border-gray-200'} focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none text-black ${editingId ? 'bg-gray-50' : ''}`}
              />
              {errors.slotDuration && (
                <p className="text-sm text-red-600">{errors.slotDuration}</p>
              )}
              <p className="text-xs text-gray-500">Minimum 15 minutes</p>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">Buffer Time (minutes) *</label>
              <input
                type="number"
                required
                min="10"
                value={config.bufferTime}
                disabled={!!editingId}
                onChange={(e) => {
                  setConfig({ ...config, bufferTime: Number(e.target.value) });
                  if (errors.bufferTime) setErrors(prev => ({ ...prev, bufferTime: "" }));
                }}
                className={`w-full p-3 rounded-xl border ${errors.bufferTime ? 'border-red-300' : 'border-gray-200'} focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none text-black ${editingId ? 'bg-gray-50' : ''}`}
              />
              {errors.bufferTime && (
                <p className="text-sm text-red-600">{errors.bufferTime}</p>
              )}
              <p className="text-xs text-gray-500">Minimum 10 minutes</p>
            </div>
          </div>

          {/* Weekdays */}
          <div className="space-y-4">
            <label className="text-sm font-semibold text-gray-700 block">Available Weekdays *</label>
            <div className="flex flex-wrap gap-2">
              {weekdaysList.map((day) => (
                <button
                  key={day}
                  type="button"
                  onClick={() => !editingId && handleWeekdayToggle(day)}
                  disabled={!!editingId}
                  className={`px-4 py-2 rounded-full text-sm font-medium border transition-all ${
                    config.weekdays.includes(day)
                      ? "bg-gradient-to-r from-[#081C45] to-[#1E40AF] text-white border-transparent shadow-md"
                      : "bg-white text-gray-600 border-gray-200 hover:border-blue-300"
                  } ${editingId ? 'cursor-not-allowed opacity-80' : ''}`}
                >
                  {day}
                </button>
              ))}
            </div>
            {errors.weekdays && (
              <p className="text-sm text-red-600">{errors.weekdays}</p>
            )}
          </div>

          {/* Exceptional Days */}
          <div className="space-y-4">
            <label className="text-sm font-semibold text-gray-700 block">Exceptional Days (Holidays)</label>
            <div className="flex gap-2">
              <input
                type="date"
                min={config.startDate}
                max={config.endDate}
                value={newExDate}
                onChange={(e) => setNewExDate(e.target.value)}
                className="flex-1 p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none text-black"
              />
              <button
                type="button"
                onClick={addExDate}
                className="px-4 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors flex items-center gap-2"
              >
                <Plus size={18} /> Add
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {config.exceptionalDays.map((date: string) => (
                <div
                  key={date}
                  className="flex items-center gap-2 px-3 py-1.5 bg-gray-50 text-gray-700 rounded-lg border border-gray-100 text-sm"
                >
                  {formatDate(date)}
                  <button
                    type="button"
                    onClick={() => removeExDate(date)}
                    className="text-red-400 hover:text-red-600"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="sticky bottom-0 bg-white pt-6 border-t border-gray-200 flex gap-4">
            <button
              type="button"
              onClick={() => {
                setShowModal(false);
                resetForm();
              }}
              className="flex-1 py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-3 bg-gradient-to-r from-[#081C45] to-[#1E40AF] text-white rounded-xl font-semibold hover:opacity-90 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? "Saving..." : (
                <>
                  <Save size={20} />
                  {editingId ? 'Update Rule' : 'Create Rule'}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )}
</div>
  );
}