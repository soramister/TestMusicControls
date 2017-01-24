import { Component } from '@angular/core';

import { NavController, Platform } from 'ionic-angular';
import { MediaPlugin, BackgroundMode, MusicControls } from 'ionic-native';

@Component({
	selector: 'page-home',
	templateUrl: 'home.html'
})
export class HomePage {
	audio = null;
	status = 0;
	buttonText: string = 'Play';
	streamUrl: string = 'http://listen.radionomy.com/absolute-hits';

	constructor(public navCtrl: NavController, private platform: Platform) {
		if (!this.platform.is('cordova')) {
			this.audio = new Audio(this.streamUrl);
		}
		console.log(this.audio);
	}

	toggleMusic() {
		console.log(this.status);
		if (this.status == 1) {
			this.audio.pause();

			this.updateButtonPlay('play');

			if (this.platform.is('cordova')) {
				MusicControls.updateIsPlaying(false);
				BackgroundMode.disable();
			}
		} else {
			if (this.platform.is('cordova')) {
				this.audio = new MediaPlugin(this.streamUrl);
			}

			this.audio.play();

			this.updateButtonPlay('pause');

			if (this.platform.is('cordova')) {
				BackgroundMode.enable();

				MusicControls.create({
					track       : 'Time is Running Out',        // optional, default : ''
					artist      : 'Muse',                     // optional, default : ''
					cover       : 'https://upload.wikimedia.org/wikipedia/en/4/4c/Muse_tirocd.jpg',      // optional, default : nothing
					// cover can be a local path (use fullpath 'file:///storage/emulated/...', or only 'my_image.jpg' if my_image.jpg is in the www folder of your app)
					//           or a remote url ('http://...', 'https://...', 'ftp://...')
					isPlaying   : true,                           // optional, default : true
					dismissable : true,                         // optional, default : false

					// hide previous/next/close buttons:
					hasPrev   : false,      // show previous button, optional, default: true
					hasNext   : false,      // show next button, optional, default: true
					hasClose  : true,       // show close button, optional, default: false

					// iOS only, optional

					// Android only, optional
					// text displayed in the status bar when the notification (and the ticker) are updated
					ticker    : 'Now playing "Time is Running Out"'
				});

				MusicControls.subscribe().subscribe(action => {
					console.log('Musiccontrol_action', action);

					switch (action) {
						case 'music-controls-next':
						// Do something
						break;
						case 'music-controls-previous':
						// Do something
						break;
						case 'music-controls-pause':
							this.toggleMusic();
						break;
						case 'music-controls-play':
							this.toggleMusic();
						break;
						case 'music-controls-destroy':
						// Do something
						break;

						// Headset events (Android only)
						case 'music-controls-media-button' :
						// Do something
						break;
						case 'music-controls-headset-unplugged':
						// Do something
						break;
						case 'music-controls-headset-plugged':
						// Do something
						break;
						default:
						break;
					}

				});

				MusicControls.listen(); // activates the observable above

				MusicControls.updateIsPlaying(true);
			}
		}
	}

	updateButtonPlay(state) {
		switch (state) {
			case "play":
				this.status = 0;
				this.buttonText = 'Play';
			break;
			case "pause":
				this.status = 1;
				this.buttonText = 'Pause';
			break;
		}
	}

}
