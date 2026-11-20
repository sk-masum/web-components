/* tslint:disable */
/* auto-generated angular directive proxies */
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, EventEmitter, Output, NgZone } from '@angular/core';

import { ProxyCmp } from './angular-component-lib/utils';

import type { Components } from '@seakh/ui-core/components';

import { defineCustomElement as defineSkBottomDock } from '@seakh/ui-core/components/sk-bottom-dock.js';
import { defineCustomElement as defineSkSidebarMenu } from '@seakh/ui-core/components/sk-sidebar-menu.js';
@ProxyCmp({
  defineCustomElementFn: defineSkBottomDock,
  inputs: ['activeId', 'floating', 'items', 'navLabel', 'preventNavigation', 'theme']
})
@Component({
  selector: 'sk-bottom-dock',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  // eslint-disable-next-line @angular-eslint/no-inputs-metadata-property
  inputs: ['activeId', 'floating', 'items', 'navLabel', 'preventNavigation', 'theme'],
  outputs: ['skTabSelect'],
})
export class SkBottomDock {
  protected el: HTMLSkBottomDockElement;
  @Output() skTabSelect = new EventEmitter<SkBottomDockCustomEvent<ISkBottomDockSkDockItem>>();
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
  }
}


import type { SkBottomDockCustomEvent } from '@seakh/ui-core/components';
import type { SkDockItem as ISkBottomDockSkDockItem } from '@seakh/ui-core/components';

export declare interface SkBottomDock extends Components.SkBottomDock {
  /**
   * Emitted when a tab is selected
   */
  skTabSelect: EventEmitter<SkBottomDockCustomEvent<ISkBottomDockSkDockItem>>;
}


@ProxyCmp({
  defineCustomElementFn: defineSkSidebarMenu,
  inputs: ['brandAccent', 'brandSubtitle', 'brandTitle', 'closeOnSelect', 'items', 'open', 'placement', 'sectionLabel', 'showTrigger', 'swipeToClose', 'theme', 'variant']
})
@Component({
  selector: 'sk-sidebar-menu',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  // eslint-disable-next-line @angular-eslint/no-inputs-metadata-property
  inputs: ['brandAccent', 'brandSubtitle', 'brandTitle', 'closeOnSelect', 'items', 'open', 'placement', 'sectionLabel', 'showTrigger', 'swipeToClose', 'theme', 'variant'],
  outputs: ['skOpenChange', 'skItemSelect'],
})
export class SkSidebarMenu {
  protected el: HTMLSkSidebarMenuElement;
  @Output() skOpenChange = new EventEmitter<SkSidebarMenuCustomEvent<boolean>>();
  @Output() skItemSelect = new EventEmitter<SkSidebarMenuCustomEvent<ISkSidebarMenuSkSidebarMenuItem>>();
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
  }
}


import type { SkSidebarMenuCustomEvent } from '@seakh/ui-core/components';
import type { SkSidebarMenuItem as ISkSidebarMenuSkSidebarMenuItem } from '@seakh/ui-core/components';

export declare interface SkSidebarMenu extends Components.SkSidebarMenu {
  /**
   * Emitted whenever the drawer opens or closes
   */
  skOpenChange: EventEmitter<SkSidebarMenuCustomEvent<boolean>>;
  /**
   * Emitted when a menu item is clicked
   */
  skItemSelect: EventEmitter<SkSidebarMenuCustomEvent<ISkSidebarMenuSkSidebarMenuItem>>;
}


