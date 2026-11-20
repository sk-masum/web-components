'use client';

import { useState } from 'react';
import { SkSidebarMenu } from 'react-library';
import 'stencil-library/styles';

const items = [
  { id: 'dashboard', label: 'Dashboard', description: 'View your overview', href: '#dashboard' },
  { id: 'cards', label: 'Cards', description: 'Manage your cards', href: '#cards' },
  { id: 'settings', label: 'Settings', description: 'Configure preferences', disabled: true },
];

export function SidebarTest() {
  const [lastEvent, setLastEvent] = useState<string>('None yet');
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div
      style={{
        padding: '2rem',
        // Test Shadow DOM theme override
        ['--sk-sidebar-accent' as string]: '#38bdf8',
        ['--sk-sidebar-bg' as string]: '#0f172a',
      }}
    >
        <button type="button" onClick={() => setIsOpen(true)}>
        Open Menu
      </button>
        
      <SkSidebarMenu
        open={isOpen}
        brandTitle="Sk Wallet"
        brandSubtitle="wallet to manage card, ids, creds."
        variant="compact"
        theme="auto"
        items={items}
        onSkOpenChange={(e) => setIsOpen(e.detail)}
        onSkItemSelect={(e) => setLastEvent(`Selected: ${e.detail.id} (${e.detail.label})`)}
      >
        {/* Test named icon slots */}
        <span slot="icon-dashboard" aria-hidden="true">📊</span>
        <span slot="icon-cards" aria-hidden="true">💳</span>
        <span slot="icon-settings" aria-hidden="true">⚙️</span>

        {/* Test footer slot */}
        <div slot="footer" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
          <div>
            <div style={{ fontSize: '0.875rem', fontWeight: 500 }}>Sk Masum</div>
            <div style={{ fontSize: '0.75rem', opacity: 0.7 }}>test@example.com</div>
          </div>
          <button
            type="button"
            onClick={() => setLastEvent('Footer logout clicked')}
            style={{ padding: '0.4rem 0.75rem', borderRadius: '0.5rem', background: 'rgba(244,63,94,0.15)', color: '#fb7185' }}
          >
            Logout
          </button>
        </div>
      </SkSidebarMenu>

      <p style={{ marginTop: '1rem', fontSize: '0.875rem' }}>
        <strong>Last event:</strong> {lastEvent}
      </p>
    </div>
  );
}