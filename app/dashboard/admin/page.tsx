'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { UserTable } from '@/components/user-table'
import { Users, Settings, Activity, AlertCircle, Plus } from 'lucide-react'

interface User {
  id: string
  name: string
  email: string
  role: 'admin' | 'manager' | 'adjuster' | 'viewer'
  status: 'active' | 'inactive' | 'pending'
  joinDate: string
  lastActive: string
  photosProcessed: number
}

interface SystemStats {
  totalUsers: number
  activeUsers: number
  totalPhotos: number
  todayProcessed: number
  systemHealth: 'good' | 'warning' | 'critical'
  uptime: string
}

export default function AdminPage() {
  const [users, setUsers] = useState<User[]>([
    {
      id: '1',
      name: 'John Smith',
      email: 'john@example.com',
      role: 'admin',
      status: 'active',
      joinDate: '2024-01-15',
      lastActive: 'Today',
      photosProcessed: 342,
    },
    {
      id: '2',
      name: 'Sarah Johnson',
      email: 'sarah@example.com',
      role: 'manager',
      status: 'active',
      joinDate: '2024-02-20',
      lastActive: 'Today',
      photosProcessed: 284,
    },
    {
      id: '3',
      name: 'Mike Davis',
      email: 'mike@example.com',
      role: 'adjuster',
      status: 'active',
      joinDate: '2024-03-10',
      lastActive: '2 hours ago',
      photosProcessed: 156,
    },
    {
      id: '4',
      name: 'Emily Brown',
      email: 'emily@example.com',
      role: 'adjuster',
      status: 'pending',
      joinDate: '2024-11-10',
      lastActive: 'Never',
      photosProcessed: 0,
    },
  ])

  const [searchTerm, setSearchTerm] = useState('')
  const [filterRole, setFilterRole] = useState('all')

  const stats: SystemStats = {
    totalUsers: users.length,
    activeUsers: users.filter(u => u.status === 'active').length,
    totalPhotos: users.reduce((sum, u) => sum + u.photosProcessed, 0),
    todayProcessed: 47,
    systemHealth: 'good',
    uptime: '99.9%',
  }

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesRole = filterRole === 'all' || user.role === filterRole
    return matchesSearch && matchesRole
  })

  const handleDeleteUser = (id: string) => {
    setUsers(users.filter(u => u.id !== id))
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <p className="text-muted-foreground mt-1">
          Manage users, permissions, and system settings
        </p>
      </div>

      {/* System Health */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-border/50">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Users className="w-4 h-4" />
              Total Users
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalUsers}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {stats.activeUsers} active
            </p>
          </CardContent>
        </Card>

        <Card className="border-border/50">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Activity className="w-4 h-4" />
              Photos Processed
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalPhotos}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {stats.todayProcessed} today
            </p>
          </CardContent>
        </Card>

        <Card className="border-border/50">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Settings className="w-4 h-4" />
              System Health
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Badge
              className={`text-xs ${
                stats.systemHealth === 'good'
                  ? 'bg-green-900/30 text-green-300'
                  : stats.systemHealth === 'warning'
                  ? 'bg-yellow-900/30 text-yellow-300'
                  : 'bg-red-900/30 text-red-300'
              }`}
            >
              {stats.systemHealth}
            </Badge>
            <p className="text-xs text-muted-foreground mt-2">
              Uptime: {stats.uptime}
            </p>
          </CardContent>
        </Card>

        <Card className="border-border/50">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <AlertCircle className="w-4 h-4" />
              Alerts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2</div>
            <p className="text-xs text-muted-foreground mt-1">
              Pending actions
            </p>
          </CardContent>
        </Card>
      </div>

      {/* User Management */}
      <Card className="border-border/50">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>User Management</CardTitle>
              <CardDescription>
                Manage platform users and permissions
              </CardDescription>
            </div>
            <Button className="bg-primary hover:bg-primary/90 text-primary-foreground gap-2">
              <Plus className="w-4 h-4" />
              Add User
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1 relative">
              <Input
                placeholder="Search by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-input border-border/50"
              />
            </div>
            <select
              value={filterRole}
              onChange={(e) => setFilterRole(e.target.value)}
              className="px-3 py-2 bg-input border border-border/50 rounded-lg text-sm"
            >
              <option value="all">All Roles</option>
              <option value="admin">Admin</option>
              <option value="manager">Manager</option>
              <option value="adjuster">Adjuster</option>
              <option value="viewer">Viewer</option>
            </select>
          </div>

          {/* User Table */}
          <UserTable
            users={filteredUsers}
            onDelete={handleDeleteUser}
          />
        </CardContent>
      </Card>

      {/* Activity Log */}
      <Card className="border-border/50">
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>
            System events and user actions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[
              { user: 'Sarah Johnson', action: 'uploaded 5 photos', time: '2 minutes ago', icon: '📤' },
              { user: 'Mike Davis', action: 'exported analysis report', time: '15 minutes ago', icon: '📥' },
              { user: 'John Smith', action: 'created new workflow', time: '1 hour ago', icon: '⚙️' },
              { user: 'Emily Brown', action: 'account created', time: '2 hours ago', icon: '👤' },
            ].map((activity, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 border border-border/50 rounded-lg"
              >
                <div className="flex-1">
                  <p className="text-sm">
                    <span className="font-medium">{activity.user}</span>
                    {' '}
                    <span className="text-muted-foreground">{activity.action}</span>
                  </p>
                </div>
                <p className="text-xs text-muted-foreground">{activity.time}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
