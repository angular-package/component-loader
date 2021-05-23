import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'lib-component-loader',
  template: `
    <p>
      component-loader works!
    </p>
  `,
  styles: [
  ]
})
export class ComponentLoaderComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
