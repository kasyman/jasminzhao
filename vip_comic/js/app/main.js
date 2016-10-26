var main = Bone.extend({}, Bone.Events, {
    init: function () {
        var _self = this;
        this.$main = $('#main');

        gesture.init(this.$main);


        this.stage = new C3D.Stage();
        this.stage.size(window.innerWidth, window.innerHeight).update();
        this.$main.append(this.stage.el);

        this.root = new C3D.Sprite();
        this.root.position(0, -100, -600).update();
        this.stage.addChild(this.root);

        pano.init(this.root);

        //
        this.wall = new C3D.Sprite();
        this.wall.name('wall').position(0, -150, -600).update();
        this.stage.addChild(this.wall);
        var wallbg = C3D.create({
            type: 'plane',
            size: [1800, 1600],
            position: [2500, 0, -2000],
            rotation: [0, -50, 0],
            scale: [4.5],
            material: [{
                image: '../img/bg.jpg', bothsides: false, size: 'cover'
            }]
        });
        this.wall.addChild(wallbg);


        $(window).on('resize', function () {
            _self.resize();
        });
        this.resize();

        this.initControl();
    },

    drag: {lon: 0, lat: 0},
    aim: {lat: 0, lon: 0},
    fix: {lon: 50, lat: 0}, // 设置初始值
    lock: true,
    initControl: function () {
        var _self = this;
        gesture.on('move', function (obj) {
            if (!_self.lock) {
                _self.drag.lon = (_self.drag.lon - obj.ax * 0.2) % 360;
                _self.drag.lat = Math.max(-90, Math.min(90, _self.drag.lat + obj.ay * 0.2));
            }
        });

        var orienter = new Orienter();
        orienter.handler = function (obj) {
            _self.aim.lat = obj.lat;
            _self.aim.lon = -obj.lon;

            if (_self.lock) {
                _self.fix.lat = -_self.aim.lat;
                _self.fix.lon = -_self.aim.lon;
            }
        };
        orienter.init();

        this.animate = this.animate.bind(this);

        _self.animateOn();
    },

    animateOn: function () {
        this.lock = false;
        this.animate();
    },

    animateOff: function () {
        this.lock = true;
        if (this.animateId) cancelAnimationFrame(this.animateId);
    },

    animateId: null,
    last_lon: 0,
    wall_lon: 0,
    init_lon: 0,
    animate: function () {
        this.animateId = requestAnimationFrame(this.animate);

        var _lon = (this.aim.lon + this.fix.lon + this.drag.lon) % 360;
        var _lat = (this.aim.lat + this.fix.lat + this.drag.lat) * 0.35;

        if (_lon - this.root.rotationY > 180) this.root.rotationY += 360;
        if (_lon - this.root.rotationY < -180) this.root.rotationY -= 360;

        this.root.rotationY += (_lon - this.root.rotationY) * 0.3;
        // this.root.rotationX += (_lat - this.root.rotationX) * 0.15;
        this.root.updateT();

        // wall
        if(!this.wall_lon){
            this.wall_lon = this.init_lon = _lon;
        } else {
            this.wall_lon = this.wall_lon + (this.last_lon - _lon)/4;
            if (this.wall_lon>this.init_lon+8){
                this.wall_lon=this.init_lon+8
            } else if (this.wall_lon<this.init_lon-8){
                this.wall_lon=this.init_lon-8
            }
        }
       
        this.last_lon = _lon;

        this.wall.rotationY += (this.wall_lon - this.wall.rotationY) * 0.3;
        this.wall.updateT();

        this.checkDots(this.root.rotationY);
    },

    checkDots: function (ry) {
        var _ry = ry % 360;
        _ry = _ry < 0 ? _ry + 360 : _ry;
        for (var i = 0, l = this.root.actors.children.length; i < l; i++) {
            var _actor = this.root.actors.children[i];
            if (_actor.r0 > _ry - 30 && _actor.r0 < _ry + 30) {
                if (_actor.info.alpha == 0) {
                    JT.kill(_actor.info);
                    JT.to(_actor.info, 0.3, {
                        x:_actor.data.info.x, y:_actor.data.info.y, scaleX: 1, scaleY: 1, alpha:1, ease: JT.Quad.Out, onUpdate: function () {
                            this.target.updateT().updateV();
                        }
                    });
                }
            } else {
                if (_actor.info.alpha == 1) {
                    JT.kill(_actor.info);
                    JT.to(_actor.info, 0.3, {
                        x:0, y:0, scaleX: 0, scaleY: 0, alpha:0, ease: JT.Quad.Out, onUpdate: function () {
                            this.target.updateT().updateV();
                        }
                    });
                }
            }
        }
    },

    timeId: null,
    resize: function () {
        var _self = this;
        if (this.timeId) clearTimeout(this.timeId);
        this.timeId = setTimeout(function () {
            _self.stage.size(window.innerWidth, window.innerHeight).update();
        }, 100);
    },

});



//////////////////
// 页面入口
function pageInit() {
    document.addEventListener('touchmove', function (e) { e.preventDefault(); }, false);

    $('.loading').remove();
    $('.wrapper').addClass('show');
    
    // 初始化页面
    window.setTimeout(function() {
        $('.first-page').addClass('zoomOut');
        main.init(); // 初始化全景
        window.setTimeout(function() {
            $('.first-page').remove();
        }, 1000)
    }, 2000)

    $('.tips').on('touchend', function(event) {
        event.preventDefault();
        $(this).remove();
        
    });

}


