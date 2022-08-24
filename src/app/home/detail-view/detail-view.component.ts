import { Component, Inject, OnInit } from '@angular/core'
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { IImageInfo } from '../home.service';

@Component({
  selector: 'app-detail-view',
  templateUrl: './detail-view.component.html',
  styleUrls: ['./detail-view.component.scss']
})
export class DetailViewComponent implements OnInit {

  owner: any

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: {url: string, details: IImageInfo}
  ) {
    this.owner = data.details.owner.realname ?? data.details.owner.username
  }

  ngOnInit(): void {
    console.log(this.data)
  }

  openFullImage(url: string) {
    window.open(url + '_b.jpg', '_blank')
  }

}
