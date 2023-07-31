import { Component,Input } from "@angular/core";
import {LoaderService} from '../services/loader.service'


@Component({
    selector:'loader',
    templateUrl:'./loader.component.html',
    styleUrls:['./loader.component.css']
})
export class LoaderComponent{
    @Input() loading: boolean;
imgurl='../assets/images/88.svg'
    constructor(private loaderService: LoaderService) {
  
      this.loaderService.isLoading.subscribe((v) => {

        this.loading = v;
      });
  
    }
    ngOnInit() {
    }
}