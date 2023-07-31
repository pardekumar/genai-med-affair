import { Component, OnInit, HostListener, Input, Output, EventEmitter, ViewEncapsulation, ViewChild, ElementRef, Inject, AfterViewInit, OnDestroy } from '@angular/core';
import * as pdfjsLib from 'pdfjs-dist';
import { AppDataService } from './../services/app-data.service';
//import { PageViewport } from 'pdfjs-dist/types/src/display/display_utils';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import {NestedTreeControl} from '@angular/cdk/tree';
import {MatTreeNestedDataSource} from '@angular/material/tree';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import { Router,  ActivatedRoute } from '@angular/router';
import { MatOptionSelectionChange } from '@angular/material/core';
import * as configData from '../../config/appData-config.json';
import {CdkDragDrop, moveItemInArray} from '@angular/cdk/drag-drop';

declare var $: any;

interface tableNode {
  title: string;
  dest: any;
  items?: tableNode[];
}

@Component({
  selector: 'app-pdfjs-viewer',
  templateUrl: './pdfjs-viewer.component.html',
  styleUrls: ['./pdfjs-viewer.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class PdfjsViewerComponent implements OnInit {
  url = '/assets/1-s2.0-S2213219817302532-main.pdf'
  pdfDoc: any;
  pageNum = 1
  pageRendering = false
  pageNumPending: any
  scale = 2.2
  canvas = <HTMLCanvasElement> document.getElementById('the-canvas')
  ctx: any
  pageNumber: any = 1;
  pageCount: any = 1;
  totalHeight: any = 0;
  pdfOutline: any;
  initialized: boolean = false;
  @ViewChild('one')
  d1!: ElementRef;
  treeControl = new NestedTreeControl<tableNode>(node => node.items);
  dataSource = new MatTreeNestedDataSource<tableNode>();
  sectionName: any;
  annotatedColor: any;
  mouseUpEvent: any;
  selectionRects: any;
  selectedText: any;
  savedText: any;
  savedAnnotations: any
  localStorageValues: any
  localStorageGetValues: any
  fileName: any
  typedarray: any
  allSavedAnnotations = {};
  convertedfile: any;
  pdf_key: any;
  uploadfile: any;
  id: any;
  groupeddata: any;
  annotationObject: any;
  configObj: any = (configData as any).default;
  savelaterpdf_key: any
  fileData: any
  totalSections: any
  chosenSections: any
  loadingTask: any
  manualDrag: boolean = false
  sectionWiseAnnotations: any
  tocMessage: string = this.configObj.noTOCExist
  matSpinner: boolean = false
  imgurl = "../assets/images/88.svg"
  componentStart: any
  componentEnd: any
  totalDuration: any = []
  totalWordCount: any = 0
  selectedWords: any
  objectiveWords: any = 0
  methodWords: any = 0
  resultWords: any = 0
  conclusionWords: any = 0
  //savedFileURL: any
  constructor(public dialog: MatDialog,private appDataService: AppDataService, private route: ActivatedRoute, private router: Router) { 
   /*  this.routeSub = this.route.params.subscribe(params => {
      console.log(params['id']) //log the value of id
    });
    console.log(this.routeSub) */
    if(window.innerWidth <= 1300){
      this.scale = 1.5
    }
    else if(window.innerWidth <= 1540){
      this.scale = 1.8
    }
    this.route.params.subscribe(params => {
     // localStorage.setItem('routedValues', JSON.stringify(this.router.getCurrentNavigation().extras.state))
      if (this.router.getCurrentNavigation().extras.state) {
        this.uploadfile = this.router.getCurrentNavigation().extras.state.upload
        if(this.uploadfile){
          this.fileData = this.router.getCurrentNavigation().extras.state.fileData
          this.onFileSelect(this.fileData)
        }
        this.pdf_key = this.router.getCurrentNavigation().extras.state.key
      }
    });
    if (!this.uploadfile) {
      this.route.params.subscribe(params => {
        var fileID = params['id']
        if (this.router.getCurrentNavigation() != null) {
        //console.log(this.router.getCurrentNavigation().extras.state.reAnnotation)
          if(!sessionStorage.getItem('isReAnnotation')){
            sessionStorage.setItem('isReAnnotation', this.router.getCurrentNavigation().extras.state.reAnnotation)
          }
          var isReAnnotation = sessionStorage.getItem('isReAnnotation')
          this.appDataService.editSaveLater(fileID).subscribe(result => {

            this.appDataService.getSavedPDFFileURL(result.body.id).subscribe(res =>{
                if(isReAnnotation == "false"){
                  var state = {
                    'annotation': result.body.annotations.annotations,
                    'name': result.body.name,
                    'pdf_key': result.body.s3_path,
                    'id': result.body.id,
                    'saved_file': result.body.annotation_html,
                    'file_URL': res.body,
                    'sessionDuration': result.body.sessionDuration.sessionDuration,
                    'annotated_words': result.body.annotated_words
                  }
                }
                else{
                  var state = {
                    'annotation': result.body.annotations.annotations,
                    'name': result.body.name,
                    'pdf_key': result.body.s3_path,
                    'id': undefined,
                    'saved_file': result.body.annotation_html,
                    'file_URL': res.body,
                    'sessionDuration': result.body.sessionDuration.sessionDuration,
                    'annotated_words': result.body.annotated_words
                  }
                }
            
              //if (this.router.getCurrentNavigation().extras.state) {
                this.fileName = state.name;
                //Saved For Later
                if(state.id){
                  this.savelaterpdf_key = state.pdf_key;
                  this.id = state.id;
                  let annObject = [state.annotation]
                  let structuredObject = Object.keys(annObject[0]).map(function(key){
                    return annObject[0][key]
                  })
                  let flatStructuredObject = [].concat(... structuredObject)
                  this.annotationObject = flatStructuredObject
                  this.totalDuration = state.sessionDuration
                  this.totalWordCount = state.annotated_words
                  this.onGetSavedURL(state.file_URL, this.annotationObject)
                }
                //Fetching data from Submitted file for PLS
                else{
                  this.pdf_key = state.pdf_key;
                  let annObject = [state.annotation]
                  let structuredObject = Object.keys(annObject[0]).map(function(key){
                    return annObject[0][key]
                  })
                  let flatStructuredObject = [].concat(... structuredObject)
                  this.annotationObject = flatStructuredObject
                  this.totalDuration = state.sessionDuration
                  this.totalWordCount = state.annotated_words
                  this.onGetSavedURL(state.file_URL, this.annotationObject)
                }
              
            // }
          
          /* if (this.router.getCurrentNavigation().extras.state) {
            this.fileName = this.router.getCurrentNavigation().extras.state.name;
            this.annotationObject = this.router.getCurrentNavigation().extras.state.annotation.annotations;
            console.log(this.annotationObject)
            if(this.router.getCurrentNavigation().extras.state.id){
              this.savelaterpdf_key = this.router.getCurrentNavigation().extras.state.pdf_key;
              this.id = this.router.getCurrentNavigation().extras.state.id;
              this.onGetSavedURL(this.router.getCurrentNavigation().extras.state.file_URL, this.annotationObject)
            }
            else{
              this.pdf_key = this.router.getCurrentNavigation().extras.state.pdf_key;
              let annObject = [this.router.getCurrentNavigation().extras.state.annotation]
              let structuredObject = Object.keys(annObject[0]).map(function(key){
                return annObject[0][key]
              })
              let flatStructuredObject = [].concat(... structuredObject)
              this.annotationObject = flatStructuredObject
              this.onGetSavedURL(this.router.getCurrentNavigation().extras.state.file_URL, this.annotationObject)
            }

          } */
            })
          });
        }
      })
    }

  }

  ngOnInit(): void {
    this.componentStart = Date.now();
    this.getQuestionList()
    pdfjsLib.GlobalWorkerOptions.workerSrc = '//cdn.jsdelivr.net/npm/pdfjs-dist@2.6.347/build/pdf.worker.js';
  }

  @HostListener('window:beforeunload', ['$event'])
  unloadHandler(event: Event) {
    if(window.opener.location != null){
      window.opener.location.reload();
    }
  }

  hasChild = (_: number, node: tableNode) => !!node?.items && node?.items.length > 0;

  scrollToPage(dest: any){
    this.pdfDoc.getDestination(dest).then((dest: any) => {
        const ref = dest[0];
        // And the page id
        this.pdfDoc.getPageIndex(ref).then((id: any) => {
          var pageNumber = parseInt(id) + 1
          var element = document.getElementById(String(pageNumber)) 
          element?.scrollIntoView({behavior: 'smooth'})
        })    
    });
  }

  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.annotationObject, event.previousIndex, event.currentIndex);
    this.manualDrag = true
  }

  clickMe(event: any){
    var filter = event.toLowerCase();
    var nodes = document.getElementsByClassName('textLayer');
    for (var i = 0; i < nodes.length; i++) {
      //Using textContent instead of innerHTML because it matches with window.getSelection()?.getRangeAt(0)?.toString() exactly
      if ((<HTMLElement>nodes[i]).textContent.toLowerCase().includes(filter)) {
        var canvasId = (<HTMLElement>nodes[i]).id;
        canvasId = canvasId.charAt(canvasId.length - 1);
        var element = document.getElementById(String(canvasId))
        element?.scrollIntoView({behavior: 'smooth'})
        break
      } 
    }
  }
  getQuestionList(){
    this.appDataService.getQuestionList().subscribe(res => {
      this.groupeddata = this.groupByKey(res.body, 'section')
      this.totalSections = Object.keys(this.groupeddata)
    })
  }

  groupByKey(array, key) {
    return array
      .reduce((hash, obj) => {
        if (obj[key] === undefined) return hash;
        return Object.assign(hash, { [obj[key]]: (hash[obj[key]] || []).concat(obj) })
      }, {})
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(AnnotationDialog, {
      width: '35%',
      height: '45%',
      data: {sectionName: this.sectionName, questionList: this.groupeddata, selectedWords: this.selectedWords}
    });
    dialogRef.afterClosed().subscribe(result => {
      this.selectedWords = undefined
      if(result.data=='cancel'){
        window.getSelection().removeAllRanges()
      }
      if(result && result.data!='cancel'){
        this.sectionName = result.data;

        if (this.sectionName === "methods") {
          this.annotatedColor = "orange";
        } else if (this.sectionName === "objectives") {
          this.annotatedColor = "teal";
        }
        else if (this.sectionName === "results") {
          this.annotatedColor = "blue";
        } else if (this.sectionName === "conclusions") {
          this.annotatedColor = "green";
        }

        var textLayerId = (<HTMLElement>(<HTMLElement>this.mouseUpEvent.target)?.parentNode).id
        // Find the number from layer id string's end
        var txtLayerId = textLayerId.match(/\d+$/)
          var txtLayerIdNumber = parseInt(txtLayerId[0])
          //console.log(this.mouseUpEvent, txtLayerId[0], txtLayerIdNumber)
          var canvas: any
          canvas = document.getElementById(txtLayerId[0])
          this.pdfDoc.getPage(txtLayerIdNumber).then((page: any) => {
          var pageRect = canvas.getClientRects()[0];
          var selectionRects: any
          selectionRects = this.selectionRects
          var selectionRectsList = Object.values(selectionRects);
          selectionRectsList = selectionRectsList.filter(( obj: any ) => {
            return obj.width != 0;
          });
          var viewport = page.getViewport({scale: this.scale});
          var selected = selectionRectsList.map(function (r: any) {
            return viewport.convertToPdfPoint(r.left - pageRect.x, r.top - pageRect.y).concat(
              viewport.convertToPdfPoint(r.right - pageRect.x, r.bottom - pageRect.y)); 
          });
          var pageElement = canvas.parentElement;
          selected.forEach( (rect: any) => {
            var bounds = viewport.convertToViewportRectangle(rect);
            var el = document.createElement('div');
            el.className = "annotatedStyle"
            el.setAttribute('style', 'position: absolute; background-color: '+ this.annotatedColor +'; opacity: 0.3;' + 
              'left:' + Math.min(bounds[0], bounds[2]) + 'px; top:' + Math.min(bounds[1], bounds[3]) + 'px;' +
              'width:' + Math.abs(bounds[0] - bounds[2]) + 'px; height:' + Math.abs(bounds[1] - bounds[3]) + 'px;');
          pageElement?.appendChild(el);
          })
          if(this.annotationObject ){
            this.annotationObject.push({page: txtLayerIdNumber, coords: selected, color: this.annotatedColor, notes: this.selectedText[0], originalNotes: this.selectedText[1], type: result.data});
          }
          else{
            this.annotationObject = [{page: txtLayerIdNumber, coords: selected, color: this.annotatedColor, notes: this.selectedText[0], originalNotes: this.selectedText[1], type: result.data}];
          }
          this.annotationWordCount();
        })
      }
    });   
  }
  
  annotationWordCount(){
    this.totalWordCount = 0
    this.objectiveWords = 0
    this.methodWords = 0
    this.resultWords = 0
    this.conclusionWords = 0
    this.annotationObject.forEach((obj: any) => {
      if(obj.type == 'objectives'){
        this.objectiveWords += obj.notes.trim().split(/\s+/).length
      }
      else if(obj.type == 'methods'){
        this.methodWords += obj.notes.trim().split(/\s+/).length
      }
      else if(obj.type == 'results'){
        this.resultWords += obj.notes.trim().split(/\s+/).length
      }
      else if(obj.type == 'conclusions'){
        this.conclusionWords += obj.notes.trim().split(/\s+/).length
      }
      this.totalWordCount += obj.notes.trim().split(/\s+/).length
    })
  }

  onFileSelect(fileData){
   // var file = event.target.files[0];
    pdfjsLib.GlobalWorkerOptions.workerSrc = '//cdn.jsdelivr.net/npm/pdfjs-dist@2.6.347/build/pdf.worker.js';
    var file = fileData
    this.fileName = file.name

    var fileReader = new FileReader();  
    fileReader.readAsArrayBuffer(file);
    fileReader.onload = (e) => {

        //Step 4:turn array buffer into typed array
        var arrayBuffer = <ArrayBuffer>(fileReader.result)
        this.typedarray = new Uint8Array(arrayBuffer);
        //console.log(typedarray)
        this.loadingTask = pdfjsLib.getDocument(this.typedarray);
        this.loadingTask.promise.then((pdf) => {
          this.pdfFileLoad(pdf)
        });    
        
    }
    
  }
  onGetSavedURL(fileURL, annotateObject){
    pdfjsLib.GlobalWorkerOptions.workerSrc = '//cdn.jsdelivr.net/npm/pdfjs-dist@2.6.347/build/pdf.worker.js';
    this.annotationObject.forEach((obj: any) => {
      if(obj.type == 'objectives'){
        this.objectiveWords += obj.notes.trim().split(/\s+/).length
      }
      else if(obj.type == 'methods'){
        this.methodWords += obj.notes.trim().split(/\s+/).length
      }
      else if(obj.type == 'results'){
        this.resultWords += obj.notes.trim().split(/\s+/).length
      }
      else if(obj.type == 'conclusions'){
        this.conclusionWords += obj.notes.trim().split(/\s+/).length
      }
    // this.totalWordCount += obj.notes.trim().split(/\s+/).length
    })
    this.loadingTask = pdfjsLib.getDocument(fileURL);
    this.matSpinner = true
    this.loadingTask.promise.then((pdf) => {
      this.matSpinner = false
      this.pdfFileLoad(pdf)
      this.showHighlight(annotateObject)
    });
  }

  pdfFileLoad(pdf){
    this.pdfDoc = pdf;
        
    var viewer: any
    viewer = document.getElementById('pdf-viewer');
    while (viewer.lastElementChild) {
      viewer.removeChild(viewer.lastElementChild);
    }
    for(var page = 1; page <= this.pdfDoc.numPages; page++) {
      var canvasParent = document.createElement('div');
      canvasParent.className = 'position-relative'
      canvasParent.id = 'canvasParent' + String(page)
      var canvas = document.createElement("canvas");    
      canvas.className = 'pdf-page-canvas';
      canvas.id = String(page)    
      canvasParent.appendChild(canvas)
      viewer.appendChild(canvasParent)
      this.renderPages(page, canvas, canvasParent);
    }


    const pairs: any = [];

    // Get the tree outline
    this.pdfDoc.getOutline().then((outline: any) => {
      if (outline && typeof outline[0].dest === 'string') {
        for (let i = 0; i < outline.length; i++) {
          const dest = outline[i].dest;
          // Get each page ref
          this.pdfDoc.getDestination(dest).then((dest: any) => {
            const ref = dest[0];
            // And the page id
            this.pdfDoc.getPageIndex(ref).then((id: any) => {
              // page number = index + 1
              pairs.push({ title: outline[i].title, pageNumber:  parseInt(id) + 1 });     
                  
            });
          });
        }
        this.dataSource.data = outline
        var boxElement: any
        boxElement = document.getElementById('tocBox')
        boxElement.style.height = '41%'
        boxElement = document.getElementById('annotationBox')
        boxElement.style.height = '41%'
      }
      else{
        this.dataSource.data = []
        if(this.dataSource.data.length == 0){
          var boxElement: any
          boxElement = document.getElementById('tocBox')
          boxElement.style.height = 'fit-content'
          boxElement = document.getElementById('annotationBox')
          boxElement.style.height = '80%'
          if(window.innerWidth <= 1300){
            boxElement.style.height = '73%'
          }
          else if(window.innerWidth <= 1540){
            boxElement.style.height = '75%'
          }
          window.addEventListener("resize", function() {
            boxElement.style.height = '80%'
            if(window.innerWidth <= 1300){
              boxElement.style.height = '73%'
            }
            else if(window.innerWidth <= 1540){
              boxElement.style.height = '75%'
            }
          });
          //console.log(this.dataSource.data.length)
        }
      }
      var txtLayerElement: any;
      txtLayerElement = document.getElementById('pdf-text-layer');
      while (txtLayerElement.lastElementChild) {
        txtLayerElement.removeChild(txtLayerElement.lastElementChild);
      }
      for(var page = 1; page <= this.pdfDoc.numPages; page++) {
        this.d1.nativeElement.insertAdjacentHTML('beforeend', '<div id="layer'+ page +'" class="textLayer"></div>');
      }
    });
  }

  renderPages(pageNumber: any, canvas: any, canvasParent: any) {
    this.pdfDoc.getPage(pageNumber).then((page: any) => {
      var viewport: any
      viewport = page.getViewport({ scale: this.scale });
      canvas.height = viewport.height;
      canvas.width = viewport.width;    
      this.totalHeight += viewport.height;      
      //console.log(page)
      page.render({canvasContext: canvas.getContext('2d'), viewport: viewport}).promise.then(function() {
        // Returns a promise, on resolving it will return text contents of the page
        return page.getTextContent();
      }).then((textContent: any) => {
  
        // Assign CSS to the textLayer element
        //console.log(canvasParent)
        var textLayer: any
        textLayer = document.getElementById("layer"+ pageNumber);
  
        textLayer.style.left = canvasParent.offsetLeft + 'px';
        textLayer.style.top = canvasParent.offsetTop + 'px';
        textLayer.style.height = canvasParent.offsetHeight + 'px';
        textLayer.style.width = canvasParent.offsetWidth + 'px';
       // console.log(canvas.offsetLeft, canvas.offsetTop)
        // Pass the data to the method for rendering of text over the pdf canvas.
        pdfjsLib.renderTextLayer({
          textContent: textContent,
          container: <HTMLElement>textLayer,
          viewport: viewport,
          textDivs: []
        });
      });
    });
  }

  @HostListener('mouseup', ['$event'])
  onMouseUp = (event: MouseEvent) => {
    if((<HTMLElement>(window.getSelection()?.focusNode?.parentNode)).offsetParent?.className != "textLayer" && (<HTMLElement>(window.getSelection()?.focusNode?.parentNode)).offsetParent?.className != "") 
      {
        return;
      }
    //if(window.getSelection()?.focusNode?.parentNode?.id != "canvasLayer") return;
    //console.log(window.getSelection())
    var text = window.getSelection()?.toString();
    var unformattedText = window.getSelection()?.getRangeAt(0)?.toString()
    if(text || text != "")
    {
        var length = text.split(/\s+/).length;
        this.selectedWords = text.trim().split(/\s+/).length
        if(length < this.configObj.minimumWordsForAnnotation){
          alert("Please select at least " + String(this.configObj.minimumWordsForAnnotation) + " words.")
          window.getSelection().removeAllRanges()
          this.selectedWords = undefined
        }
        else{
          this.selectedText = [text,unformattedText]
          //console.log(window.getSelection()?.getRangeAt(0)?.toString())
          //console.log(this.selectedText); 
          this.selectionRects = window.getSelection()?.getRangeAt(0).getClientRects();
          this.mouseUpEvent = event
          this.openDialog()
          /* alert(text) */   
        }    
    }
  };

  removeAnnotation(event: any){
    event.target.parentElement.style.display = 'none'
    //console.log(event)
    this.annotationObject = this.annotationObject.filter(( obj: any ) => {
      return obj.notes !== (event.composedPath()[1].lastElementChild.innerText).slice(1,-1);
    });
    this.annotationWordCount()
    for(var i=1; i<=this.pdfDoc.numPages; i++){
      //console.log(this.pdfDoc)
      var element: any
      var elementChild: any
      element = document.getElementById("canvasParent"+String(i))
      elementChild = element.getElementsByTagName('div')
      while(elementChild[0]){
        elementChild[0].parentNode.removeChild(elementChild[0])
      }
     
    }
    this.showHighlight(this.annotationObject)
    if(this.annotationObject.length === 0){
      this.annotationObject = undefined
    }
  }
  
  showHighlight(selected: any) {
    if(selected!=''){
        var pageElement: any = undefined
        selected.forEach((item: any, index: any) => {
        var canvas: any
        canvas = document.getElementById(String(item.page))
       // console.log(this.typedarray)
        var url: any
        if(this.typedarray){
          url = this.typedarray
        }
        else{
          url = this.url
        }
        this.loadingTask.promise.then((pdf)=>{
          this.pdfDoc = pdf
        this.pdfDoc.getPage(item.page).then((page: any) => {
         // console.log(this.pdfDoc)
        pageElement = canvas.parentElement;
        //console.log(pageElement)
        var viewport = page.getViewport({scale: this.scale});
        //console.log("viewport: "+ viewport)
        item.coords.forEach(function (rect: any) {
          var bounds = viewport.convertToViewportRectangle(rect);
         // console.log("bounds: "+ bounds)
          var el = document.createElement('div');
          el.className = "annotatedStyle"
          el.setAttribute('style', 'position: absolute; background-color: '+ item.color +'; opacity: 0.3;' + 
            'left:' + Math.min(bounds[0], bounds[2]) + 'px; top:' + Math.min(bounds[1], bounds[3]) + 'px;' +
            'width:' + Math.abs(bounds[0] - bounds[2]) + 'px; height:' + Math.abs(bounds[1] - bounds[3]) + 'px;');
        pageElement?.appendChild(el);
        });
       // console.log(pageElement)
      });
        })
      })
    }
  }

  confirmation(comparedResults){
   // if(event.target.value.length != 0){
    var result = confirm("Are you sure you want to create plain language summary without "+ comparedResults.join(', ') + " ?\n\nPress OK to confirm.");
          if (result == true) {
              this.submitAnnotations()
          }
          else{
            this.totalDuration.pop()
          } 
   // }
  }
  sortAnnotations(){
    var annObject = this.annotationObject
    if(this.annotationObject){
      annObject.forEach(element => {
          let left_bounds = []
          let top_bounds = []
          let right_bounds = []
          let bottom_bounds = []
          element.coords.forEach(res => {
              let left = res[0]
              let top = res[1]
              let right = res[2]
              let bottom = res[3]
              if(left != 0){
                  left_bounds.push(left)
              }
              if(right != 0){
                  right_bounds.push(right)
              }
              if(top != 0 && left != 0){
                  top_bounds.push(top)
              }
              if(bottom != 0 && left != 0){
                  bottom_bounds.push(bottom)
              }
          })
        // console.log(left_bounds, right_bounds)
          let left_bound = Math.trunc(Math.min.apply(Math, left_bounds))
          let top_bound = Math.trunc(Math.max.apply(Math, top_bounds))
          let right_bound = Math.trunc(Math.max.apply(Math, right_bounds))
          let bottom_bound = Math.trunc(Math.min.apply(Math, bottom_bounds))
          
          element.column = [left_bound, top_bound, right_bound, bottom_bound]
          //console.log(element.column, element.column[0], element.column[1])
      });
          
    // }
    this.sectionWiseAnnotations = this.groupByKey(annObject, 'type')
      for (var key in Object(this.sectionWiseAnnotations)) {
        this.sectionWiseAnnotations[key].sort(function (a, b) {
          if(a.page == b.page){
          // debugger
            let container1 = []
            let container2 = []
            let container3 = []
            let container4 = []
            let twoColumnSelection = false
            let twoColumnSelection2 = false
            //------------- Overlap check ------------
            for(let i = a.column[0]; i<= a.column[2]; i++){
              container1.push(i)
            }
            for(let i = b.column[0]; i<= b.column[2]; i++){
              container2.push(i)
            }
            var commonCoordinates = container1.filter(value => container2.includes(value));
            //-----------------------------------------
            //---selection across two columns check ---
            a.coords.forEach(element => {
              if(element[0] != 0 && element[2] != 0){
                container3.push(element[1])
              }
            });
          // container3.sort(function(c, d){return d-c});
            for(let i = 0; i<= container3.length-2; i++){
              if(container3[i] != 0 && container3[i+1] != 0){
                if(Math.abs(container3[i] - container3[i+1]) >= 25){
                  twoColumnSelection = true
                  break
                }
              }
            }
            b.coords.forEach(element => {
              if(element[0] != 0 && element[2] != 0){
                container4.push(element[1])
              }
            });
          // container4.sort(function(c, d){return d-c});
            for(let i = 0; i<= container4.length-2; i++){
              if(container4[i] != 0 && container4[i+1] != 0){
                if(Math.abs(container4[i] - container4[i+1]) >= 25){
                  twoColumnSelection2 = true
                  break
                }
              }
            }
            //-----------------------------------------
            /* console.log(container3, container4) */
            var isDescending = a => a.slice(1)
                          .every((e,i) => e <= a[i]);      
            if(commonCoordinates.length){
              //If columns overlap
              /* console.log(twoColumnSelection)
              console.log(twoColumnSelection2) */
                  if(twoColumnSelection && !twoColumnSelection2){
                    if((a.coords[0][0] < b.coords[0][0]) && (a.column[2] <= (b.column[2] + 1))){
                     /*  console.log("in twoColumnSelection") */
                      return b.column[1] - a.column[1];
                    }
                    else {
                      return b.coords[0][1] - a.coords[0][1];
                    }
                  }
                  else if(twoColumnSelection2 && !twoColumnSelection){
                    if((b.coords[0][0] < a.coords[0][0]) && (b.column[2] <= (a.column[2] + 1))){
                      /* console.log("in twoColumnSelection2") */
                      return b.column[1] - a.column[1];
                    }
                    else {
                      return b.coords[0][1] - a.coords[0][1];
                    }
                  }
                  else if(twoColumnSelection && twoColumnSelection2){
                    if(a.column[0] == b.column[0]){
                      return b.coords[0][1] - a.coords[0][1]
                    }
                    else{
                      return a.column[0] - b.column[0]
                    }
                  }
                  else{
                    return b.coords[0][1] - a.coords[0][1];
                  }
              }
              else{
                
                  return a.column[0] - b.column[0]
              
              }
          }
          else{
            return a.page - b.page
          }
        })
      }
      var sectionOrdered = {}
      if(this.sectionWiseAnnotations.objectives){
        sectionOrdered["objectives"] = null
      }
      if(this.sectionWiseAnnotations.methods){
        sectionOrdered["methods"] = null
      }
      if(this.sectionWiseAnnotations.results){
        sectionOrdered["results"] = null
      }
      if(this.sectionWiseAnnotations.conclusions){
        sectionOrdered["conclusions"] = null
      }
      this.sectionWiseAnnotations = Object.assign(sectionOrdered, this.sectionWiseAnnotations)
    }
    else{
      this.sectionWiseAnnotations = {}
    }
  }

  submitAnnotations(){
    this.appDataService.sendAllSavedAnnotations(this.allSavedAnnotations).subscribe(res => {
      sessionStorage.removeItem('isReAnnotation')
      this.router.navigateByUrl('/dashboard')
    },err =>{
        if (err.status === 400) {   

          if(err.error.message.annotations){
            alert (this.configObj.BadRequestForAnnotation)
          }
          else if(typeof(err.error.message) == "string") {
            alert(err.error.message)
          }
          else if(err.error.message){
            alert(JSON.stringify(err.error.message))
          }
          else {
            alert (this.configObj.ForRemaningErrorMsg)
          }
        } 
    })
  }

  createPLS(){
    this.sortAnnotations()
    this.componentEnd = Date.now()
    var timezone = Intl.DateTimeFormat().resolvedOptions().timeZone
    this.totalDuration.push({sessionStart: this.componentStart, sessionEnd: this.componentEnd, timezone: timezone})
    if (this.id) {
      this.allSavedAnnotations = {
        "pdf_key": this.savelaterpdf_key,
        "name": this.fileName,
        "annotations": {
          "annotations": this.sectionWiseAnnotations
        },
        "manuscript_id": this.id,
        "sessionDuration": {
          "sessionDuration": this.totalDuration
        },
        "annotated_words": this.totalWordCount
      }
    } else {
      this.allSavedAnnotations = {
        "pdf_key": this.pdf_key,
        "name": this.fileName,
        "annotation_html": this.fileData,
        "annotations": {
          "annotations": this.sectionWiseAnnotations
        },
        "sessionDuration": {
          "sessionDuration": this.totalDuration
        },
        "annotated_words": this.totalWordCount
      }
    }
    this.chosenSections = Object.keys(this.sectionWiseAnnotations)
    var comparedResult = this.totalSections.filter(item => this.chosenSections.indexOf(item) == -1);
    if(!comparedResult.length){
      this.submitAnnotations()
    }
    else{
      this.confirmation(comparedResult)
    }
  }
  saveForLater(){
    this.sortAnnotations()
    this.componentEnd = Date.now()
    var timezone = Intl.DateTimeFormat().resolvedOptions().timeZone
    this.totalDuration.push({sessionStart: this.componentStart, sessionEnd: this.componentEnd, timezone: timezone})
    if (this.savelaterpdf_key) {
      this.allSavedAnnotations = {
        "pdf_key": this.savelaterpdf_key,
        "name": this.fileName,
        "annotations": {
          "annotations": this.sectionWiseAnnotations
        },
        "manuscript_id": this.id,
        "sessionDuration": {
          "sessionDuration": this.totalDuration
        },
        "annotated_words": this.totalWordCount
      }
    }
    else {
      this.allSavedAnnotations = {
        "pdf_key": this.pdf_key,
        "name": this.fileName,
        "annotations": {
          "annotations": this.sectionWiseAnnotations
        },
        "sessionDuration": {
          "sessionDuration": this.totalDuration
        },
        "annotated_words": this.totalWordCount
      }
    }
    this.appDataService.saveLaterAnnotation(this.allSavedAnnotations).subscribe(res => {
      sessionStorage.removeItem('isReAnnotation')
      this.router.navigateByUrl('/dashboard')
    })
  }

  discard() {
    sessionStorage.removeItem('isReAnnotation')
    this.router.navigateByUrl('/dashboard')
  }

  OpenEditAnnotationDialog(annotatedText, item, event): void {
    const dialogRef = this.dialog.open(EditAnnotationDialog, {
      width: '40%',
      height: '42%',
      data: {text: annotatedText}
    });
    dialogRef.afterClosed().subscribe(result => {
      if(result){
        if(result.data == ""){
          this.removeAnnotation(event)
          return
        }
        if(result.data != null){
          let index = this.annotationObject.indexOf(item)
          item.notes = result.data
          this.annotationObject[index] = item
          this.annotationWordCount();
        }
      }
    })
  }
}

