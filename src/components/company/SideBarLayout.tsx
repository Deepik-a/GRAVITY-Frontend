'use client';

import { useState, useEffect } from 'react';
import styles from './style.module.css';
import { useAuth } from '@/context/AuthContext';

export interface SidebarProps {
  onNavigate?: (section: string) => void;
  activeSection?: string;
}

export default function Sidebar({ 
  onNavigate, 
  activeSection = 'overview',
}: SidebarProps) {
  const { user, logout } = useAuth();
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Map user to userInfo fallback
  const userInfo = {
    name: user?.name || 'Loading...',
    type: user?.role === 'company' ? 'Company Account' : 'User Account',
    initials: user?.name?.charAt(0).toUpperCase() || '?'
  };

  // Check if mobile on mount and resize
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    // Initial check
    checkIfMobile();

    // Add resize listener
    window.addEventListener('resize', checkIfMobile);

    // Cleanup
    return () => window.removeEventListener('resize', checkIfMobile);
  }, []);

  // Handle mobile sidebar open
  const openMobileSidebar = () => {
    setIsMobileSidebarOpen(true);
    document.body.style.overflow = 'hidden';
  };

  // Handle mobile sidebar close
  const closeMobileSidebar = () => {
    setIsMobileSidebarOpen(false);
    document.body.style.overflow = '';
  };

  // Handle navigation click
  const handleNavClick = async (section: string) => {
    if (section === 'logout') {
      await logout();
      return;
    }
    
    if (onNavigate) {
      onNavigate(section);
    }
    
    if (isMobile) {
      closeMobileSidebar();
    }
  };

  // Navigation items data
  const navSections = [
    {
      title: 'Main',
      items: [
        { 
          section: 'overview', 
          label: 'Overview', 
          icon: (
            <svg className={styles.navIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          )
        },
        { 
          section: 'bookings', 
          label: 'Bookings', 
          icon: (
            <svg className={styles.navIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          )
        },
        { 
          section: 'Slots', 
          label: 'Slots Management', 
          icon: (
            <svg className={styles.navIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          )
        },
        { 
          section: 'reviews', 
          label: 'Reviews', 
          icon: (
            <svg className={styles.navIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
            </svg>
          )
        },
        { 
          section: 'messages', 
          label: 'Messages', 
          icon: (
            <svg className={styles.navIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
            </svg>
          )
        },
      ]
    },
    {
      title: 'Finance',
      items: [
        { 
          section: 'wallet', 
          label: 'Wallet', 
          icon: (
            <svg className={styles.navIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
            </svg>
          )
        },
        { 
          section: 'subscription', 
          label: 'Subscription', 
          icon: (
            <svg className={styles.navIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
          )
        },
      ]
    },
    {
      title: 'Settings',
      items: [
        { 
          section: 'profile', 
          label: 'Profile', 
          icon: (
            <svg className={styles.navIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          )
        },
        { 
          section: 'settings', 
          label: 'Settings', 
          icon: (
            <svg className={styles.navIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          )
        },
        { 
          section: 'help', 
          label: 'Help & Support', 
          icon: (
            <svg className={styles.navIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          )
        },
        { 
          section: 'logout', 
          label: 'Logout', 
          icon: (
            <svg className={styles.navIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
          )
        },
      ]
    }
  ];

  // Sidebar content component
  const SidebarContent = ({ onClose }: { onClose?: () => void }) => (
    <>
      {/* Close button for mobile */}
      {onClose && (
        <button className={styles.closeBtn} onClick={onClose} aria-label="Close sidebar">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}

      {/* Logo */}
      <div className={styles.logo}>
        <div className={styles.logoIcon}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>
        </div>
        <div className={styles.logoText}>
          <h2>PropConsult</h2>
          <p>Company Portal</p>
        </div>
      </div>

      {/* Navigation Content */}
      <div className={styles.navContent}>
        {navSections.map((section, index) => (
          <div key={index} className={styles.navSection}>
            <div className={styles.sectionTitle}>{section.title}</div>
            {section.items.map((item, itemIndex) => (
              <button
                key={itemIndex}
                className={`${styles.navItem} ${activeSection === item.section ? styles.active : ''}`}
                onClick={() => {
                  handleNavClick(item.section);
                  onClose?.();
                }}
              >
                {item.icon}
                {item.label}
              </button>
            ))}
          </div>
        ))}
      </div>

      {/* User Profile */}
      <div 
        className={`${styles.userProfile} cursor-pointer hover:bg-gray-50 transition-colors`}
        onClick={() => handleNavClick('profile')}
      >
        <div className={styles.userAvatar}>{userInfo.initials}</div>
        <div className={styles.userInfo}>
          <h4>{userInfo.name}</h4>
          <p>{userInfo.type}</p>
        </div>
      </div>
    </>
  );

  return (
    <>
      {/* Menu Toggle Button (Mobile) */}
      {isMobile && (
        <button className={styles.menuToggle} onClick={openMobileSidebar} aria-label="Open sidebar">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      )}

      {/* Desktop Sidebar */}
      {!isMobile && (
        <div className={`${styles.sidebarContainer} ${styles.desktopSidebar}`}>
          <SidebarContent />
        </div>
      )}

      {/* Mobile Sidebar */}
      <div className={`${styles.sidebarContainer} ${styles.mobileSidebar} ${isMobileSidebarOpen ? styles.open : ''}`}>
        <SidebarContent onClose={closeMobileSidebar} />
      </div>

      {/* Overlay */}
      {isMobileSidebarOpen && (
        <div 
          className={styles.sidebarOverlay} 
          onClick={closeMobileSidebar}
        />
      )}
    </>
  );
}