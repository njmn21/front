import { Component } from '@angular/core';
import { FloatLabelModule } from "primeng/floatlabel"
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-hito',
  imports: [FloatLabelModule, InputTextModule, FormsModule],
  templateUrl: './hito.html',
  styleUrl: './hito.css'
})
export class Hito {
  value: string | undefined;
}
