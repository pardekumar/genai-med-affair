/**
 * @author      Deepak K Anand
 * @version     1.0.0 (Beta)
 * @todo        (a) Add Comments
 *              (b) Fix bugs
 *              (c) Git Repo
 *              (d) Performance Testing
 */

 (function($) {
    $.fn.annotator = function(options) {
        var self = this;

        this.constants = {
            errorCodes: {

            }
        };

        this.defaults = {
            surroundWith: "div",
            minimumCharacters: 10,
            makeTextEditable: false
        };

        if (!window.Popper)
            throw Error("Annotate.js requires Popper");

        if (!options)
            throw Error("Missing configuration options");

        if (!options.popoverContents)
            throw Error("Missing option: popoverContents");

        if (jQuery(options.popoverContents).length === 0)
            throw Error(`Missing popoverContents element on DOM: ${options.popoverContents}`);

        var settings = $.extend(
            this.defaults,
            options
        );

        jQuery.Annotator = {};


        jQuery.Annotator.cache = {
            annotations: {},
            activeAnnotation: {
                id: null,
                attributes: {}
            },
            activePopper: {}
        };
        if(JSON.parse(sessionStorage.getItem('hand'))){
            jQuery.Annotator.cache.annotations =JSON.parse(sessionStorage.getItem('hand'))
        }

        jQuery.Annotator.api = {
            captureActiveAnnotationNotes: function(notes) {
                var cache = jQuery.Annotator.cache;

                jQuery(`#${cache.activeAnnotation.id}`).attr("notes", notes);
            },
            tagActiveAnnotation: function(tagType) {
                var cache = jQuery.Annotator.cache;

                jQuery(`#${cache.activeAnnotation.id}`).attr("type", tagType);
            },
            destroyActiveAnnotation: function() {
                var cache = jQuery.Annotator.cache;
                var api = jQuery.Annotator.api;

                var $activeAnnotation = jQuery(`#${cache.activeAnnotation.id}`);

                $activeAnnotation.prop("outerHTML",
                    $activeAnnotation.html()
                );

               delete cache.annotations[cache.activeAnnotation.id];

                api.resetActiveAnnotation();
            },
            validateAttributes: function(attributes) {
                var dataValid = true;

                for (var key in attributes) {
                    if (attributes[key] === undefined ||
                        attributes[key] === null ||
                        attributes[key].trim() === "") {
                        dataValid = false;
                    }
                }

                return dataValid;
            },
            saveActiveAnnotation: function() {
               
                var cache = jQuery.Annotator.cache;
                var api = jQuery.Annotator.api;
              
                var $activeAnnotation = jQuery(`#${cache.activeAnnotation.id}`);

                cache.activeAnnotation.attributes = {
                    type: $activeAnnotation.attr("type"),
                    notes: $activeAnnotation.attr("notes")
       
                };

                if (!api.validateAttributes(cache.activeAnnotation.attributes)) {
                    return {
                        isSaved: false,
                        errorCode: "MISSING_FIELDS"
                    };
                }

                $activeAnnotation.removeAttr("current");
                $activeAnnotation.removeAttr("onselectstart", "return false;");

                cache.annotations[cache.activeAnnotation.id].attributes =
                    cache.activeAnnotation.attributes;
                cache.annotations[cache.activeAnnotation.id].attributes.x = window.xvalue;
                cache.annotations[cache.activeAnnotation.id].attributes.y = window.yvalue;

                api.resetActiveAnnotation();
                
             
               
                if (settings.onannotationsaved) {
                 
                    settings.onannotationsaved.apply({
                        annotations: Object.values(
                            cache.annotations
                        ).map((item) => {
                     
                            item.attributes.id = item.id;
                            item.attributes.saved = true;
                            return item.attributes;
                        })
                    });
                }

                return {
                    isSaved: true
                };
              
            },
            
            resetActiveAnnotation: function() {
                var cache = jQuery.Annotator.cache;

                cache.activeAnnotation = {
                    id: null,
                    attributes: {}
                };

                cache.activePopper.destroy();

                cache.activePopper = {};

                jQuery(settings.popoverContents).hide();
            },
            deleteAnnotation: function(annotationId) {
                var cache = jQuery.Annotator.cache;

                var delAnnotation = cache.annotations[annotationId];

                if (delAnnotation) {
                    delete cache.annotations[annotationId];

                    var $delAnnotation = jQuery(`#${delAnnotation.id}`);

                    $delAnnotation.prop("outerHTML",
                        $delAnnotation.html()
                    );
                }

                return Object.values(
                    cache.annotations
                ).map((item) => {
                    item.attributes.id = item.id;
                    return item.attributes;
                });
            }
        };

        var storeAnnotation = function() {
            var cache = jQuery.Annotator.cache;


            var id = `annotation_${ Object.keys( cache.annotations ).length + 1 }`;
if(sessionStorage.getItem('datas')){
var x = JSON.parse(sessionStorage.getItem('datas'))
yy= []
 Object.keys(x).map((key) => {
    (x[key].forEach((res) => {
   
      yy.push(parseInt(res.id[res.id.length -1]))
    }))
  }) 



if(Object.keys( cache.annotations ).length + 1 <= Math.max(...yy)){
    var id = `annotation_${ Math.max(...yy) + 1 }`; 
}
}

            cache.annotations[id] = {
                id: id,
                attributes: {}
            };

            cache.activeAnnotation = cache.annotations[id];

            return id;
        };

        var getPopoverContents = function() {
            return jQuery(settings.popoverContents)[0];
        };

        var showPopover = function($annotation) {
            var cache = jQuery.Annotator.cache;

            window.getSelection().empty();

            jQuery(settings.popoverContents).show();

            cache.activePopper = Popper.createPopper($annotation, getPopoverContents());

            if (settings.onselectioncomplete) {
                settings.onselectioncomplete.apply($annotation);
            }
        };

        var handleMouseUp = function(e) {
            if (window.getSelection) {
                selection = window.getSelection();
                sort = e.clientX

                if (selection.rangeCount) {
                    range = selection.getRangeAt(0);

                    if (range.cloneContents().textContent.split(' ').length >= settings.minimumCharacters) {
                        var $annotation = document.createElement(settings.surroundWith);

                        jQuery($annotation).html(
                            $("<div>").append(range.cloneContents()).html()
                        );

                        jQuery($annotation).attr("id", storeAnnotation());
                        jQuery($annotation).attr("current", "true");
                        jQuery($annotation).attr("onselectstart", "return false;");

                        range.deleteContents();

                        range.insertNode($annotation);

                        showPopover($annotation);
                    } else if (range.toString().length !== 0 &&
                        range.cloneContents().textContent.split(' ').length <= settings.minimumCharacters
                    ) {
                        if (settings.onerror) {
                            settings.onerror.apply("INSUFFICIENT_CHARS");
                        }
         
                    }
                }
               
            }
       
        
        };
        var handleMouseDown = function (e) {
         window.xvalue = e.clientX;
        
       window.yvalue = e.clientY;
    
        };

        var init = function() {
            self.each(
                function() {
                    if (settings.makeTextEditable) {
                        jQuery(this).attr("contenteditable", false);
                    }

                    jQuery(this).mouseup(handleMouseUp);
                    jQuery(this).mousedown(handleMouseDown);
                }
            );
        };

        init();
    };
}(jQuery));