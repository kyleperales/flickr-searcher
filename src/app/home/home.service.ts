import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { map, Observable, tap } from 'rxjs'
import { environment } from 'src/environments/environment'

export interface IFlickrImage {
  farm: string
  id: string
  secret: string
  server: string
  title: string
}

export interface IImageInfo {
  owner: {
    username: string
    realname: string
  }
  title: string
  description: string
  date: {
    posted: string
  }
}

export interface IFlickrOutput {
  photos: {
    photo: IFlickrImage[]
  }
}

export interface IImageData {
  id: string
  url: string
  title: string
}

@Injectable({
  providedIn: 'root'
})
export class HomeService {

  public page = 1

  constructor(
    private httpClient: HttpClient
  ) { }

  getSearchedImages(text: string) {
    const url = 'https://www.flickr.com/services/rest/?method=flickr.photos.search&'
    const params = `api_key=${environment.flickr.key}&text=${text}&format=json&nojsoncallback=1&per_page=18&page=${this.page}`
    return this.httpClient.get(url + params)
      .pipe(
        map((res: any) => {
          const images: any = []
          res.photos.photo.forEach((ph: IFlickrImage) => {
            const image = {
              id: ph.id,
              url: `https://live.staticflickr.com/${ph.server}/${ph.id}_${ph.secret}`,
              title: ph.title
            }
            images.push(image)
          })
          return images
        })
      )
  }

  getRecentPictures() {
    const url = 'https://www.flickr.com/services/rest/?method=flickr.photos.getRecent&'
    const params = `api_key=${environment.flickr.key}&format=json&nojsoncallback=1&per_page=18&page=${this.page}`
    return this.httpClient.get(url + params)
      .pipe(
        map((res: any) => {
          const urlArr: any = []
          res.photos.photo.forEach((ph: IFlickrImage) => {
            const photoObj = {
              id: ph.id,
              url: `https://live.staticflickr.com/${ph.server}/${ph.id}_${ph.secret}`,
              title: ph.title
            }
            urlArr.push(photoObj)
          })
          return urlArr
        })
      )
  }

  getImageInfo(id: string) {
    const url = 'https://www.flickr.com/services/rest/?method=flickr.photos.getInfo&'
    const params = `api_key=${environment.flickr.key}&format=json&nojsoncallback=1&photo_id=${id}`
    return this.httpClient.get(url + params)
      .pipe(
        map((res: any) => {
            return {
              url: res.photo.url,
              owner: res.photo.owner,
              title: res.photo.title._content,
              description: res.photo.description._content,
              date: res.photo.dates.posted
            }
        })
      )
  }
}
