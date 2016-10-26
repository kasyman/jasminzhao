var pano = Bone.extend({}, Bone.Events, {
    init: function (stage) {
        var _self = this;
        this.stage = stage;
                
        //
        var actorData = [
            {
                name: 'part1', lon: 266, lat: 0,
                actor: {x: 0, y: 0, url: 'banner1.png'},
                info: {x: 0, y: -380, url: 'title1.png'}
            },
            {
                name: 'part2', lon: 338, lat: 0,
                actor: {x: 0, y: 0, url: 'banner2.png'},
                info: {x: 0, y: -380, url: 'title2.png'}
            },
            {
                name: 'part3', lon: 50, lat: 0,
                actor: {x: 0, y: 0, url: 'banner3.png'},
                info: {x: 0, y: -380, url: 'title3.png'}
            },
            {
                name: 'part4', lon: 122, lat: 0,
                actor: {x: 0, y: 0, url: 'banner4.png'},
                info: {x: 0, y: -380, url: 'title4.png'}
            },
            {
                name: 'part5', lon: 194, lat: 0,
                actor: {x: 0, y: 0, url: 'banner5.png'},
                info: {x: 0, y: -380, url: 'title5.png'}
            },
        ];
        var actors = new C3D.Sprite();
        actors.name('actors').position(0, 0, 0).update();
        var _len = actorData.length;
        $.each(actorData, function (i, obj) {
            var _data = obj;
            var _lon = _data.lon;
            var _lat = _data.lat;
            var _l = 1200;
            var _alon = _lon / 180 * Math.PI;
            var _alat = _lat / 180 * Math.PI;
            var _x = Math.cos(_alat) * _l * Math.sin(_alon);
            var _y = Math.sin(_alat) * _l;
            var _z = -Math.cos(_alat) * _l * Math.cos(_alon);
            var _item = C3D.create({
                type: 'sprite',
                name: _data.name,
                position: [_x, _y, _z],
                rotation: [0, -_lon, 0],
                scale: [2],
                children: [
                    {
                        type: 'plane',
                        name: 'actor',
                        position: [_data.actor.x, _data.actor.y, 0],
                        size: [750, 930],
                        material: [{image: '../img/' + _data.actor.url, bothsides: false}],
                    },
                    {
                        type: 'plane',
                        name: 'info',
                        position: [_data.info.x, _data.info.y, 10],
                        scale: [0, 0, 1],
                        size: [750, 322],
                        visibility: [{alpha: 0}],
                        material: [{image: '../img/' + _data.info.url, bothsides: false}],
                    },
                ]
            });

            // JT.to(_item, 3, {
            //     y: '+=50',
            //     ease: JT.Quad.InOut,
            //     repeat: -1,
            //     yoyo: true,
            //     delay: Math.random() * 3,
            //     onUpdate: function () {
            //         this.target.updateT();
            //     }
            // });

            _item.on('touchend', function () {
                if (Math.abs(gesture.dx) > 10 || Math.abs(gesture.dy) > 10) return;
                _self.trigger('item', i);
            });
            _item.r0 = _lon;
            _item.data = _data;

            actors.addChild(_item);
        });
        this.stage.addChild(actors);

    },
});
