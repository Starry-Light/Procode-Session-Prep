import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import TabNavigation from './components/TabNavigation'
import WelcomeTab from './tabs/WelcomeTab'
import SetupTab from './tabs/SetupTab'
import WhyReactTab from './tabs/WhyReactTab'
import JSXComponentsTab from './tabs/JSXComponentsTab'
import PropsTab from './tabs/PropsTab'
import StateTab from './tabs/StateTab'
import LogicControlTab from './tabs/LogicControlTab'
import EffectsTab from './tabs/EffectsTab'
import useChromePadding from '../../hooks/useChromePadding'

const tabs = [
  { id: 'welcome', label: 'Welcome', component: WelcomeTab, isWelcome: true },
  { id: 'setup', label: 'Setup', component: SetupTab },
  { id: 'why', label: 'The "Why"', component: WhyReactTab },
  { id: 'jsx', label: 'JSX & Components', component: JSXComponentsTab },
  { id: 'props', label: 'Props', component: PropsTab },
  { id: 'state', label: 'State', component: StateTab },
  { id: 'logic', label: 'Logic & Control', component: LogicControlTab },
  { id: 'effects', label: 'Effects', component: EffectsTab },
]

function ReactSessionApp() {
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
        // On welcome tab: show header when scrolling up or past threshold
        if (currentScrollY < lastScrollY.current || currentScrollY > 100) {
          setHeaderVisible(true)
        } else if (currentScrollY <= 50) {
          setHeaderVisible(false)
        }
      } else {
        // On other tabs: always show header
        setHeaderVisible(true)
      }
      
      lastScrollY.current = currentScrollY
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    
    // Set initial state
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
    handleTabChange('setup')
  }

  const ActiveComponent = tabs.find(tab => tab.id === activeTab)?.component || SetupTab

  return (
    <div ref={containerRef} className={`app-container ${isWelcomeTab ? 'welcome-active' : ''}`}>
      <div ref={chromeRef} className={`app-chrome ${headerVisible ? 'visible' : 'hidden'}`}>
        <header className="app-header">
          <button className="back-to-menu-btn" onClick={() => navigate('/')}>
            ← Sessions
          </button>
          <div className="header-content">
            <h1 className="app-title">Learn React ⚛️</h1>
            <p className="app-subtitle">An interactive journey through React fundamentals</p>
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

export default ReactSessionApp
