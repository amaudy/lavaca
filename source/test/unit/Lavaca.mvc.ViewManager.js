(function(Controller, Router, ViewManager, View, PageView, $, Promise) { 

var viewManager;

describe('A ViewManager', function() {
  beforeEach(function(){
    $('body').append('<div id="view-root"></div><script type="text/dust-template" data-name="hello-world">Hello World</script>');
    Lavaca.ui.Template.init();
    viewManager = new ViewManager('#view-root');
  });
  afterEach(function(){
    $('#view-root').remove();
    $('script[data-name="hello-world"]').remove();
  });
  it('can be instantiated', function() {
		expect(viewManager instanceof ViewManager).toBe(true);
  });
  it('can load a view', function() {
    var myPageView = Lavaca.mvc.PageView.extend(function(){PageView.apply(this, arguments);},{
          template: 'hello-world'
        }),
        promise,
        response;
    runs(function() {
      promise = viewManager.load('myView', myPageView);
    });
    waitsFor(function() {
      promise.success(function() {
        response = viewManager.pageViews.get('myView').hasRendered;
      });
      return response;
    }, 'a view to be rendered', 300);
    runs(function() {
      expect(response).toBe(true)
    });
  });
  describe('can remove', function() {
    it('a view on a layer and all views above', function() {
      var myPageView = Lavaca.mvc.PageView.extend(function(){PageView.apply(this, arguments);},{
          template: 'hello-world'
          }),
          promise,
          secondP,
          response;

      runs(function() {
        promise = viewManager.load('myView', myPageView);
      });
      waitsFor(function() {
        promise.success(function() {
          response = true;
        });
        return response;
      }, 'a view to be rendered', 300);
      runs(function() {
        secondP = viewManager.load('anotherView', myPageView, null, 1);
      });
      waitsFor(function() {
        secondP.success(function() {
          response = true;
        });
        return response;
      }, 'a view to be rendered', 300);
      runs(function() {
        expect($('#view-root').children().length).toBe(2);
        viewManager.dismiss(0);
        expect($('#view-root').children().length).toBe(0);
      });
    });
    it('a view on layer without removing views below', function() {
      var myPageView = Lavaca.mvc.PageView.extend(function(){PageView.apply(this, arguments);},{
          template: 'hello-world'
          }),
          promise,
          secondP,
          response;

      runs(function() {
        promise = viewManager.load('myView', myPageView);
      });
      waitsFor(function() {
        promise.success(function() {
          response = true;
        });
        return response;
      }, 'a view to be rendered', 300);
      runs(function() {
        secondP = viewManager.load('anotherView', myPageView, null, 1);
      });
      waitsFor(function() {
        secondP.success(function() {
          response = true;
        });
        return response;
      }, 'a view to be rendered', 300);
      runs(function() {
        expect($('#view-root').children().length).toBe(2);
        viewManager.dismiss(1);
        expect($('#view-root').children().length).toBe(1);
      });
    });
    it('a layer by an el', function() {
      var myPageView = Lavaca.mvc.PageView.extend(function(){PageView.apply(this, arguments);},{
            template: 'hello-world',
            className: 'test-view'
          }),
          promise,
          response;
      runs(function() {
        promise = viewManager.load('myView', myPageView);
      });
      waitsFor(function() {
        promise.success(function() {
          response = viewManager.pageViews.get('myView').hasRendered;
        });
        return response;
      }, 'a view to be rendered', 300);
      runs(function() {
        viewManager.dismiss('.test-view');
        expect($('#view-root').children().length).toBe(0);
      });
    });
    it('a layer relative to view object in the cache', function() {
      var myPageView = Lavaca.mvc.PageView.extend(function(){PageView.apply(this, arguments);},{
            template: 'hello-world',
            className: 'test-view'
          }),
          promise,
          response;
      runs(function() {
        promise = viewManager.load('myView', myPageView);
      });
      waitsFor(function() {
        promise.success(function() {
          response = viewManager.pageViews.get('myView').hasRendered;
        });
        return response;
      }, 'a view to be rendered', 300);
      runs(function() {
        viewManager.dismiss(viewManager.pageViews.get('myView'));
        expect($('#view-root').children().length).toBe(0);
      });
    });
  });
  it('can empty the view cache', function() {
    var myPageView = Lavaca.mvc.PageView.extend(function(){PageView.apply(this, arguments);},{
            template: 'hello-world',
        }),
        promise,
        secondP,
        response;

    runs(function() {
      promise = viewManager.load('myView', myPageView);
    });
    waitsFor(function() {
      promise.success(function() {
        response = true;
      });
      return response;
    }, 'a view to be rendered', 300);
    runs(function() {
      secondP = viewManager.load('anotherView', myPageView, null, 1);
    });
    waitsFor(function() {
      secondP.success(function() {
        response = true;
      });
      return response;
    }, 'a view to be rendered', 300);
    runs(function() {
      viewManager.dismiss(1);
      viewManager.flush();
      expect(viewManager.pageViews).toEqual(new Lavaca.util.Cache);
      expect(viewManager.layers[0].cacheKey).toEqual('myView');
    });
  });

});

})(Lavaca.resolve('Lavaca.mvc.Controller', true), Lavaca.resolve('Lavaca.mvc.Router', true), Lavaca.resolve('Lavaca.mvc.ViewManager', true), Lavaca.resolve('Lavaca.mvc.View', true), Lavaca.resolve('Lavaca.mvc.PageView', true), Lavaca.$, Lavaca.resolve('Lavaca.util.Promise', true));
