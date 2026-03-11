import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import TabNavigation from './components/TabNavigation'
import WelcomeTab from './tabs/WelcomeTab'
import SqlNoSqlTab from './tabs/SqlNoSqlTab'
import ArchitectureTiersTab from './tabs/ArchitectureTiersTab'
import MicroservicesTab from './tabs/MicroservicesTab'
import EventDrivenTab from './tabs/EventDrivenTab'
import ShardingReplicationTab from './tabs/ShardingReplicationTab'
import CapAcidTab from './tabs/CapAcidTab'
import CdnTab from './tabs/CdnTab'
import useChromePadding from '../../hooks/useChromePadding'

const tabs = [
  { id: 'welcome', label: 'Welcome', component: WelcomeTab, isWelcome: true },
  { id: 'sql-nosql', label: 'SQL vs NoSQL', component: SqlNoSqlTab },
  { id: 'arch-tiers', label: '2-Tier vs 3-Tier', component: ArchitectureTiersTab },
  { id: 'microservices', label: 'Microservices', component: MicroservicesTab },
  { id: 'event-driven', label: 'Event-Driven', component: EventDrivenTab },
  { id: 'sharding', label: 'Sharding & Replication', component: ShardingReplicationTab },
  { id: 'cap-acid', label: 'CAP & ACID', component: CapAcidTab },
  { id: 'cdn', label: 'CDN', component: CdnTab },
]

function SystemDesignSessionApp() {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('welcome')
  const [headerVisible, setHeaderVisible] = useState(false)
  const lastScrollY = useRef(0)
  const containerRef = useRef(null)
  const chromeRef = useRef(null)
  const isWelcomeTab = activeTab === 'welcome'

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY

      if (isWelcomeTab) {
        if (currentScrollY < lastScrollY.current || currentScrollY > 100) {
          setHeaderVisible(true)
        } else if (currentScrollY <= 50) {
          setHeaderVisible(false)
        }
      } else {
        setHeaderVisible(true)
      }

      lastScrollY.current = currentScrollY
    }

    window.addEventListener('scroll', handleScroll, { passive: true })

    if (!isWelcomeTab) {
      setHeaderVisible(true)
    } else {
      setHeaderVisible(false)
    }

    return () => window.removeEventListener('scroll', handleScroll)
  }, [isWelcomeTab])

  useChromePadding(chromeRef, containerRef, isWelcomeTab)

  const handleTabChange = (tabId) => {
    setActiveTab(tabId)
    window.scrollTo({ top: 0, behavior: 'smooth' })
    if (tabId !== 'welcome') {
      setHeaderVisible(true)
    }
  }

  const handleGetStarted = () => {
    handleTabChange('sql-nosql')
  }

  const ActiveComponent = tabs.find(tab => tab.id === activeTab)?.component || SqlNoSqlTab

  return (
    <div ref={containerRef} className={`app-container ${isWelcomeTab ? 'welcome-active' : ''}`}>
      <div ref={chromeRef} className={`app-chrome ${headerVisible ? 'visible' : 'hidden'}`}>
        <header className="app-header">
          <button className="back-to-menu-btn" onClick={() => navigate('/')}>
            ← Sessions
          </button>
          <div className="header-content">
            <h1 className="app-title">System Design 101 🏗️</h1>
            <p className="app-subtitle">Master the building blocks of scalable systems</p>
          </div>
        </header>

        <TabNavigation
          tabs={tabs}
          activeTab={activeTab}
          onTabChange={handleTabChange}
        />
      </div>

      <main className={`tab-content ${isWelcomeTab ? 'welcome-content-main' : ''}`}>
        {isWelcomeTab ? (
          <ActiveComponent onGetStarted={handleGetStarted} />
        ) : (
          <ActiveComponent />
        )}
      </main>
    </div>
  )
}

export default SystemDesignSessionApp
