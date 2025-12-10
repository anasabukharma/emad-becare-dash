"use client"

import { ReactNode } from "react"

interface DataBubbleProps {
  title: string
  data: Record<string, any>
  timestamp?: string | Date
  status?: "pending" | "approved" | "rejected"
  showActions?: boolean
  isLatest?: boolean
  actions?: ReactNode
  icon?: string
  color?: "blue" | "green" | "purple" | "orange" | "pink" | "indigo" | "gray"
  layout?: "vertical" | "horizontal"
}

export function DataBubble({
  title,
  data,
  timestamp,
  status,
  showActions,
  isLatest,
  actions,
  icon,
  color,
  layout = "vertical"
}: DataBubbleProps) {
  // Get status badge
  const getStatusBadge = () => {
    if (!status) return null
    
    const badges = {
      pending: { text: "⏳ قيد المراجعة", className: "bg-yellow-100 text-yellow-800 border-yellow-300" },
      approved: { text: "✓ تم القبول", className: "bg-green-100 text-green-800 border-green-300" },
      rejected: { text: "✗ تم الرفض", className: "bg-red-100 text-red-800 border-red-300" }
    }
    
    const badge = badges[status]
    if (!badge) return null
    
    return (
      <span className={`px-3 py-1.5 rounded-lg text-sm font-bold border ${badge.className}`}>
        {badge.text}
      </span>
    )
  }

  // Get color styles
  const getColorStyles = () => {
    const colors = {
      blue: {
        gradient: 'from-blue-50 to-blue-100',
        border: 'border-blue-300',
        iconBg: 'bg-blue-200',
        titleColor: 'text-blue-900'
      },
      green: {
        gradient: 'from-green-50 to-green-100',
        border: 'border-green-300',
        iconBg: 'bg-green-200',
        titleColor: 'text-green-900'
      },
      purple: {
        gradient: 'from-purple-50 to-purple-100',
        border: 'border-purple-300',
        iconBg: 'bg-purple-200',
        titleColor: 'text-purple-900'
      },
      orange: {
        gradient: 'from-orange-50 to-orange-100',
        border: 'border-orange-300',
        iconBg: 'bg-orange-200',
        titleColor: 'text-orange-900'
      },
      pink: {
        gradient: 'from-pink-50 to-pink-100',
        border: 'border-pink-300',
        iconBg: 'bg-pink-200',
        titleColor: 'text-pink-900'
      },
      indigo: {
        gradient: 'from-indigo-50 to-indigo-100',
        border: 'border-indigo-300',
        iconBg: 'bg-indigo-200',
        titleColor: 'text-indigo-900'
      },
      gray: {
        gradient: 'from-gray-50 to-gray-100',
        border: 'border-gray-300',
        iconBg: 'bg-gray-200',
        titleColor: 'text-gray-900'
      }
    }
    
    return colors[color || 'gray']
  }
  
  const colorStyles = getColorStyles()

  // Format relative time
  const formatRelativeTime = (timestamp: string | Date) => {
    const now = new Date()
    const time = new Date(timestamp)
    const diffMs = now.getTime() - time.getTime()
    
    if (diffMs < 0) return 'الآن'
    
    const diffSecs = Math.floor(diffMs / 1000)
    const diffMins = Math.floor(diffSecs / 60)
    const diffHours = Math.floor(diffMins / 60)
    const diffDays = Math.floor(diffHours / 24)
    
    if (diffSecs < 10) return 'الآن'
    if (diffSecs < 60) return 'منذ لحظات'
    if (diffMins === 1) return 'منذ دقيقة'
    if (diffMins < 60) return `منذ ${diffMins} دقيقة`
    if (diffHours === 1) return 'منذ ساعة'
    if (diffHours < 24) return `منذ ${diffHours} ساعة`
    if (diffDays === 1) return 'منذ يوم'
    if (diffDays < 30) return `منذ ${diffDays} يوم`
    
    const diffMonths = Math.floor(diffDays / 30)
    if (diffMonths === 1) return 'منذ شهر'
    if (diffMonths < 12) return `منذ ${diffMonths} شهر`
    
    const diffYears = Math.floor(diffDays / 365)
    return `منذ ${diffYears} سنة`
  }

  // Vertical layout (default)
  if (layout === "vertical") {
    return (
      <div 
        className={`bg-gradient-to-br ${colorStyles.gradient} rounded-xl shadow-lg p-6 border-2 ${colorStyles.border} transition-all hover:shadow-xl hover:scale-[1.02] h-full flex flex-col`}
        style={{ fontFamily: 'Cairo, Tajawal, sans-serif' }}
      >
        {/* Header - Centered */}
        <div className="flex flex-col items-center text-center mb-6 pb-4 border-b-2 border-gray-300">
          {icon && (
            <div className={`${colorStyles.iconBg} rounded-full p-4 mb-3`}>
              <span className="text-4xl">{icon}</span>
            </div>
          )}
          <h3 className={`text-2xl font-bold ${colorStyles.titleColor} mb-2`}>{title}</h3>
          <div className="flex flex-col items-center gap-2">
            {isLatest && (
              <span className="px-3 py-1 bg-blue-600 text-white text-sm font-bold rounded-full">
                ⭐ جديد
              </span>
            )}
            {getStatusBadge()}
            {timestamp && (
              <span className="text-sm text-gray-600 font-medium">
                🕐 {formatRelativeTime(timestamp)}
              </span>
            )}
          </div>
        </div>

        {/* Data Fields - Centered */}
        <div className="space-y-4 flex-1">
          {Object.entries(data).map(([key, value]) => {
            if (value === undefined || value === null) return null
            return (
              <div key={key} className="flex flex-col items-center text-center bg-white/80 rounded-lg p-4 shadow-sm">
                <span className="text-sm font-semibold text-gray-600 mb-2">{key}</span>
                <span 
                  className={`text-gray-900 font-bold ${
                    key === "رقم البطاقة" ? "text-3xl" : "text-2xl"
                  }`}
                  style={key === "رقم البطاقة" ? { direction: "ltr", unicodeBidi: "plaintext" } : {}}
                >
                  {value?.toString() || "-"}
                </span>
              </div>
            )
          })}
        </div>

        {/* Actions */}
        {showActions && actions && (
          <div className="mt-4 pt-4 border-t-2 border-gray-300">
            {actions}
          </div>
        )}
      </div>
    )
  }

  // Horizontal layout
  return (
    <div 
      className={`bg-gradient-to-r ${colorStyles.gradient} rounded-xl shadow-lg p-4 border-2 ${colorStyles.border} transition-all hover:shadow-xl hover:scale-[1.01]`}
      style={{ fontFamily: 'Cairo, Tajawal, sans-serif' }}
    >
      <div className="flex items-center gap-4">
        {/* Icon & Title */}
        <div className="flex items-center gap-3 flex-shrink-0">
          {icon && (
            <div className={`${colorStyles.iconBg} rounded-full p-3`}>
              <span className="text-3xl">{icon}</span>
            </div>
          )}
          <div>
            <h3 className={`text-xl font-bold ${colorStyles.titleColor}`}>{title}</h3>
            {timestamp && (
              <span className="text-xs text-gray-600">
                🕐 {formatRelativeTime(timestamp)}
              </span>
            )}
          </div>
        </div>

        {/* Data Fields - Horizontal */}
        <div className="flex items-center gap-4 flex-1 overflow-x-auto">
          {Object.entries(data).map(([key, value]) => {
            if (value === undefined || value === null) return null
            return (
              <div key={key} className="flex flex-col items-center text-center bg-white/80 rounded-lg p-3 shadow-sm min-w-[120px]">
                <span className="text-xs font-semibold text-gray-600 mb-1">{key}</span>
                <span 
                  className={`text-gray-900 font-bold ${
                    key === "رقم البطاقة" ? "text-xl" : "text-lg"
                  }`}
                  style={key === "رقم البطاقة" ? { direction: "ltr", unicodeBidi: "plaintext" } : {}}
                >
                  {value?.toString() || "-"}
                </span>
              </div>
            )
          })}
        </div>

        {/* Status & Actions */}
        <div className="flex items-center gap-3 flex-shrink-0">
          {isLatest && (
            <span className="px-2 py-1 bg-blue-600 text-white text-xs font-bold rounded-full whitespace-nowrap">
              ⭐ جديد
            </span>
          )}
          {getStatusBadge()}
          {showActions && actions && (
            <div className="ml-2">
              {actions}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
