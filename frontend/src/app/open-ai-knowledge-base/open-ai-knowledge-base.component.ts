import { Component, OnInit } from '@angular/core';
import {OpenAiService} from '../services/open-ai.service';

@Component({
  selector: 'app-open-ai-knowledge-base',
  templateUrl: './open-ai-knowledge-base.component.html',
  styleUrls: ['./open-ai-knowledge-base.component.css']
})
export class OpenAIKnowledgeBaseComponent implements OnInit {

  constructor(private OpenAIService: OpenAiService) { }

  files: any[] = [];

  loadData() {
    //todo
    console.log(this.files);
    this.OpenAIService.loadData(this.files).subscribe(response => {
      console.log(response);
    })

  }

    /**
   * Delete file from files list
   * @param index (File index)
   */
    deleteFile(index: number) {
      this.files.splice(index, 1);
    }

  /**
   * on file drop handler
   */
  onFileDropped($event) {
    this.prepareFilesList($event);
  }

  /**
   * handle file from browsing
   */
  fileBrowseHandler(files) {
    this.prepareFilesList(files);
  }

    /**
   * Simulate the upload process
   */
    uploadFilesSimulator(index: number) {
      setTimeout(() => {
        if (index === this.files.length) {
          return;
        } else {
          const progressInterval = setInterval(() => {
            if (this.files[index].progress === 100) {
              clearInterval(progressInterval);
              this.uploadFilesSimulator(index + 1);
            } else {
              this.files[index].progress += 5;
            }
          }, 200);
        }
      }, 1000);
    }
  
    /**
     * Convert Files list to normal array list
     * @param files (Files List)
     */
    prepareFilesList(files: Array<any>) {
      for (const item of files) {
        item.progress = 0;
        this.files.push(item);
      }
      this.uploadFilesSimulator(0);
    }
  
    /**
     * format bytes
     * @param bytes (File size in bytes)
     * @param decimals (Decimals point)
     */
    formatBytes(bytes, decimals) {
      if (bytes === 0) {
        return '0 Bytes';
      }
      const k = 1024;
      const dm = decimals <= 0 ? 0 : decimals || 2;
      const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
      const i = Math.floor(Math.log(bytes) / Math.log(k));
      return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
    }

  ngOnInit(): void {
  }

}
