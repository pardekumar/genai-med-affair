import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router} from '@angular/router';

@Component({
  selector: 'app-open-ai',
  templateUrl: './open-ai.component.html',
  styleUrls: ['./open-ai.component.css']
})
export class OpenAiComponent implements OnInit {
  isPLS:boolean = false;

  constructor(private route: ActivatedRoute, private router: Router) {
   }

  ngOnInit(): void {
  }

  home(){
    this.isPLS = false;
    this.router.navigate(['home'], {relativeTo:this.route});
  }
  pls(){
      this.isPLS = true;
      this.router.navigate(['pls'], {relativeTo:this.route});
  }
  knowledgeBase(){
    this.isPLS = false;
    this.router.navigate(['knowledge-base'], {relativeTo:this.route});
  }
  QnA(){
    this.isPLS = false;
    this.router.navigate(['QnA'], {relativeTo:this.route});
  }

  routeToHome() {
    this.router.navigate(["dashboard"]);
  }

}
