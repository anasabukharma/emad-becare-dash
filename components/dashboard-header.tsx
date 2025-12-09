"use client"

import { useAuth } from "@/lib/auth-context"
import { useEffect, useState } from "react"
import { SettingsModal } from "@/components/settings-modal"
import { Settings } from "lucide-react"

interface AnalyticsData {
  activeUsers: number
  todayVisitors: number
  totalVisitors: number
  devices: Array<{ device: string; users: number }>
  countries: Array<{ country: string; users: number }>
}

export function DashboardHeader() {
  const { user, logout } = useAuth()
  const [analytics, setAnalytics] = useState<AnalyticsData>({
    activeUsers: 0,
    todayVisitors: 0,
    totalVisitors: 0,
    devices: [],
    countries: [],
  })
  const [loading, setLoading] = useState(true)
  const [showSettings, setShowSettings] = useState(false)

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const response = await fetch('/api/analytics')
        const data = await response.json()
        setAnalytics(data)
      } catch (error) {
        console.error('Error fetching analytics:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchAnalytics()
    // Refresh every 30 seconds
    const interval = setInterval(fetchAnalytics, 30000)
    return () => clearInterval(interval)
  }, [])

  if (!user) return null

  // Get device names in Arabic
  const getDeviceName = (device: string) => {
    const names: Record<string, string> = {
      'mobile': 'موبايل',
      'desktop': 'كمبيوتر',
      'tablet': 'تابلت',
    }
    return names[device.toLowerCase()] || device
  }

  return (
    <div className="bg-white border-b border-gray-200">
      {/* Main Header */}
      <div className="px-4 landscape:px-3 md:px-6 py-3 landscape:py-1.5 md:py-4 border-b border-gray-100">
        <div className="flex items-center justify-between flex-wrap gap-2">
          {/* Title */}
          <div>
            <h1 className="text-xl landscape:text-sm md:text-2xl font-bold text-gray-800">لوحة التحكم</h1>
            <p className="text-xs landscape:text-[10px] md:text-sm text-gray-600 landscape:hidden md:block">إدارة زوار BCare</p>
          </div>

          {/* User Info & Logout */}
          <div className="flex items-center gap-2 md:gap-4">
            {/* Settings Button */}
            <button
              onClick={() => setShowSettings(true)}
              className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-lg transition-colors"
              title="إعدادات"
            >
              <Settings className="w-4 h-4 md:w-5 md:h-5" />
            </button>
            {/* User Email */}
            <div className="text-left hidden md:block">
              <p className="text-sm font-medium text-gray-700">{user.email}</p>
              <p className="text-xs text-gray-500">مسؤول النظام</p>
            </div>

            {/* Logout Button */}
            <button
              onClick={logout}
              className="bg-red-500 hover:bg-red-600 text-white px-2 landscape:px-2 md:px-4 py-1 landscape:py-1 md:py-2 rounded-lg text-[10px] landscape:text-[10px] md:text-sm font-medium transition-colors"
            >
              تسجيل الخروج
            </button>
          </div>
        </div>
      </div>

      {/* Analytics Stats Bar */}
      <div className="bg-gradient-to-r from-blue-50 via-purple-50 to-green-50 px-4 md:px-6 py-2">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
          {/* Active Users */}
          <div className="flex flex-col gap-0.5 bg-white/70 backdrop-blur-sm rounded-lg p-1.5 md:p-2 border border-green-200">
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-xs text-gray-600">نشط الآن</span>
            </div>
            <span className="text-base md:text-xl font-bold text-green-600">
              {loading ? '...' : analytics.activeUsers}
            </span>
          </div>

          {/* Today's Visitors */}
          <div className="flex flex-col gap-0.5 bg-white/70 backdrop-blur-sm rounded-lg p-1.5 md:p-2 border border-blue-200">
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span className="text-xs text-gray-600">زوار اليوم</span>
            </div>
            <span className="text-base md:text-xl font-bold text-blue-600">
              {loading ? '...' : analytics.todayVisitors}
            </span>
          </div>

          {/* Total Visitors */}
          <div className="flex flex-col gap-0.5 bg-white/70 backdrop-blur-sm rounded-lg p-1.5 md:p-2 border border-purple-200">
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
              <span className="text-xs text-gray-600">إجمالي (30 يوم)</span>
            </div>
            <span className="text-base md:text-xl font-bold text-purple-600">
              {loading ? '...' : analytics.totalVisitors}
            </span>
          </div>


        </div>
      </div>

      {/* Settings Modal */}
      <SettingsModal isOpen={showSettings} onClose={() => setShowSettings(false)} />
    </div>
  )
}
