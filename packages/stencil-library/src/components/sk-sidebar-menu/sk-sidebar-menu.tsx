import {
    Component,
    Event,
    EventEmitter,
    Host,
    Listen,
    Prop,
    State,
    Watch,
    h,
} from '@stencil/core';

export interface SkSidebarMenuItem {
    id: string;
    label: string;
    description?: string;
    href?: string;
    disabled?: boolean;
    busy?: boolean;
}

@Component({
    tag: 'sk-sidebar-menu',
    styleUrl: 'sk-sidebar-menu.css',
    shadow: true,
})
export class SkSidebarMenu {
    /** Enable horizontal swipe-to-close gesture on touch devices */
    @Prop() swipeToClose: boolean = true;

    /** Color theme: 'dark', 'light', or 'auto' (follows system preference) */
    @Prop({ reflect: true }) theme: 'dark' | 'light' | 'auto' = 'auto';

    /** Side of the screen the drawer slides from */
    @Prop({ reflect: true }) placement: 'right' | 'left' = 'right';

    /** Controls drawer visibility (supports both controlled and internal trigger toggle) */
    @Prop({ mutable: true, reflect: true }) open: boolean = false;

    /** Renders the built-in hamburger trigger button */
    @Prop() showTrigger: boolean = true;

    /** Brand title displayed in the header */
    @Prop() brandTitle: string = 'Workspace';

    /** Optional accent character after brandTitle (e.g. ".") */
    @Prop() brandAccent: string = '.';

    /** Subtitle displayed under the brand title */
    @Prop() brandSubtitle?: string;

    /** Section caption above the navigation items */
    @Prop() sectionLabel: string = 'Manage your workspace';

    /** Visual style: 'compact' (icon + medium text) or 'editorial' (large display text) */
    @Prop() variant: 'compact' | 'editorial' = 'compact';

    /** Navigation items array (optional if using default slot) */
    @Prop() items: SkSidebarMenuItem[] = [];

    /** Automatically close the drawer when an item is selected */
    @Prop() closeOnSelect: boolean = true;

    /** Emitted whenever the drawer opens or closes */
    @Event() skOpenChange!: EventEmitter<boolean>;

    /** Emitted when a menu item is clicked */
    @Event() skItemSelect!: EventEmitter<SkSidebarMenuItem>;

    /** Keeps the drawer in the DOM until the exit animation completes */
    @State() isRendered: boolean = false;

    /** Applies exit animation classes while closing */
    @State() isClosing: boolean = false;

    @State() dragOffset: number = 0;
    @State() isDragging: boolean = false;

    private overlayEl?: HTMLElement;
    private panelEl?: HTMLElement;
    private closeTimer?: ReturnType<typeof setTimeout>;
    private touchStartX = 0;
    private touchStartY = 0;
    private touchStartTime = 0;
    private swipeLocked: 'horizontal' | 'vertical' | null = null;

    componentWillLoad() {
        if (this.open) {
            this.isRendered = true;
        }
    }

    componentDidRender() {
        if (this.isRendered && this.overlayEl) {
            this.syncTopLayer(true);
        }
    }

    private syncTopLayer(show: boolean) {
        const el = this.overlayEl as
            | (HTMLElement & {
                showPopover?: () => void;
                hidePopover?: () => void;
            })
            | undefined;

        if (!el || typeof el.showPopover !== 'function') return;

        try {
            const isTopLayer = el.matches(':popover-open');
            if (show && !isTopLayer) {
                el.showPopover();
            } else if (!show && isTopLayer) {
                el.hidePopover();
            }
        } catch {
            // Ignore if element is already disconnected or in a non-browser test env
        }
    }

    @Watch('open')
    onOpenChange(isOpen: boolean) {
        if (this.closeTimer) {
            clearTimeout(this.closeTimer);
            this.closeTimer = undefined;
        }

        if (typeof document !== 'undefined') {
            document.body.style.overflow = isOpen ? 'hidden' : '';
        }

        if (isOpen) {
            this.isClosing = false;
            this.isRendered = true;
            return;
        }

        if (this.isRendered) {
            this.isClosing = true;
            const prefersReducedMotion =
                typeof window !== 'undefined' &&
                window.matchMedia('(prefers-reduced-motion: reduce)').matches;

            this.closeTimer = setTimeout(
                () => {
                    this.syncTopLayer(false);
                    this.isRendered = false;
                    this.isClosing = false;
                    this.closeTimer = undefined;
                },
                prefersReducedMotion ? 0 : 260,
            );
        }
    }

    disconnectedCallback() {
        if (this.closeTimer) {
            clearTimeout(this.closeTimer);
        }
        this.syncTopLayer(false);
        if (typeof document !== 'undefined') {
            document.body.style.overflow = '';
        }
    }

