'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { ImageIcon, Tag, Download, Users, BarChart3, Settings } from 'lucide-react'

interface DashboardSidebarProps {
  className?: string
}

const navItems = [
  {
    label: 'Gallery',
    href: '/dashboard',
    icon: ImageIcon,
  },
  {
    label: 'Analysis',
    href: '/dashboard/analysis',
    icon: BarChart3,
  },
  {
    label: 'Tags',
    href: '/dashboard/tags',
    icon: Tag,
  },
  {
    label: 'Exports',
    href: '/dashboard/exports',
    icon: Download,
  },
  {
    label: 'Admin',
    href: '/dashboard/admin',
    icon: Users,
  },
]

export function DashboardSidebar({ className }: DashboardSidebarProps) {
  const pathname = usePathname()

  return (
    <aside className={cn('bg-sidebar border-r border-sidebar-border h-screen overflow-y-auto', className)}>
      <nav className="flex flex-col gap-1 p-4">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href))

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 px-4 py-2.5 rounded-lg transition-colors',
                isActive
                  ? 'bg-sidebar-primary text-sidebar-primary-foreground'
                  : 'text-sidebar-foreground hover:bg-sidebar-accent'
              )}
            >
              <Icon className="w-5 h-5" />
              <span className="font-medium text-sm">{item.label}</span>
            </Link>
          )
        })}

        <div className="mt-auto pt-4 border-t border-sidebar-border">
          <Link
            href="/dashboard/settings"
            className={cn(
              'flex items-center gap-3 px-4 py-2.5 rounded-lg transition-colors',
              pathname === '/dashboard/settings'
                ? 'bg-sidebar-primary text-sidebar-primary-foreground'
                : 'text-sidebar-foreground hover:bg-sidebar-accent'
            )}
          >
            <Settings className="w-5 h-5" />
            <span className="font-medium text-sm">Settings</span>
          </Link>
        </div>
      </nav>
    </aside>
  )
}
