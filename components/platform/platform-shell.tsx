'use client'

import { useState } from 'react'
import { BrandLogo } from '@/components/brand-logo'
import {
  Home,
  User,
  LayoutTemplate,
  LogOut,
  Lock,
  Bell,
  Inbox,
} from 'lucide-react'
import { ProfileView } from '@/components/platform/profile-view'
import { LandingConfig } from '@/components/platform/landing-config'
import { AdminLeadsView } from './admin-leads-view'
import { useAuth } from '@/context/auth-context'
import type { BusinessProfile, LandingSection } from '@/lib/bercario-data'
import styles from './platform-shell.module.scss'

type Tab = 'inicio' | 'perfil' | 'landing' | 'solicitudes'

export function PlatformShell({
  profile,
  onProfileChange,
  sections,
  onSectionsChange,
  onLogout,
  onPreview,
}: {
  profile: BusinessProfile
  onProfileChange: (p: BusinessProfile) => void
  sections: LandingSection[]
  onSectionsChange: (s: LandingSection[]) => void
  onLogout: () => void
  onPreview: () => void
}) {
  const [tab, setTab] = useState<Tab>('perfil')
  const { user } = useAuth()

  const navItems: {
    id: Tab
    label: string
    icon: any
    disabled?: boolean
  }[] = [
    { id: 'inicio', label: 'Inicio', icon: Home, disabled: true },
    { id: 'perfil', label: 'Mi Perfil', icon: User },
    { id: 'landing', label: 'Configurar Landing', icon: LayoutTemplate },
  ]

  if (user?.role === 'admin') {
    navItems.push({ id: 'solicitudes', label: 'Solicitudes', icon: Inbox })
  }

  return (
    <div className={styles.platformShell}>
      {/* Top nav */}
      <header className={styles.header}>
        <div className={styles.headerContainer}>
          <div className={styles.navSection}>
            <BrandLogo />
            <nav className={styles.desktopNav}>
              {navItems.map((item) => {
                const isActive = tab === item.id
                return (
                  <button
                    key={item.id}
                    onClick={() => !item.disabled && setTab(item.id)}
                    disabled={item.disabled}
                    className={`${styles.navButton} ${
                      item.disabled
                        ? styles.navButtonDisabled
                        : isActive
                          ? styles.navButtonActive
                          : styles.navButtonInactive
                    }`}
                  >
                    <item.icon className="h-4 w-4" />
                    {item.label}
                    {item.disabled && (
                      <Lock className="ml-0.5 h-3 w-3" />
                    )}
                  </button>
                )
              })}
            </nav>
          </div>

          <div className={styles.rightSection}>
            <button className={styles.bellBtn}>
              <Bell className="h-4 w-4" />
              <span className={styles.bellDot} />
            </button>
            <button
              onClick={onLogout}
              className={styles.logoutBtn}
            >
              <LogOut className="h-4 w-4" />
              <span className={styles.logoutText}>Cerrar sesión</span>
            </button>
          </div>
        </div>

        {/* Mobile nav */}
        <nav className={styles.mobileNav}>
          {navItems.map((item) => {
            const isActive = tab === item.id
            return (
              <button
                key={item.id}
                onClick={() => !item.disabled && setTab(item.id)}
                disabled={item.disabled}
                className={`${styles.mobileNavButton} ${
                  item.disabled
                    ? styles.navButtonDisabled
                    : isActive
                      ? styles.mobileNavButtonActive
                      : styles.mobileNavButtonInactive
                }`}
              >
                <item.icon className="h-3.5 w-3.5" />
                {item.label}
              </button>
            )
          })}
        </nav>
      </header>

      <main className={styles.mainContent}>
        {tab === 'perfil' && (
          <ProfileView
            profile={profile}
            onProfileChange={onProfileChange}
            onPreview={onPreview}
          />
        )}
        {tab === 'landing' && (
          <LandingConfig
            sections={sections}
            onSectionsChange={onSectionsChange}
            onPreview={onPreview}
          />
        )}
        {tab === 'solicitudes' && user?.role === 'admin' && (
          <AdminLeadsView />
        )}
      </main>
    </div>
  )
}
