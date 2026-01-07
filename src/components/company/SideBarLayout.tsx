'use client';

import { useState, useEffect } from 'react';
import styles from './style.module.css';

export interface SidebarProps {
  onNavigate?: (section: string) => void;
  activeSection?: string;
  userInfo?: {
    name: string;
    type: string;
    initials: string;
  };
}

export default function Sidebar({ 
  onNavigate, 
  activeSection = 'overview',
  userInfo = { name: 'Elite Properties', type: 'Company Account', initials: 'EP' }
}: SidebarProps) {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

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
  const handleNavClick = (section: string) => {
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
      ]
    },
    {
      title: 'Finance',
      items: [
        { 
          section: 'earnings', 
          label: 'Earnings', 
          icon: (
            <svg className={styles.navIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
            </svg>
          )
        },
        { 
          section: 'payouts', 
          label: 'Payouts', 
          icon: (
            <svg className={styles.navIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
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