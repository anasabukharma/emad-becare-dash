import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { collection, query, where, getDocs, Timestamp } from 'firebase/firestore';

export async function GET() {
  try {
    const paysCollection = collection(db, 'pays');
    
    // Get all visitors
    const allVisitorsSnapshot = await getDocs(paysCollection);
    const allVisitors = allVisitorsSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as any[];
    
    // Calculate timestamps
    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    
    // Count active users (online in last 5 minutes)
    const fiveMinutesAgo = new Date(now.getTime() - 5 * 60 * 1000);
    const activeUsers = allVisitors.filter(visitor => {
      if (!visitor.lastSeen) return false;
      const lastSeen = visitor.lastSeen instanceof Timestamp 
        ? visitor.lastSeen.toDate() 
        : new Date(visitor.lastSeen);
      return lastSeen >= fiveMinutesAgo;
    }).length;
    
    // Count today's visitors
    const todayVisitors = allVisitors.filter(visitor => {
      if (!visitor.createdAt) return false;
      const createdAt = visitor.createdAt instanceof Timestamp 
        ? visitor.createdAt.toDate() 
        : new Date(visitor.createdAt);
      return createdAt >= todayStart;
    }).length;
    
    // Count total visitors (last 30 days)
    const totalVisitors = allVisitors.filter(visitor => {
      if (!visitor.createdAt) return false;
      const createdAt = visitor.createdAt instanceof Timestamp 
        ? visitor.createdAt.toDate() 
        : new Date(visitor.createdAt);
      return createdAt >= thirtyDaysAgo;
    }).length;
    
    // Count devices
    const deviceCounts: Record<string, number> = {};
    allVisitors.forEach(visitor => {
      if (visitor.deviceType) {
        deviceCounts[visitor.deviceType] = (deviceCounts[visitor.deviceType] || 0) + 1;
      }
    });
    
    const devices = Object.entries(deviceCounts)
      .map(([device, users]) => ({ device, users }))
      .sort((a, b) => b.users - a.users);
    
    // Count countries
    const countryCounts: Record<string, number> = {};
    allVisitors.forEach(visitor => {
      if (visitor.country) {
        countryCounts[visitor.country] = (countryCounts[visitor.country] || 0) + 1;
      }
    });
    
    const countries = Object.entries(countryCounts)
      .map(([country, users]) => ({ country, users }))
      .sort((a, b) => b.users - a.users);
    
    return NextResponse.json({
      activeUsers,
      todayVisitors,
      totalVisitors,
      devices,
      countries,
    });
  } catch (error: any) {
    console.error('Error fetching analytics:', error);
    return NextResponse.json(
      { 
        error: 'Failed to fetch analytics',
        message: error.message,
        activeUsers: 0,
        todayVisitors: 0,
        totalVisitors: 0,
        devices: [],
        countries: [],
      },
      { status: 200 } // Return 200 with zeros instead of error
    );
  }
}
