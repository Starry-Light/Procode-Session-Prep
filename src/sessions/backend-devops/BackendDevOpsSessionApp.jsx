import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import TabNavigation from './components/TabNavigation'
import WelcomeTab from './tabs/WelcomeTab'
import WhatHappensTab from './tabs/WhatHappensTab'
import JWTOAuthTab from './tabs/JWTOAuthTab'
import ArchitectureTab from './tabs/ArchitectureTab'
import WhyDockerTab from './tabs/WhyDockerTab'
import MLOpsTab from './tabs/MLOpsTab'
import DockerSetupTab from './tabs/DockerSetupTab'
import useChromePadding from '../../hooks/useChromePadding'

const tabs = [
  { id: 'welcome', label: 'Welcome', component: WelcomeTab, isWelcome: true },
  { id: 'what-happens', label: 'What Happens When...', component: WhatHappensTab },
  { id: 'jwt-oauth', label: 'JWT & OAuth', component: JWTOAuthTab },
  { id: 'architecture', label: 'Modern Architecture', component: ArchitectureTab },
  { id: 'why-docker', label: 'Why Docker?', component: WhyDockerTab },
  { id: 'using-docker', label: 'Using Docker', component: DockerSetupTab },
  { id: 'mlops', label: 'MLOps', component: MLOpsTab },
]

function BackendDevOpsSessionApp() {
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
    handleTabChange('what-happens')
  }

  const ActiveComponent = tabs.find(tab => tab.id === activeTab)?.component || WhatHappensTab

  return (
    <div ref={containerRef} className={`app-container ${isWelcomeTab ? 'welcome-active' : ''}`}>
      <div ref={chromeRef} className={`app-chrome ${headerVisible ? 'visible' : 'hidden'}`}>
        <header className="app-header">
          <button className="back-to-menu-btn" onClick={() => navigate('/')}>
            ← Sessions
          </button>
          <div className="header-content">
            <h1 className="app-title">Backend & DevOps 🚀</h1>
            <p className="app-subtitle">Understanding how the web works under the hood</p>
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

export default BackendDevOpsSessionApp
