import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { Subscription } from 'rxjs';
import { Menu, adminMenu } from 'config/menu-config';

@Component({
  selector: 'app-admin-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent implements OnInit, OnDestroy {
  currentUrl: string;
  menuConfig: Menu[] = adminMenu;
  routerSubscribe: Subscription;

  constructor(private router: Router) {}

  ngOnInit() {
    this.currentUrl = this.router.url;
    this.routerSubscribe = this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        this.currentUrl = event.urlAfterRedirects || event.url;
      });
  }

  ngOnDestroy() {
    this.routerSubscribe.unsubscribe();
  }

  trackByMenu(index: number): number {
    return index;
  }

  handleClickMenu(url: string): void {
    this.router.navigateByUrl(url);
  }
}
