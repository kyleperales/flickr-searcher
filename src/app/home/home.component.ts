import { Component, Input, OnInit } from '@angular/core'
import { MatDialog } from '@angular/material/dialog'
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy'
import { BehaviorSubject, combineLatest, iif, Observable, startWith, Subject, switchMap, tap } from 'rxjs'
import { DetailViewComponent } from './detail-view/detail-view.component'
import { IFlickrImage, HomeService, IImageData } from './home.service'

@UntilDestroy()
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  searchSubject = new Subject<void>()
  private searchTextSubject = new BehaviorSubject<string>('')
  searchText$ = this.searchTextSubject.asObservable()

  private imagesSubject = new BehaviorSubject<IImageData[]>([])
  images$ = this.imagesSubject.asObservable()

  @Input() set searchText(value: string) {
    this.searchTextSubject.next(value)
    this.homeService.page = 1
  }

  constructor(
    private homeService: HomeService,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    combineLatest([
      this.searchText$.pipe(startWith(this.searchTextSubject.getValue()), tap(() => this.imagesSubject.next([]))),
      this.searchSubject.asObservable().pipe(startWith(''))
    ])
    .pipe(
      untilDestroyed(this),
      switchMap(([searchText, _]) => this.getImages(searchText))
    )
    .subscribe(images => this.setImages(images))
  }

  public onScroll(): void {
    this.searchSubject.next()
    this.homeService.page++
  }

  public identity(index: number, item: IFlickrImage) {
    return item.id
  }

  private getImages(text: string): Observable<IFlickrImage[]> {
    return iif(() => !!text.length,
      this.homeService.getSearchedImages(text),
      this.homeService.getRecentPictures()
    )
  }

  private setImages(images) {
    const currentImages = this.imagesSubject.getValue()
    this.imagesSubject.next([...currentImages, ...images])
  }

  public getInfo(id: string){
    this.homeService.getImageInfo(id)
      .subscribe(details => {
        const dialogRef = this.dialog.open(DetailViewComponent, {
          width: 'auto',
          data: {
            details,
            url: this.imagesSubject.value.find(e => e.id === id).url,
          },
        })
      })
}
}
