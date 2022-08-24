import { Component, Inject, OnInit } from '@angular/core'
import { FormBuilder } from '@angular/forms'
import { UntilDestroy } from '@ngneat/until-destroy'
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog'

@UntilDestroy()
@Component({
  selector: 'app-search-bar',
  templateUrl: './search-bar.component.html',
  styleUrls: ['./search-bar.component.scss']
})
export class SearchBarComponent implements OnInit {

  search = this.fb.control('')

  constructor(
    private dialogRef: MatDialogRef<SearchBarComponent>,
    @Inject(MAT_DIALOG_DATA) private data: string,
    private fb: FormBuilder
  ) { }

  ngOnInit(): void {
    this.search.setValue(this.data, { emitEvent: false })
  }

  onEnter() {
    this.dialogRef.close(this.search.value ?? '')
  }



}
