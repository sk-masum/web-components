import {
    Component,
    Event,
    EventEmitter,
    Host,
    Prop,
    h,
  } from '@stencil/core';
  
  export interface SkDockItem {
    id: string;
    label: string;
    href?: string;
    disabled?: boolean;
    badge?: string | number;
  }
  
  @Component({
    tag: 'sk-bottom-dock',
    styleUrl: 'sk-bottom-dock.css',
    shadow: true,
  })
  export class SkBottomDock {
    /** Color theme: 'dark', 'light', or 'auto' (follows system preference) */
    @Prop({ reflect: true }) theme: 'dark' | 'light' | 'auto' = 'auto';
  
    /** Navigation items to render in the dock */
    @Prop() items: SkDockItem[] = [];
  
    /** ID of the currently active tab */
    @Prop({ mutable: true, reflect: true }) activeId?: string;
  
    /** Accessible label for the <nav> landmark */
    @Prop() navLabel: string = 'Main navigation';
  
    /** Fixes the dock to the bottom of the viewport with safe-area padding */
    @Prop({ reflect: true }) floating: boolean = true;
  
    /** Prevents default <a> navigation so SPA routers (Angular/Next.js) handle routing */
    @Prop() preventNavigation: boolean = true;
  
    /** Emitted when a tab is selected */
    @Event() skTabSelect!: EventEmitter<SkDockItem>;
  
    private handleSelect(item: SkDockItem, ev: MouseEvent) {
      if (item.disabled) {
        ev.preventDefault();
        return;
      }
  
      if (
        item.href &&
        this.preventNavigation &&
        !ev.metaKey &&
        !ev.ctrlKey &&
        !ev.shiftKey &&
        !ev.altKey
      ) {
        ev.preventDefault();
      }
  
      this.activeId = item.id;
      this.skTabSelect.emit(item);
    }
  
    render() {
      return (
        <Host>
          <nav
            part="nav"
            class={`sk-safe-nav box-border w-full pointer-events-none ${
              this.floating ? 'fixed inset-x-0 bottom-0' : ''
            }`}
            aria-label={this.navLabel}
          >
            <div
              part="dock"
              class="sk-glass-dock pointer-events-auto mx-auto box-border flex w-full rounded-[36px] p-1.5"
            >
              {this.items.map((item) => {
                const isActive = this.activeId === item.id;
                const commonProps = {
                  key: item.id,
                  part: isActive ? 'tab tab-active' : 'tab',
                  class: `sk-dock-tab relative flex min-h-[44px] min-w-0 flex-1 cursor-pointer flex-col items-center justify-center gap-[3px] rounded-[28px] border-0 bg-transparent px-1.5 py-1.5 no-underline transition-[background-color,color,box-shadow] duration-[180ms] ease-out ${
                    isActive ? 'is-active' : ''
                  }`,
                  'aria-current': isActive ? 'page' : undefined,
                  'aria-disabled': item.disabled ? 'true' : undefined,
                  onClick: (ev: MouseEvent) => this.handleSelect(item, ev),
                };
  
                const content = (
                  <div class="relative flex min-w-0 max-w-full flex-col items-center justify-center gap-[3px]">
                    <span
                      part="icon"
                      class="inline-flex items-center justify-center text-[22px] leading-none"
                      aria-hidden="true"
                    >
                      <slot name={`icon-${item.id}`} />
                    </span>
                    <span
                      part="label"
                      class="max-w-full truncate text-[11px] font-semibold leading-[14px]"
                    >
                      {item.label}
                    </span>
                    {item.badge !== undefined && item.badge !== '' && (
                      <span
                        part="badge"
                        class="sk-dock-badge absolute -top-1 -right-2 h-4 min-w-4 rounded-full px-1 text-center text-[10px] font-bold leading-4"
                      >
                        {item.badge}
                      </span>
                    )}
                  </div>
                );
  
                return item.href ? (
                  <a {...commonProps} href={item.href}>
                    {content}
                  </a>
                ) : (
                  <button {...commonProps} type="button" disabled={item.disabled}>
                    {content}
                  </button>
                );
              })}
            </div>
          </nav>
        </Host>
      );
    }
  }