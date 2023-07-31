

import { Component, OnInit, ChangeDetectorRef, ViewEncapsulation } from '@angular/core';
import { AppDataService } from './../services/app-data.service';
import { Router,  ActivatedRoute } from '@angular/router';
import * as _ from 'underscore';
import { DomSanitizer } from '@angular/platform-browser';
import * as configData from '../../config/appData-config.json';
declare var $: any;
@Component({
  selector: 'app-annotation',
  templateUrl: './annotation.component.html',
  styleUrls: ['./annotation.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class AnnotationComponent implements OnInit {
  public App: any;
  public annotations: any;
  public selectedText: any;
  public convertedfile;
  public savedAnnotation: any;
  public filename;
  public pdf_key;
  public resultlist
  public groupeddata
  public summaries
  public storedanno
  public hhh = []
  public innerhtml
  public savelaterfilename;
  public savelaterpdf_key;
  public uploadfile;
  public id;
  public handler;
  public sorted1
  public loading = true
  Object = Object;
  public onDataLoad = ['Objectives', 'Methods', 'Results', 'Conculsions']
  public imgurl = '../assets/images/88.svg'
 
  configObj: any = (configData as any).default;
  constructor(private cd: ChangeDetectorRef, private sanitized: DomSanitizer, private appDataService: AppDataService, private route: ActivatedRoute, private router: Router) {
    this.route.queryParams.subscribe(params => {
      if (this.router.getCurrentNavigation().extras.state) {
        this.convertedfile = this.router.getCurrentNavigation().extras.state.html;
        this.filename = this.router.getCurrentNavigation().extras.state.name;
        this.pdf_key = this.router.getCurrentNavigation().extras.state.key;
        this.uploadfile = this.router.getCurrentNavigation().extras.state.upload
        sessionStorage.setItem('sendsummary', JSON.stringify(this.filename))
        sessionStorage.setItem('sendsummary1', JSON.stringify(this.pdf_key))
      }
      // sessionStorage.setItem("htmldata", this.convertedfile);
    });
    if (!this.uploadfile) {
      this.route.queryParams.subscribe(params => {
        if (this.router.getCurrentNavigation().extras.state) {
          this.innerhtml = this.sanitized.bypassSecurityTrustHtml(this.router.getCurrentNavigation().extras.state.html1);
          // this.innerhtml= this.router.getCurrentNavigation().extras.state.html1;


          this.annotations = this.router.getCurrentNavigation().extras.state.annotation;
          this.savelaterfilename = this.router.getCurrentNavigation().extras.state.name;
          if(this.router.getCurrentNavigation().extras.state.id){
            this.savelaterpdf_key = this.router.getCurrentNavigation().extras.state.pdf_key;
            this.id = this.router.getCurrentNavigation().extras.state.id;
          }
          else{
            this.pdf_key = this.router.getCurrentNavigation().extras.state.pdf_key;
          }
          this.handler = this.router.getCurrentNavigation().extras.state.handel;
          sessionStorage.setItem('hand', JSON.stringify(this.handler))

        }
   
      });

    }
   
  }


  ngOnInit(): void {




    this.invokeJqueryMethod()
    this.getQuestionsList()
    if (this.uploadfile) {
      //this.getHtml()
      this.againReload()
      //this.plsremaning();
    }


  }
  //   ngAfterViewInit(){
  // $("#last").html =this.innerhtml;

  //   }
  invokeJqueryMethod() {

    var self = this;

    var App = {
      elements: {
        tags: null
      },
      constants: {
        errors: {
          MISSING_FIELDS: {
            heading: "Required Fields Missing",
            message: "Please Select Target Section For The Annotated Text"
          },
          INSUFFICIENT_CHARS: {
            heading: "Insufficient Words",
            message: "Please select atleast 10 words"
          }
        }
      },
      variables: {
        messageDisplayed: false
      },
      helpers: {
        resetControls: function () {
          App.elements.tags.dropdown("clear").dropdown("set text", "Select Tag");
          $("textarea").val("");
        },
        showBackdrop: function (isShown) {
          $(".backdrop")[isShown ? "show" : "hide"]();
        },
        showError: function (error) {
          if (!App.variables.messageDisplayed) {
            App.variables.messageDisplayed = true;

            $("#error_message").find(".header").html(error.heading);
            $("#error_message").find(".message").html(error.message);

            $("#error_message").transition("fly down");

            window.setTimeout(
              function () {
                App.variables.messageDisplayed = false;

                $("#error_message").transition("fly up");
              },
              5000
            );
          }
        }
      },
      handlers: {
        fillNotes: function (selection) {
          // $("textarea").val(selection).trigger("change");
          App.handlers.captureNotes(self.selectedText)

        },
        captureNotes: function (text) {
          $.Annotator.api.captureActiveAnnotationNotes(text);
        },
        applyTag: function (tagName) {
          $.Annotator.api.tagActiveAnnotation(tagName);
        },
        cancelAnnotation: function () {
          App.helpers.resetControls();
          App.helpers.showBackdrop(false);

          $.Annotator.api.destroyActiveAnnotation();
        },
        saveAnnotation: function () {

          var result = $.Annotator.api.saveActiveAnnotation();


          if (!result.isSaved) {
            App.helpers.showError(App.constants.errors[result.errorCode]);
          } else {
            App.helpers.resetControls();
            App.helpers.showBackdrop(false);
          }
        },

        renderSavedAnnotations: function (annotations, isdelete?: boolean) {
          if (!isdelete) {
            $.templates("$annotations").render({
              annotations: annotations.map((item) => {
                if (item.type === "methods") {
                  item.color = "orange";
                } else if (item.type === "objectives") {
                  item.color = "teal";
                }
                else if (item.type === "results") {
                  item.color = "blue";
                } else if (item.type === "conclusions") {
                  item.color = "green";
                }

                return item;
              })

            });

            self.annotations = self.groupByKey(annotations, 'type');
            sessionStorage.setItem("datas", JSON.stringify(self.annotations));
          }


          else {
            Object.keys(self.annotations).map((key) => {

              self.annotations[key].forEach(item => {
                if (item.type === "methods") {
                  item.color = "orange";
                } else if (item.type === "objectives") {
                  item.color = "teal";
                }
                else if (item.type === "results") {
                  item.color = "blue";
                } else if (item.type === "Conclusions") {
                  item.color = "green";
                }

                return item;
              })

              //document.getElementById(x.id)[0].removeAttribute("id");
            })

          }
          //self.annotations = annotations;


          //  var text = document.getElementById('last').innerHTML;
          //  sessionStorage.setItem("datas", self.annotations);
          // this.storedanno = self.annotations

          //  if(storedannotation)

          //    Object.keys(storedannotation).map((key)=>
          //    {
          //      if(storedannotation.hasOwnProperty('summary'))
          //      self.annotations[key].push(storedannotation[key])
          //      else
          //      self.annotations[key]=storedannotation[key]
          //    })

          //   sessionStorage.setItem("datas", JSON.stringify(self.annotations));

          // $("#annotations_list").html(html);

        },


      }
    }

    self.App = App

    $(".example").annotator({

      popoverContents: "#annotate_settings",
      minimumCharacters: 10,
      makeTextEditable: true,
      onannotationsaved: function () {
        //   $.Annotator.cache = {
        //     annotations: {},
        //     activeAnnotation: {
        //         id: null,
        //         attributes: {}
        //     },
        //     activePopper: {}
        // };

        var pre = Object.values(

          $.Annotator.cache.annotations
        ).map((item: any) => {
          item.attributes.id = item.id;
          return item.attributes;
        });
        App.handlers.renderSavedAnnotations(pre);


      },
      onselectioncomplete: function () {
        self.selectedText = this.outerText;
        App.handlers.fillNotes(this.outerText);
        App.helpers.showBackdrop(true);

      },
      onerror: function () {
        App.helpers.showError(App.constants.errors[this]);
      }
    });

    App.elements.tags = $(".ui.dropdown")
      .dropdown({
        clearable: true,
        direction: "upward",
        onChange: function (value, text, $choice) {
          if ($choice)
            App.handlers.applyTag($choice.attr("name"));
        }
      });


  }
  test1() {
    this.App.handlers.saveAnnotation()
  }
  test2() {
    this.App.handlers.cancelAnnotation()
  }


  test3(id) {
    var self = this;

    // this.App.handlers.deleteAnnotation(id)
    Object.keys(self.annotations).map((key) => {
      (self.annotations[key].forEach((x) => {
        if (id == x.id) {
          let index = self.annotations[key].findIndex(x => x.id == id)
          self.annotations[key].splice(index, 1)


          if (x.id) {


            var $delAnnotation = $(`#${x.id}`);

            $delAnnotation.prop("outerHTML",
              $delAnnotation.html()
            );
          }
          $.Annotator.api.deleteAnnotation(x.id);


        }
      }))
    })

    Object.keys(self.annotations).map((key) => {
      if (self.annotations[key].length == 0)
        delete self.annotations[key]
      //document.getElementById(x.id)[0].removeAttribute("id");
    })
    self.App.handlers.renderSavedAnnotations(self.annotations, true)


    sessionStorage.setItem("datas", JSON.stringify(self.annotations));
  }
  public allsavedannotations = {};
  annotatedDataSubmit(e) {
    // let objectOrder = {
    //   'objectives': null,
    //   'methods': null,
    //   'results':null,
    //   'conclusions':null
    // } 
    // var y= Object.assign(objectOrder,e)
    for (var key in Object(e)) {
      e[key].sort(function (a, b) {
        return a.x - b.x;
      })
    }

    var text = document.getElementById('last').innerHTML;
    var object1 = { annotations: e, handler: $.Annotator.cache.annotations }
    if (this.id) {
      this.allsavedannotations = {
        "pdf_key": this.savelaterpdf_key,
        "name": this.filename,
        "html": text,
        "annotations": object1,
        "manuscript_id": this.id
      }
    } else {
      this.allsavedannotations = {
        "pdf_key": this.pdf_key,
        "name": this.filename,
        "html": text,
        "annotations": object1

      }
    }
    this.appDataService.sendAllSavedAnnotations(this.allsavedannotations).subscribe(res => {


      this.router.navigateByUrl('/dashboard')
      sessionStorage.removeItem('datas');

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
    } })

  }
  // var text = document.getElementById('last').innerHTML;
  // sessionStorage.setItem("store", text);
  saveLater(x) {
    var text = document.getElementById('last').innerHTML;
    // let objectOrder = {
    //   'objectives': null,
    //   'methods': null,
    //   'results':null,
    //   'conclusions':null
    // } 
    // var y= Object.assign(objectOrder,x)

var object1 = { annotations: x, handler: $.Annotator.cache.annotations }
  
    
    


    if (this.savelaterpdf_key) {
      this.allsavedannotations = {
        "pdf_key": this.savelaterpdf_key,
        "name": this.filename,
        "annotation_html": text,
        "annotations": object1,
        "manuscript_id": this.id
      }
    }
    else {
      this.allsavedannotations = {
        "pdf_key": this.pdf_key,
        "name": this.filename,
        "annotation_html": text,
        "annotations": object1,


      }
    }
    this.appDataService.saveLaterAnnotation(this.allsavedannotations).subscribe(res => {
      this.router.navigateByUrl('/dashboard')
    })
  }
  groupByKey(array, key) {
    return array
      .reduce((hash, obj) => {
        if (obj[key] === undefined) return hash;
        return Object.assign(hash, { [obj[key]]: (hash[obj[key]] || []).concat(obj) })
      }, {})
  }

  getQuestionsList() {
    this.appDataService.getQuestionList().subscribe(res => {
      this.resultlist = res;
      this.groupeddata = this.groupByKey(res.body, 'section')

    })
  }
  result1 = {};
  result2 = {};
  plsremaning() {


    var data = this.groupeddata;

    var keys = this.annotations ? Object.keys(this.annotations) : []
    for (var key in data) {

      if (keys.includes(key)) {
        this.result2[key] = data[key];
      }
      else {
        this.result1[key] = data[key];
      }


    }
    console.log(Object.keys(this.result1).length, Object.keys(this.result2).length)
  }
  closePlsRemaning() {
    this.result1 = {};
  }

  discard() {
    this.router.navigateByUrl('/dashboard')
  }
  error
  getHtml() {

    this.appDataService.getHtml(this.convertedfile).subscribe(res => {

      this.innerhtml = res.body.html_content
      console.log(res)

    }, err => {
      this.error = err;
      if (err.status === 400) {
        if (err.error.message) {

          this.router.navigateByUrl('/dashboard')
        }
      }
      if (err.status === 500) {
        this.router.navigateByUrl('/dashboard')
      }

      console.log(err)
    }
    )




  }
  timer
  againReload() {
    if (this.innerhtml || this.error) {

      return
    }


    this.getHtml()
    let app = this
    this.timer = setTimeout(function () {

      app.againReload()

    }, 10000);

  }


}
