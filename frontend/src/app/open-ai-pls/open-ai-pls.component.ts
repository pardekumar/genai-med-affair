import { Component, OnInit } from '@angular/core';
import { OpenAiService } from '../services/open-ai.service';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import * as XLSX from 'xlsx';
import { Observable } from 'rxjs';
import { startWith, map } from 'rxjs/operators';
import { AsyncPipe } from '@angular/common';
import { MatAutocompleteModule } from '@angular/material/autocomplete';

@Component({
  selector: 'app-open-ai-pls',
  templateUrl: './open-ai-pls.component.html',
  styleUrls: ['./open-ai-pls.component.css']
})
export class OpenAIPLSComponent implements OnInit {
  control = new FormControl('');
  documents = ['Abstract', 'Abstract PLS', 'Manuscript', 'Omnichannel Adaption', 'Poster', 'Social Media Post', 'PLS', 'Reformatting to a Different Journal'];
  titleList = ["Introduction", "Title", "Abstract", "Objective", "Background", "Key Takeaway", "Methods", "Phonetics", "Study Details", "Results", "Discussion", "Conclusions", "Funding", "More information", "References", "Limitations"];
  queryList = {
    'Abstract': {
      "Introduction": ['Write a concise introduction for the study.',],
      "Methods": ['How was the study done?'],
      "Results": ['total eligible patients , patient age & ethnicity?',
        'median rwPFS and OS ( after sIPTW ), CI (confidence interval) outputs for rwPFS & OS and  median rwPFS and OS after PSM) ?'],
      "Conclusions": ['What were the conclusions?'],
    },

    'Abstract PLS': {
      "Key Takeaway": ['What did this study show?'],
      "Phonetics": ['Identify the phonetics used in the study.'],
      "Introduction": ['What is metastatic breast cancer? What does HR+ and HR+/HER2– breast cancer mean? Include all numbers and figures related to this.',
        'What is Palbociclib and briefly explain how it works?',
        'What is the aim of the study? What did the study find out?',
        'How do patients in routine clinical practice differ from that of clinical trials? How was the study carried out and what information did it use?'],
      "Study Details": ['Who was included in the study? Include their treatment information as well as numbers and facts related to this.'],
      "Results": ['What were the overall results of the study?'],
      "Conclusions": ['What were the main conclusions reported by the study authors?'],
      "More information": ['Who funded the study? And get the location of the funder with pincode',
        'Where can I find the original article on which this summary is based? Where can I find more information on clinical studies? Provide website urls',],
    },

    'Manuscript': {
      "Introduction": ['Write a concise summary for the study and include facts, figures, statistical measures and dates.'],
      "Background": ['Write a background and introduction on the study highlighting the existing gap or problem, key findings and theories of previous studies, significance and purpose of the study.'],
      "Methods": ['Provide Information specific to Study Design/Data Source only. Exclude any summary statements.',
        'Provide information on primary and secondary outcomes only.',
        'Provide information specific to Statistical Analyses including details on patient group, cohorts, facts and figures.'],
      "Results": ['Provide all the information on results including patient characteristics (age, race, color,characteristics, sample size, etc.), Overall Survival, Real world progression free survival with all the numeric data, figures and dates'],
      "Discussion": ['What are the major findings, key end points, inclusion and exclusion criteria in scope of the study',
        'Summarize the study results, include all the related numbers/figures as evidence',
        'Provide any information on patient characteristics, sample sizes. Compare and contrast this study with any previous similar real world studies',
        'Discuss about potential strengths and limitations of the study if any and provide any findings from real world data'],
      "Conclusions": ['What were the conclusions?'],
    },

    'Omnichannel Adaption': {
      "Background": ['Provide information on the study highlighting details on Palbociclib, findings of PALOMA-2 trial, real-world evidence, aim of current study and limitations of any previous real world studies.'],
      "Methods": ['Provide information on the study design, data sources, inclusion/exclusion criteria and patient cohorts with all the numbers, facts and dates.',
        'Provide information on statistical methods or analysis, outcomes and disease progression.',],
      "Results": ['Provide concise information on patient cohorts included in the study and patient characteristics with all the numbers and facts.',
        'Provide all the numbers and figures related to overall survival.',
        'Provide all the numbers and figures related to real world progression free survival.',],
      "Conclusions": ['Provide details on conclusions of the study. What did the study find?'],
      "Discussion": ['Provide details on strengths of this study. What factors strengthened the study?',
        'What were the limitations of this study? How did the data, assumptions and statistical methods used impact the effectiveness of the study? Explain with relevant numbers.',],
      "References": ['List down all the references provided in the study.']
    },

    'Poster': {
      "Objective": ['What was the objective of this study?'],
      "Background": ['Write a short background on the study highlighting information on Palbociclib, PALOMA-2 trial and recent real-world studies.'],
      "Methods": ['Provide short summary specific to study design, data sources, outcomes and statistical analyses only. Include relevant numbers, facts and dates related to this.'],
      "Results": ['Provide a short summary on results including patient characteristics (age, race, color,characteristics, sample size, etc.), Overall Survival, Real world progression free survival with all numeric data, figures and dates.'],
      "Conclusions": ['What were conclusions of the study? Provide details on effectiveness of the study.'],
      "Limitations": ['What are the limitations of this study? How can the assumptions impact the effectiveness of the study?'],
    },

    'Social Media Post': {
      "Title": ['Based on the nature and significance of the study suggest a concise title for the study.'],
      "Background": ['Provide a very concise plain language answer on what would the drug achieve and how would it impact/benefit the lives of the patients?'],
    },

    'PLS': {
      "Abstract": ['What is the summary?',
        'What were the results?',
        'What do the results support?',],
      "Background": ['Who should read this article?',
        'Why was the study carried out?',
        'What is metastatic breast cancer?',
        'What does HER2– breast cancer mean?',
        'What does HR+ breast cancer mean?',
        'What is HR+/HER2– breast cancer?',
        'What is palbociclib and how does it help to slow down tumor growth?',
        'What is an AI(hormone therapy)?',
        'How does combining palbociclib and an AI work?',],
      "Methods": ['How was this study carried out?',
        'Provide info about patients included in the study',],
      "Results": ['What were the overall results of the study?',
        'What do the results of this study mean?',],
      "Discussion": ['What are the key strengths of this study?',
        'What are the limitations of this study?',
        'Where can I find the original article on which this summary is based?',
        'Where can I find additional resources on breast cancer? ',],
      "Funding": ['Who sponsored the study?',],
    },

    'Reformatting to a Different Journal': {
      "Objective": ['Reformatting to a Different Journal'],
      "Methods": [''],
      "Results": [''],
      "Conclusions": ['What were the conclusions?'],
    },


  };
  lengthList = ["10", "20", "30", "40", "50"];