    @Listen('keydown', { target: 'window' })
    handleKeyDown(ev: KeyboardEvent) {
        if (ev.key === 'Escape' && this.open) {
            this.setOpen(false);
        }
    }

    private handleTouchStart = (ev: TouchEvent) => {
        if (!this.swipeToClose || this.isClosing || ev.touches.length !== 1) return;

        const touch = ev.touches[0];
        this.touchStartX = touch.clientX;
        this.touchStartY = touch.clientY;
        this.touchStartTime = Date.now();
        this.swipeLocked = null;
    };

    private handleTouchMove = (ev: TouchEvent) => {
        if (!this.swipeToClose || this.isClosing || ev.touches.length !== 1) return;

        const touch = ev.touches[0];
        const deltaX = touch.clientX - this.touchStartX;
        const deltaY = touch.clientY - this.touchStartY;

        // Lock gesture axis after 8px of movement so vertical scrolling isn't hijacked
        if (!this.swipeLocked) {
            if (Math.abs(deltaX) < 8 && Math.abs(deltaY) < 8) return;
            this.swipeLocked = Math.abs(deltaX) > Math.abs(deltaY) ? 'horizontal' : 'vertical';
        }

        if (this.swipeLocked === 'vertical') return;

        // Only allow dragging toward the closing edge
        const isClosingDirection = this.placement === 'left' ? deltaX < 0 : deltaX > 0;
        if (!isClosingDirection) {
            this.dragOffset = 0;
            return;
        }

        this.isDragging = true;
        this.dragOffset = deltaX;
    };

    private handleTouchEnd = () => {
        if (!this.isDragging) {
            this.swipeLocked = null;
            return;
        }

        const panelWidth = this.panelEl?.offsetWidth || 320;
        const elapsed = Math.max(Date.now() - this.touchStartTime, 1);
        const velocity = Math.abs(this.dragOffset) / elapsed;

        const shouldClose = Math.abs(this.dragOffset) > panelWidth * 0.3 || velocity > 0.5;

        this.isDragging = false;
        this.swipeLocked = null;
        this.dragOffset = 0;

        if (shouldClose) {
            this.setOpen(false);
        }
    };

    private setOpen(next: boolean) {
        if (this.open === next) return;
        this.open = next;
        this.skOpenChange.emit(next);
    }

    private handleItemClick(item: SkSidebarMenuItem, ev: MouseEvent) {
        if (item.disabled || item.busy) {
            ev.preventDefault();
            return;
        }
        this.skItemSelect.emit(item);
        if (this.closeOnSelect) {
            this.setOpen(false);
        }
    }

    private renderMenuIcon() {
        return (
            <svg class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                <line x1="4" y1="6" x2="20" y2="6" />
                <line x1="4" y1="12" x2="20" y2="12" />
                <line x1="4" y1="18" x2="20" y2="18" />
            </svg>
        );
    }

    private renderCloseIcon() {
        return (
            <svg class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
        );
    }

    private renderArrowIcon() {
        if (this.variant === 'editorial') {
            return (
                <svg class="sk-item-arrow h-5 w-5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                    <line x1="5" y1="12" x2="19" y2="12" />
                    <polyline points="12 5 19 12 12 19" />
                </svg>
            );
        }
        return (
            <svg class="sk-item-arrow h-6 w-6 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                <polyline points="9 18 15 12 9 6" />
            </svg>
        );
    }

