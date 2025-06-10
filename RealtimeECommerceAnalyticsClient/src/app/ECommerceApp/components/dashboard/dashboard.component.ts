import {Component, OnDestroy, OnInit} from '@angular/core';
import {RealtimeService} from '../../services/realtime.service';
import {DashboardService} from '../../services/dashboard.service';
import {Subject, takeUntil, tap} from 'rxjs';
import {AggregatedResponse} from '../../models/aggregated-response';
import {MenuItem} from 'primeng/api';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  standalone: false
})
export class DashboardComponent implements OnInit, OnDestroy {

  destroy$: Subject<void> = new Subject<void>();
  onDataUpdated$: Subject<void> = new Subject<void>();

  items: MenuItem[] = [
    { label: 'Crypto', icon: 'pi pi-user-plus', routerLink: './crypto' },
    { label: 'Fake-store', icon: 'pi pi-user-plus', routerLink: './fake-store' },
    { label: 'Dummy', icon: 'pi pi-user-plus', routerLink: './dummy' },
    { label: 'Food', icon: 'pi pi-user-plus', routerLink: './open-food' },
    { label: 'Library', icon: 'pi pi-user-plus', routerLink: './open-library' },
  ];

  activeItem: MenuItem = this.items[0];

  public aggregatedData!: AggregatedResponse;
  public dataLoading: boolean = true;

  constructor(
    private realtimeService: RealtimeService,
    private dashboardService: DashboardService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  ngOnInit(): void {
    this.loadDashboardData();

    this.realtimeService.dataUpdated$
      .subscribe(() => {
        const current = this.items.find(i => this.router.url.includes(i.routerLink!));
        if (current) {
          this.activeItem = current;
        }

        this.loadDashboardData(); // метод, який оновлює графіки
    });
  }


  private loadDashboardData() {
    this.dataLoading = true

    this.dashboardService.getDashboardData()
      .pipe(takeUntil(this.destroy$))
      .subscribe(res => {
        this.aggregatedData = res;

        this.onDataUpdated$.next();

        this.dataLoading = false;
      })
  }

  onTabChange(item: MenuItem) {
    this.router.navigate([item.routerLink!], { relativeTo: this.route });  }
}
