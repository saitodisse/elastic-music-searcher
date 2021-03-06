/*global define*/

define([
    'jquery',
    'underscore',
    'backbone',
    '../communicator/communicator',
    'templates'
], function ($, _, Backbone, communicator, JST) {
    'use strict';

    var SearchResultItemView = Backbone.View.extend({
        template: JST['app/scripts/templates/searchResultItemView.hbs'],

        tagName: 'tr',

        id: '',

        className: '',

        events: {
            'click #btnPlay': 'play',
            'click #btnAdd': 'addSong'
        },

        initialize: function () {
            communicator.on('player:selected', this.playerSelected, this);
        },

        render: function () {
            var html = this.template(this.model.toJSON());
            this.$el.html(html);
        },

        play: function(e) {
            var jButton = $(e.target).parent();
            
            // Is Stop?? stop, them
            var jSpanGlyphiconStop = jButton.find('.glyphicon-stop');
            if(jSpanGlyphiconStop.length > 0){
                this.stop(jButton);
                return;
            }

            this.resetAllButtonsToPlay(jButton);
            this.setButtonToStop(jButton);
            
            //get url
            var jLink = jButton.find('#downloadLink');
            var url = jLink.attr('href');
            communicator.trigger('play:preview', url);
        },

        stop: function(jButton) {
            this.resetAllButtonsToPlay(jButton);
            communicator.trigger('stop:preview');
        },

        resetAllButtonsToPlay: function(jButton) {
            //remove stop from all in page
            var jAllStopSpanGlyphicons = jButton.parent().parent().parent().find('.glyphicon-stop');
            jAllStopSpanGlyphicons.removeClass('glyphicon-stop');
            jAllStopSpanGlyphicons.removeClass('glyphicon-play');
            jAllStopSpanGlyphicons.addClass('glyphicon-play');
        },

        setButtonToStop: function(jButton) {
            var jSpanGlyphicon = jButton.find('.glyphicon');
            jSpanGlyphicon.removeClass('glyphicon-play');
            jSpanGlyphicon.addClass('glyphicon-stop');
        },

        playerSelected: function(player) {
            this.playerToSend = player;
        },

        addSong: function() {
            if(!this.playerToSend){
                alert('Please, select a player.');
                return;
            }

            communicator.trigger('socket:message', {
                name: 'toSocket:playlist:add',
                data: {
                    player: this.playerToSend.toJSON(),
                    song: this.model.toJSON()
                }
            });
        }
    });

    return SearchResultItemView;
});
