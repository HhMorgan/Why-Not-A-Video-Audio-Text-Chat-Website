import { Component, OnInit } from '@angular/core';
declare var jquery:any;
import * as $ from 'jquery';

@Component({
  selector: 'app-session',
  templateUrl: './template/dashboard.component.html',
  styleUrls: ['./template/dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  
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
          $('.title').children('h2').html(title);
        });
        $("main .card-dashboard div").hide();

        $("#Profile").click(function(){
          $("main .card-dashboard div").hide();
             $("#element1").toggle();
        });
    
        $("#Edit").click(function(){
          $("main .card-dashboard div").hide();
             $("#element2").toggle();
        });
    
        $("#Add").click(function(){
          $("main .card-dashboard div").hide();
             $("#element3").toggle();
        });
        $("#Remove").click(function(){
          $("main .card-dashboard div").hide();
          $("#element4").toggle();
      });
     $("#Announce").click(function(){
      $("main .card-dashboard div").hide();
        $("#element5").toggle();
      });
      });
      
  }

}