  sections: any = [
    { "title": "", "query": "", "length": "" }
  ];
  sourceFieldValue: string = "";
  maxToken: number = 100;
  temperature: number = 0;
  models = ['GPT-3.5-Turbo'];
  modelSelected: string;
  documentSelected: string;
  excelData: string[] = [];
  selectedExcelValue: string = '';
  toneSelected: string;
  responseKeys: string[] = [];
  responseData = {};
  plsHeaderKeys = [];
  plsHeaderData = {};
  hideHeader: boolean = false;
  formData: FormData = new FormData();
  file: Blob;
  constructor(private OpenAIService: OpenAiService) { }


  getQueriesForSelectedDocument(title: string): string[] {
    const queries = this.queryList[this.documentSelected]?.[title];
    return queries || [];
  }

  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    if (file) {
      this.readExcelFile(file);
    }
  }

  readExcelFile(file: File) {
    const fileReader: FileReader = new FileReader();
    fileReader.onload = (e: any) => {
      const arrayBuffer: any = e.target.result;
      const workbook: XLSX.WorkBook = XLSX.read(arrayBuffer, { type: 'array' });

      const firstSheetName: string = workbook.SheetNames[0];
      const worksheet: XLSX.WorkSheet = workbook.Sheets[firstSheetName];

      const parsedData: any[] = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

      this.excelData = parsedData.slice(1).map((row: any) => row[0]);
      
      if (this.excelData.length > 0) {
        this.selectedExcelValue = this.excelData[0];
      }
    };

    fileReader.readAsArrayBuffer(file);
  }




  clearData() {
    this.sections = [
      { "title": "", "query": "", "length": "" }
    ];
    this.sourceFieldValue = "";
    this.maxToken = 100;
    this.temperature = 0;
    this.modelSelected = "";
    this.documentSelected = "";
    this.toneSelected = "";
    this.responseKeys = [];
    this.hideHeader = false;
    this.files = [];
    this.responseData = {};
    this.plsHeaderData = {};
    this.plsHeaderKeys = [];
  }

  getPLSData() {
    var file = this.files;
    const formData = new FormData();
    formData.append('file', new Blob(file));
    formData.append('urls', this.sourceFieldValue);
    formData.append('tone', this.toneSelected);
    formData.append('model_name', this.modelSelected);
    formData.append('title_dict', JSON.stringify(this.sections));
    formData.append('max_tokens', String(this.maxToken));
    formData.append('temperature', String(this.temperature))

    this.hideHeader = true;
    /*let response1 = {
      'message' : {
        'Objective': ['The study design includes a planned treatment period through Week'],
        'content' : ['some text', 'some text']
      },
          'scores' : {'score': 67.49, 'level': '8th and 9th grade'}
    }*/

    /*for (var key in response1) {
      if(key != "status") {
        if(key == "scores") {
          for (var k in response1[key]) {
            this.plsHeaderKeys.push(k);
            this.plsHeaderData[k] = response1[key][k]
          }
        } else {
          for (var k in response1[key]) {
            this.responseKeys.push(k);
            this.responseData[k] = response1[key][k]
          }
        }
        console.log(this.responseData)
      }
    }*/
    this.OpenAIService.getPLSData(formData).subscribe(response => {
      let response1 = response["body"];
      this.plsHeaderKeys = [];
      this.plsHeaderData = {};
      this.responseData = {};
      this.responseKeys = [];
      for (var key in response1) {
        if (key != "status") {
          if (key == "scores") {
            for (var k in response1[key]) {
              this.plsHeaderKeys.push(k);
              this.plsHeaderData[k] = response1[key][k]
            }
          } else {
            for (var k in response1[key]) {
              this.responseKeys.push(k);
              this.responseData[k] = response1[key][k]
            }
          }
          console.log(this.responseData)
        }
      }

    })

  }

  addSections() {
    this.sections.push({ "title": "", "query": "", "length": "" });
  }

  ExportToDoc() {
    //todo
    var header = "<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'><head><meta charset='utf-8'><title>Export HTML to Word Document with JavaScript</title></head><body>";

    var footer = "</body></html>";

    var html = header + document.getElementById("pls-content").innerHTML + footer;

    var blob = new Blob(['\ufeff', html], {
      type: 'application/msword'
    });

    // Specify link url
    var url = 'data:application/vnd.ms-word;charset=utf-8,' + encodeURIComponent(html);

    // Specify file name
    // String filename = 'document.doc';

    // Create download link element
    var downloadLink = document.createElement("a");

    document.body.appendChild(downloadLink);

    // Create a link to the file
    downloadLink.href = url;

    // Setting the file name
    downloadLink.download = 'document.doc';

    //triggering the function
    downloadLink.click();

    document.body.removeChild(downloadLink);
  }

  files: any[] = [];

  /**
 * Delete file from files list
 * @param index (File index)
 */
  plsDeleteFile(index: number) {
    this.files.splice(index, 1);
  }

  /**
   * on file drop handler
   */
  onPlsFileDropped($event) {
    this.plsPrepareFilesList($event);
  }


  /**
   * handle file from browsing
   */
  plsFileBrowseHandler($event) {
    this.file = $event.target.files[0];
    console.log(this.file);
    this.plsPrepareFilesList($event.target.files);
  }

  /**
 * Simulate the upload process
 */
  plsUploadFilesSimulator(index: number) {
    setTimeout(() => {
      if (index === this.files.length) {
        return;
      } else {
        const progressInterval = setInterval(() => {
          if (this.files[index].progress === 100) {
            clearInterval(progressInterval);
            this.plsUploadFilesSimulator(index + 1);
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
  plsPrepareFilesList(files: Array<any>) {
    for (const item of files) {
      item.progress = 0;
      this.files.push(item);
    }
    this.plsUploadFilesSimulator(0);
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
