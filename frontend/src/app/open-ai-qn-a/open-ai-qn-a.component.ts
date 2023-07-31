import { Component, OnInit } from '@angular/core';
import {OpenAiService} from '../services/open-ai.service';

@Component({
  selector: 'app-open-ai-qn-a',
  templateUrl: './open-ai-qn-a.component.html',
  styleUrls: ['./open-ai-qn-a.component.css']
})
export class OpenAIQnAComponent implements OnInit {
  question:string = "";
  constructor(private OpenAIService: OpenAiService) { }

  submitQuestion() {
    this.OpenAIService.getAnswerQnA(this.question).subscribe(response => {
      console.log(response);
    })
  }

  ngOnInit(): void {
  }

}