@Component({
  selector: 'edit-annotation-dialog',
  templateUrl: 'edit-annotation-dialog.html',
})

export class EditAnnotationDialog implements AfterViewInit{
  editForm = new FormControl()
  local_data: any;
  constructor(public dialogRef: MatDialogRef<EditAnnotationDialog>, @Inject(MAT_DIALOG_DATA) public data: String){
    this.local_data = {...data};
    
  }
  ngAfterViewInit(): void {
    setTimeout(() => {
      (<HTMLInputElement>document.getElementById('preloadedAnnotation')).value = this.local_data.text
    })  
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  saveNewAnnotation(){
    this.dialogRef.close({data:this.editForm.value});
  }
}

interface Section {
  value: string;
  viewValue: string;
  disable: boolean;
  questions: any; 
}

@Component({
  selector: 'annotation-dialog',
  templateUrl: 'annotation-dialog.html',
})

export class AnnotationDialog {
  form: FormGroup;
  local_data: any;
  groupName: any;
  groupDisable: any = false;
  allQuestions: any = [];
  sections: Section[] = []
  constructor(
    fb: FormBuilder,public dialogRef: MatDialogRef<AnnotationDialog>,
    @Inject(MAT_DIALOG_DATA) public data: Section,
    private appDataService: AppDataService
  ) {
      this.local_data = {...data};
      this.form = fb.group({
        //formQuestions: [this.allQuestions, Validators.required]
        formSectionName: [this.local_data.value, Validators.required]
      })
      
        Object.keys(this.local_data.questionList).forEach(key => {
            let question = []
            this.local_data.questionList[key].forEach(element => {
            question.push(element.text)
          });
          let section: Section = {value: key, viewValue: key, disable: false, questions: question}
          this.sections.push(section)
        });
    }

  groupByKey(array, key) {
    return array
      .reduce((hash, obj) => {
        if (obj[key] === undefined) return hash;
        return Object.assign(hash, { [obj[key]]: (hash[obj[key]] || []).concat(obj) })
      }, {})
  }

  onNoClick(): void {
    this.dialogRef.close({data:'cancel'});
  }
  doAction(){
      let questions = this.sections.filter(obj =>{
        return obj.value === this.form.value.formSectionName
      })
      //this.dialogRef.close({data:this.groupName});
      this.dialogRef.close({data:this.form.value.formSectionName});
  }
}