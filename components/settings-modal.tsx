"use client"

import { useState, useEffect } from "react"
import { X, Plus, Trash2, CreditCard, Globe } from "lucide-react"
import { 
  getSettings, 
  addBlockedCardBin, 
  removeBlockedCardBin, 
  addAllowedCountry, 
  removeAllowedCountry,
  type Settings 
} from "@/lib/firebase/settings"
import { toast } from "sonner"

interface SettingsModalProps {
  isOpen: boolean
  onClose: () => void
}

export function SettingsModal({ isOpen, onClose }: SettingsModalProps) {
  const [settings, setSettings] = useState<Settings>({
    blockedCardBins: [],
    allowedCountries: []
  })
  const [newBin, setNewBin] = useState("")
  const [newCountry, setNewCountry] = useState("")
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState<"cards" | "countries">("cards")

  // Load settings when modal opens
  useEffect(() => {
    if (isOpen) {
      loadSettings()
    }
  }, [isOpen])

  const loadSettings = async () => {
    try {
      const data = await getSettings()
      setSettings(data)
    } catch (error) {
      console.error("Error loading settings:", error)
      toast.error("فشل تحميل الإعدادات")
    }
  }

  const handleAddBin = async () => {
    if (newBin.length !== 4 || !/^\d+$/.test(newBin)) {
      toast.error("يجب إدخال 4 أرقام فقط")
      return
    }

    setLoading(true)
    try {
      await addBlockedCardBin(newBin)
      await loadSettings()
      setNewBin("")
      toast.success("تم إضافة البطاقة المحظورة")
    } catch (error) {
      console.error("Error adding blocked BIN:", error)
      toast.error("فشل إضافة البطاقة")
    } finally {
      setLoading(false)
    }
  }

  const handleRemoveBin = async (bin: string) => {
    setLoading(true)
    try {
      await removeBlockedCardBin(bin)
      await loadSettings()
      toast.success("تم إزالة البطاقة المحظورة")
    } catch (error) {
      console.error("Error removing blocked BIN:", error)
      toast.error("فشل إزالة البطاقة")
    } finally {
      setLoading(false)
    }
  }

  const handleAddCountry = async () => {
    if (newCountry.length !== 3 || !/^[A-Za-z]+$/.test(newCountry)) {
      toast.error("يجب إدخال 3 أحرف إنجليزية فقط")
      return
    }

    setLoading(true)
    try {
      await addAllowedCountry(newCountry.toUpperCase())
      await loadSettings()
      setNewCountry("")
      toast.success("تم إضافة الدولة المسموحة")
    } catch (error) {
      console.error("Error adding allowed country:", error)
      toast.error("فشل إضافة الدولة")
    } finally {
      setLoading(false)
    }
  }

  const handleRemoveCountry = async (country: string) => {
    setLoading(true)
    try {
      await removeAllowedCountry(country)
      await loadSettings()
      toast.success("تم إزالة الدولة المسموحة")
    } catch (error) {
      console.error("Error removing allowed country:", error)
      toast.error("فشل إزالة الدولة")
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">⚙️ إعدادات النظام</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200">
          <button
            onClick={() => setActiveTab("cards")}
            className={`flex-1 py-4 px-6 font-semibold transition-colors ${
              activeTab === "cards"
                ? "text-blue-600 border-b-2 border-blue-600 bg-blue-50"
                : "text-gray-600 hover:bg-gray-50"
            }`}
          >
            <div className="flex items-center justify-center gap-2">
              <CreditCard className="w-5 h-5" />
              <span>البطاقات المحظورة</span>
            </div>
          </button>
          <button
            onClick={() => setActiveTab("countries")}
            className={`flex-1 py-4 px-6 font-semibold transition-colors ${
              activeTab === "countries"
                ? "text-purple-600 border-b-2 border-purple-600 bg-purple-50"
                : "text-gray-600 hover:bg-gray-50"
            }`}
          >
            <div className="flex items-center justify-center gap-2">
              <Globe className="w-5 h-5" />
              <span>الدول المسموحة</span>
            </div>
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[60vh]">
          {activeTab === "cards" ? (
            <div className="space-y-6">
              {/* Add New BIN */}
              <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  إضافة بطاقة محظورة (أول 4 أرقام)
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newBin}
                    onChange={(e) => setNewBin(e.target.value.replace(/\D/g, "").slice(0, 4))}
                    placeholder="مثال: 5353"
                    maxLength={4}
                    dir="ltr"
                    className="flex-1 px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none text-lg font-mono"
                  />
                  <button
                    onClick={handleAddBin}
                    disabled={loading || newBin.length !== 4}
                    className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-6 py-3 rounded-lg font-semibold transition-colors flex items-center gap-2"
                  >
                    <Plus className="w-5 h-5" />
                    إضافة
                  </button>
                </div>
                <p className="text-xs text-gray-600 mt-2">
                  💡 مثال: الراجحي يبدأ بـ 5353، 5297، 4282
                </p>
              </div>

              {/* Blocked BINs List */}
              <div>
                <h3 className="text-lg font-bold text-gray-800 mb-3">
                  البطاقات المحظورة ({settings.blockedCardBins.length})
                </h3>
                {settings.blockedCardBins.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <CreditCard className="w-12 h-12 mx-auto mb-2 opacity-30" />
                    <p>لا توجد بطاقات محظورة</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {settings.blockedCardBins.map((bin) => (
                      <div
                        key={bin}
                        className="bg-white border-2 border-red-200 rounded-lg p-3 flex items-center justify-between"
                      >
                        <span className="font-mono text-lg font-bold text-red-600">
                          {bin}**
                        </span>
                        <button
                          onClick={() => handleRemoveBin(bin)}
                          disabled={loading}
                          className="text-red-500 hover:bg-red-50 p-2 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Add New Country */}
              <div className="bg-purple-50 rounded-xl p-4 border border-purple-200">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  إضافة دولة مسموحة (أول 3 أحرف بالإنجليزية)
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newCountry}
                    onChange={(e) => setNewCountry(e.target.value.replace(/[^A-Za-z]/g, "").slice(0, 3).toUpperCase())}
                    placeholder="مثال: SAU"
                    maxLength={3}
                    dir="ltr"
                    className="flex-1 px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-purple-500 focus:outline-none text-lg font-mono uppercase"
                  />
                  <button
                    onClick={handleAddCountry}
                    disabled={loading || newCountry.length !== 3}
                    className="bg-purple-600 hover:bg-purple-700 disabled:bg-gray-400 text-white px-6 py-3 rounded-lg font-semibold transition-colors flex items-center gap-2"
                  >
                    <Plus className="w-5 h-5" />
                    إضافة
                  </button>
                </div>
                <p className="text-xs text-gray-600 mt-2">
                  💡 مثال: SAU (السعودية), ARE (الإمارات), KWT (الكويت)
                </p>
              </div>

              {/* Allowed Countries List */}
              <div>
                <h3 className="text-lg font-bold text-gray-800 mb-3">
                  الدول المسموحة ({settings.allowedCountries.length})
                </h3>
                {settings.allowedCountries.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <Globe className="w-12 h-12 mx-auto mb-2 opacity-30" />
                    <p>جميع الدول مسموحة (لم يتم تحديد قيود)</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {settings.allowedCountries.map((country) => (
                      <div
                        key={country}
                        className="bg-white border-2 border-green-200 rounded-lg p-3 flex items-center justify-between"
                      >
                        <span className="font-mono text-lg font-bold text-green-600">
                          {country}
                        </span>
                        <button
                          onClick={() => handleRemoveCountry(country)}
                          disabled={loading}
                          className="text-red-500 hover:bg-red-50 p-2 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 p-4 bg-gray-50">
          <button
            onClick={onClose}
            className="w-full bg-gray-600 hover:bg-gray-700 text-white py-3 rounded-lg font-semibold transition-colors"
          >
            إغلاق
          </button>
        </div>
      </div>
    </div>
  )
}
