import { Component } from '@angular/core'
import { MatDialog } from '@angular/material/dialog'
import { SearchBarComponent } from './search-bar/search-bar.component'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'flickr-viewer'
  searchedText: string = ''

  constructor(private dialog: MatDialog) { }

  openSearchDialog() {
    const dialogRef = this.dialog.open(SearchBarComponent, {
      width: '250px',
      data: this.searchedText,
    })

    dialogRef.afterClosed().subscribe(result => {
      if (result?.length) {
        this.searchedText = result
      }
    })
  }
}
