import { useState } from 'react';
import { SkBottomDock, SkSidebarMenu } from '@seakh/ui-react';
import '@seakh/ui-core/styles.css';

const sidebarItems = [
  { id: 'dashboard', label: 'Dashboard', description: 'View your overview', href: '/' },
  { id: 'cards', label: 'Cards', description: 'Manage your cards', href: '/card' },
  { id: 'docs', label: 'Documents', description: 'View your documents', href: '/doc' },
  { id: 'creds', label: 'Credentials', description: 'Manage credentials', href: '/credential' },
];

const dockItems = [
  { id: 'dashboard', label: 'Dashboard', href: '/dashboard' },
  { id: 'materials', label: 'Materials', href: '/materials' },
  { id: 'transactions', label: 'Transactions', href: '/transactions', badge: 3 },
  { id: 'works', label: 'Projects', href: '/works' },
];

export default function App() {
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState('');
  const [activeTab, setActiveTab] = useState('dashboard');

  return (
    <main style={{ padding: '2rem 2rem 6rem', fontFamily: 'system-ui, sans-serif' }}>
      <h1>React Demo</h1>
      <p>Sidebar selected: {selected || 'None'}</p>
      <p>Active dock tab: {activeTab}</p>

      <SkSidebarMenu
        brandTitle="Sk Wallet"
        brandSubtitle="Local React Test"
        sectionLabel="Manage your workspace"
        variant="compact"
        theme="auto"
        placement="right"
        open={isOpen}
        items={sidebarItems}
        onSkOpenChange={(e) => setIsOpen(e.detail)}
        onSkItemSelect={(e) => {
          setSelected(e.detail.label);
          setIsOpen(false);
        }}
      >
        <div slot="footer" style={{ fontSize: '0.875rem', opacity: 0.75 }}>
          Local workspace build
        </div>
      </SkSidebarMenu>

      <SkBottomDock
        theme="auto"
        items={dockItems}
        activeId={activeTab}
        onSkTabSelect={(e) => setActiveTab(e.detail.id)}
      >
        <svg slot="icon-dashboard" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" />
          <rect x="14" y="14" width="7" height="7" /><rect x="3" y="14" width="7" height="7" />
        </svg>
        <svg slot="icon-materials" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
        </svg>
        <svg slot="icon-transactions" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M16 3l4 4-4 4" /><path d="M20 7H4" />
          <path d="M8 21l-4-4 4-4" /><path d="M4 17h16" />
        </svg>
        <svg slot="icon-works" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M2 20h20" /><path d="M5 20V8l7-4 7 4v12" />
        </svg>
      </SkBottomDock>
    </main>
  );
}