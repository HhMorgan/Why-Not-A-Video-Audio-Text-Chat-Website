import { Component, OnInit } from '@angular/core';
declare var jquery:any;
import * as $ from 'jquery';

@Component({
  selector: 'app-session',
  templateUrl: './template/dashboard.component.html',
  styleUrls: ['./template/dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  directive=0;
  first=false;
  second=false;
  thrid=false;
  fourth=false;
  fifth=false;
  constructor() { }
  
  ngOnInit() {
    $(document).ready( function() {

      $('body').on("click", ".larg div h3", function(){
        if ($(this).children('span').hasClass('close')) {
          $(this).children('span').removeClass('close');
        }
        else {
          $(this).children('span').addClass('close');
        }
        $(this).parent().children('p').slideToggle(250);
      });
    
      $('body').on("click", "nav ul li a", function(){
        var title = $(this).data('title');
        $('.headerH2').children('a').html(title);
        console.log(this.directive);
      });
      $("main .card-dashboard div").hide();

      $("#Profile").click(function(){
        $("main .card-dashboard div").hide();
           $("#element1").toggle();
           this.directive=1;
      });
  
      $("#Edit").click(function(){
        $("main .card-dashboard div").hide();
           $("#element2").toggle();
           this.directive=2;
      });
  
      $("#Add").click(function(){
        $("main .card-dashboard div").hide();
           $("#element3").toggle();
           this.directive=3;
      });
      $("#Remove").click(function(){
        $("main .card-dashboard div").hide();
        $("#element4").toggle();
        this.directive=4;
    });
   $("#Announce").click(function(){
    $("main .card-dashboard div").hide();
      $("#element5").toggle();
      this.directive=5;
    });
    });
      
  }
  directive1(){
    this.first=true;
    this.second=false;
    this.thrid=false;
    this.fourth=false;
    this.fifth=false;
  }
  directive2(){
    this.first=false;
    this.second=true;
    this.thrid=false;
    this.fourth=false;
    this.fifth=false;
  }
  directive3(){
    this.first=false;
    this.second=false;
    this.thrid=true;
    this.fourth=false;
    this.fifth=false;
  }
  directive4(){
    this.first=false;
    this.second=false;
    this.thrid=false;
    this.fourth=true;
    this.fifth=false;
  }
  directive5(){
    this.first=false;
    this.second=false;
    this.thrid=false;
    this.fourth=false;
    this.fifth=true;
  }
}