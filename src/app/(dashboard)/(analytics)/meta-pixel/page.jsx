"use client";

import React, { useState, useEffect } from "react";
import { useStoreSetting, useUpdateStoreSetting } from "@/hooks/useStoreSetting";
import toast from "react-hot-toast";
import { Activity, Save, TestTube2, Info } from "lucide-react";

const MetaPixel = () => {
  const { settings, isLoading, mutate } = useStoreSetting();
  const { updateSettings } = useUpdateStoreSetting();

  const [pixelId, setPixelId] = useState("");
  const [pixelTestEventCode, setPixelTestEventCode] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (settings) {
      setPixelId(settings.pixelId || "");
      setPixelTestEventCode(settings.pixelTestEventCode || "");
    }
  }, [settings]);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await updateSettings({
        pixelId: pixelId.trim(),
        pixelTestEventCode: pixelTestEventCode.trim(),
      });
      await mutate();
      toast.success("Meta Pixel settings updated successfully!");
    } catch (err) {
      toast.error(err.message || "Failed to update Meta Pixel settings");
    } finally {
      setSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-4 max-w-2xl">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          <div className="h-40 bg-gray-100 rounded-xl"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-2xl">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl">
          <Activity className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-gray-900">Meta Pixel Settings</h1>
          <p className="text-sm text-gray-500">
            Configure your Meta Pixel ID and dynamic Test Event Code
          </p>
        </div>
      </div>

      <form
        onSubmit={handleSave}
        className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm space-y-5"
      >
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1.5">
            Meta Pixel ID
          </label>
          <input
            type="text"
            value={pixelId}
            onChange={(e) => setPixelId(e.target.value)}
            placeholder="e.g. 1479601514236892"
            className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <p className="text-xs text-gray-500 mt-1.5">
            Leave empty to disable Meta Pixel tracking on the storefront.
          </p>
        </div>

        <div>
          <label className="flex items-center gap-1.5 text-sm font-semibold text-gray-700 mb-1.5">
            <TestTube2 className="w-4 h-4 text-purple-600" />
            Test Event Code (Optional)
          </label>
          <input
            type="text"
            value={pixelTestEventCode}
            onChange={(e) => setPixelTestEventCode(e.target.value)}
            placeholder="e.g. TEST17390"
            className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />
          <div className="mt-2 flex items-start gap-2 bg-purple-50 border border-purple-100 rounded-xl p-3 text-xs text-purple-800">
            <Info className="w-4 h-4 shrink-0 mt-0.5 text-purple-600" />
            <span>
              Paste the <strong>Test Event Code</strong> from Meta Events Manager &rarr; Test Events.
              Clear this field and save when you are done testing so live events are not tagged as test events.
            </span>
          </div>
        </div>

        <div className="pt-2 flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-sm font-semibold rounded-xl transition-colors"
          >
            <Save className="w-4 h-4" />
            {saving ? "Saving..." : "Save Settings"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default MetaPixel;