    render() {
        const isEditorial = this.variant === 'editorial';

        return (
            <Host>
                {this.showTrigger && (
                    <slot name="trigger">
                        <button
                            type="button"
                            part="trigger"
                            class="sk-trigger inline-flex h-10 w-10 cursor-pointer items-center justify-center rounded-xl transition-all duration-200 ease-out"
                            aria-label="Open workspace menu"
                            aria-haspopup="dialog"
                            aria-expanded={String(this.open)}
                            onClick={() => this.setOpen(true)}
                        >
                            {this.renderMenuIcon()}
                        </button>
                    </slot>
                )}

                {this.isRendered && (
                    <div
                        ref={(el) => (this.overlayEl = el)}
                        popover="manual"
                        class="sk-overlay"
                        role="dialog"
                        aria-modal="true"
                        aria-label={this.brandTitle}
                    >
                        {/* Backdrop */}
                        <div
                            part="backdrop"
                            class={`sk-backdrop backdrop-blur-sm ${this.isClosing ? 'sk-backdrop-out' : 'sk-backdrop-in'
                                }`}
                            style={{ background: 'var(--sk-sidebar-backdrop)' }}
                            onClick={() => this.setOpen(false)}
                        />

                        {/* Slide-over Panel */}
                        <aside
                            ref={(el) => (this.panelEl = el)}
                            part="panel"
                            class={`sk-panel z-10 flex w-full flex-col shadow-2xl ${this.placement === 'left' ? 'left-0' : 'right-0'
                                } ${this.isDragging
                                    ? 'sk-panel-dragging'
                                    : this.isClosing
                                        ? 'sk-panel-out'
                                        : 'sk-panel-in'
                                }`}
                            style={
                                this.isDragging
                                    ? { transform: `translateX(${this.dragOffset}px)` }
                                    : undefined
                            }
                            onTouchStart={this.handleTouchStart}
                            onTouchMove={this.handleTouchMove}
                            onTouchEnd={this.handleTouchEnd}
                            onTouchCancel={this.handleTouchEnd}
                        >
                            {/* Header */}
                            <header
                                part="header"
                                class="sk-header flex items-center justify-between px-6 pb-6"
                            >
                                <slot name="header">
                                    <div>
                                        <h2 class="sk-brand-title text-2xl font-bold tracking-tight text-left">
                                            {this.brandTitle}
                                            {this.brandAccent && (
                                                <span class="sk-accent" aria-hidden="true">
                                                    {this.brandAccent}
                                                </span>
                                            )}
                                        </h2>
                                        {this.brandSubtitle && (
                                            <p class="sk-muted mt-1.5 text-[11px] uppercase tracking-[0.14em]">
                                                {this.brandSubtitle}
                                            </p>
                                        )}
                                    </div>
                                </slot>

                                <button
                                    type="button"
                                    part="close-button"
                                    class="sk-close-btn cursor-pointer rounded-full p-2 transition-colors"
                                    aria-label="Close menu"
                                    onClick={() => this.setOpen(false)}
                                >
                                    {this.renderCloseIcon()}
                                </button>
                            </header>

                            {/* Main Scrollable Content */}
                            <div part="body" class="sk-body flex-1 overflow-y-auto px-6 py-8">
                                {this.sectionLabel && (
                                    <p class="sk-muted mb-8 text-[11px] font-semibold uppercase tracking-[0.14em] text-left">
                                        {this.sectionLabel}
                                    </p>
                                )}

                                {this.items.length > 0 && (
                                    <nav
                                        aria-label="Workspace navigation"
                                        class={isEditorial ? 'flex flex-col' : 'space-y-7'}
                                    >
                                        {this.items.map((item, index) => {
                                            const Tag = item.href ? 'a' : 'button';
                                            const commonProps = {
                                                key: item.id,
                                                part: 'item',
                                                class: `sk-item ${isEditorial ? 'sk-item-editorial py-4' : 'sk-item-compact'
                                                    } group flex w-full items-center justify-between gap-4 text-left`,
                                                style: { animationDelay: `${80 + index * 60}ms` },
                                                'aria-busy': item.busy ? 'true' : undefined,
                                                onClick: (ev: MouseEvent) => this.handleItemClick(item, ev),
                                            };

                                            const inner = (
                                                <div class="flex min-w-0 flex-1 items-start gap-4">
                                                    <slot name={`icon-${item.id}`} />
                                                    <div class="min-w-0 flex-1 -mt-1">
                                                        <span
                                                            class={
                                                                isEditorial
                                                                    ? 'sk-item-label block text-[clamp(30px,9vw,44px)] leading-tight font-normal tracking-[-0.05em]'
                                                                    : 'sk-item-label block text-2xl font-normal'
                                                            }
                                                        >
                                                            {item.label}
                                                        </span>
                                                        {item.description && (
                                                            <span class="sk-muted mt-1.5 block text-xs leading-relaxed">
                                                                {item.description}
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                            );

                                            return Tag === 'a' ? (
                                                <a
                                                    {...commonProps}
                                                    href={item.href}
                                                    aria-disabled={item.disabled ? 'true' : undefined}
                                                >
                                                    {inner}
                                                    {this.renderArrowIcon()}
                                                </a>
                                            ) : (
                                                <button
                                                    {...commonProps}
                                                    type="button"
                                                    disabled={item.disabled || item.busy}
                                                >
                                                    {inner}
                                                    {this.renderArrowIcon()}
                                                </button>
                                            );
                                        })}
                                    </nav>
                                )}

                                {/* Optional custom body slot */}
                                <slot />
                            </div>

                            {/* Footer Slot */}
                            <footer part="footer" class="sk-footer px-6 py-5">
                                <slot name="footer" />
                            </footer>
                        </aside>
                    </div>
                )}
            </Host>
        );
    }
}