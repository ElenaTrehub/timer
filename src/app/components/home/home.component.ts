import {Component, ElementRef, OnInit, ViewChild, AfterViewInit} from '@angular/core';
import {Observable, fromEvent} from 'rxjs';
import { map, bufferTime, debounceTime, filter} from 'rxjs/operators';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.sass']
})
export class HomeComponent implements OnInit, AfterViewInit {
  isStart = false;
  second = 0;
  minute = 0;
  hour = 0;
  counter = 0;
  timer: Observable<any>;
  obsTimer;
  obsWait;
  streamClick: Observable<any>;
  double;


  constructor() {
    this.timer = new Observable(observer => {

      const intervalId = setInterval(() => {
      observer.next(this.counter++); }, 1000);

    return () => {
        clearInterval(intervalId);
      }

  }); }
  @ViewChild('await') btnAwait: ElementRef;


  Start(){
    if(this.isStart){
      return;
    }
    else{
      this.obsTimer = this.timer.subscribe({next: (val) => this.ShowTimer(val)});
      this.isStart = true;
    }

  } // Start()
  Wait(){
    this.obsWait = this.double.subscribe({
      next: (click) => {console.log(click); if(click === 2){
        this.Stop();
      }}
    });
  }
  Stop(){
    if(!this.isStart){
      return;
    }
    else{
      this.obsTimer.unsubscribe();
      this.isStart = false;
    }

  }
  Reset(){
    if(!this.isStart){
      return;
    }
    else{
      this.obsTimer.unsubscribe();
      this.isStart = false;
      this.counter = 0;
      this.minute = 0;
      this.second = 0;
      this.hour = 0;
    }

  }
  ShowTimer(val){
    if(val > 59){
      this.second = 0;
      this.minute++;
      this.counter = 0;
    }
    else{
      this.second = val;
    }

    if(this.minute > 59){
      this.minute = 0;
      this.hour++;
    }


  } //ShowTimer()


  ngOnInit() {
  }
  ngAfterViewInit(){

    this.streamClick = fromEvent(this.btnAwait.nativeElement, 'click');

    this.double = this.streamClick.pipe(map(e => e.timeStamp.toFixed(0)))
      .pipe(bufferTime(300))
      .pipe(map((list) => { return list.length; }))
      .pipe(filter((x) => { return x === 2; }));



    //timeInterval()
     // .scan<number>((acc, val) => val.interval < 250 ? acc + 1 : 0, 0)
      //.filter(val => val === 1);


  }
}
