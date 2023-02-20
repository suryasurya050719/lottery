import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-aside',
  templateUrl: './aside.component.html',
  styleUrls: ['./aside.component.css'],
})
export class AsideComponent implements OnInit {
  constructor() {}
  userName: string | null = '';
  ngOnInit(): void {
    this.userName = localStorage.getItem('lottryname');
  }
}
