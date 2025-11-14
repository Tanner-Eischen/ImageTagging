'use client'

import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Trash2, Edit2, Shield } from 'lucide-react'

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

interface UserTableProps {
  users: User[]
  onEdit?: (user: User) => void
  onDelete?: (id: string) => void
  onChangeRole?: (id: string, role: string) => void
}

const roleColors = {
  admin: 'bg-purple-900/30 text-purple-300',
  manager: 'bg-blue-900/30 text-blue-300',
  adjuster: 'bg-green-900/30 text-green-300',
  viewer: 'bg-gray-900/30 text-gray-300',
}

const statusColors = {
  active: 'bg-green-900/30 text-green-300',
  inactive: 'bg-gray-900/30 text-gray-300',
  pending: 'bg-yellow-900/30 text-yellow-300',
}

export function UserTable({
  users,
  onEdit,
  onDelete,
  onChangeRole,
}: UserTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead className="border-b border-border/50">
          <tr>
            <th className="text-left py-3 px-4 font-medium">Name</th>
            <th className="text-left py-3 px-4 font-medium">Role</th>
            <th className="text-left py-3 px-4 font-medium">Status</th>
            <th className="text-left py-3 px-4 font-medium">Joined</th>
            <th className="text-left py-3 px-4 font-medium">Activity</th>
            <th className="text-left py-3 px-4 font-medium">Photos</th>
            <th className="text-left py-3 px-4 font-medium">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr
              key={user.id}
              className="border-b border-border/50 hover:bg-secondary/50 transition-colors"
            >
              <td className="py-3 px-4">
                <div>
                  <p className="font-medium">{user.name}</p>
                  <p className="text-xs text-muted-foreground">{user.email}</p>
                </div>
              </td>
              <td className="py-3 px-4">
                <Badge
                  className={`text-xs ${roleColors[user.role]}`}
                >
                  {user.role}
                </Badge>
              </td>
              <td className="py-3 px-4">
                <Badge
                  className={`text-xs ${statusColors[user.status]}`}
                >
                  {user.status}
                </Badge>
              </td>
              <td className="py-3 px-4 text-xs text-muted-foreground">
                {user.joinDate}
              </td>
              <td className="py-3 px-4 text-xs text-muted-foreground">
                {user.lastActive}
              </td>
              <td className="py-3 px-4 font-medium">
                {user.photosProcessed}
              </td>
              <td className="py-3 px-4">
                <div className="flex gap-1">
                  <button
                    onClick={() => onEdit?.(user)}
                    className="p-1.5 hover:bg-secondary rounded transition-colors"
                    title="Edit user"
                  >
                    <Edit2 className="w-4 h-4 text-muted-foreground" />
                  </button>
                  <button
                    onClick={() => onChangeRole?.(user.id, user.role)}
                    className="p-1.5 hover:bg-secondary rounded transition-colors"
                    title="Manage permissions"
                  >
                    <Shield className="w-4 h-4 text-muted-foreground" />
                  </button>
                  <button
                    onClick={() => onDelete?.(user.id)}
                    className="p-1.5 hover:bg-destructive/10 rounded transition-colors"
                    title="Delete user"
                  >
                    <Trash2 className="w-4 h-4 text-destructive" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
