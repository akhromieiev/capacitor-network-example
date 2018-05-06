import { Component } from '@angular/core';
import { NavController, ToastController } from 'ionic-angular';
import { Plugins, NetworkStatus } from '@capacitor/core';

const { Network } = Plugins;

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  status: NetworkStatus;
  listener: any;

  constructor(public navCtrl: NavController, private toastCtrl: ToastController) {

  }

  ionViewDidEnter() {
    this.getStatus();
    this.startListenNetwork();
  }

  ionViewWillLeave(){
    this.stopListenNetwork();
  }

  async getStatus() {
    try {
      this.status = await Network.getStatus();
    }
    catch (e) {
      console.log("Error", e)
    }
  }

  startListenNetwork() {
    this.listener = Network.addListener('networkStatusChange', (status) => {
      if(!status.connected){
        this.presentToast("Your internet connection appears to be offline. Data integrity is not guaranteed.");
      }
    });
  }

  stopListenNetwork() {
    if (this.listener)
      this.listener.remove();

  }

  presentToast(msg) {
    let toast = this.toastCtrl.create({
      message: msg,
      duration: 3000,
      position: 'bottom'
    });
  
    toast.onDidDismiss(() => {
      console.log('Dismissed toast');
    });
  
    toast.present();
  }

}
