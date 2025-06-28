import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { BaseUiComponent } from './base-ui/base-ui.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, BaseUiComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'tsi33a-angular-bravo';
}
