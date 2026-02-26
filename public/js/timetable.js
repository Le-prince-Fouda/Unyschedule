//importrant variable declaration
var contenu= document.querySelectorAll('article div');
var contenuLength= contenu.length,
    menu=document.querySelectorAll('nav button'),
    menuLength= menu.length;


// function 
function onglet(evt, nom){
   for(var i=0; i<contenuLength; i++){
      contenu[i].style.display='none';
      contenu[i].className= contenu[i].className.replace('affiche', '');
   }
   for(var i=0; i<menuLength; i++){
      menu[i].className= menu[i].className.replace('active', '');
   }
   document.getElementById(nom).style.display= 'block';
   evt.currentTarget.className+= 'active'
}

var tableau=document.querySelectorAll('#form_valider table')
               for(var i=0; i<tableau.length; i++){
               tableau[i].style.display='none';
            }
//passage du menu commencer au menu valider
var btn_valider=document.getElementById('btn_valider');
    btn_valider.addEventListener('click', function(e){
      e.preventDefault();
         var confirm_dep=document.getElementById('confirm_dep');
         if(confirm_dep.value=='--'){
            alert('Aucun departement n\'est selectionne')
         }else{
            for(var i=0; i<contenuLength; i++){
                contenu[i].style.display='none';
                contenu[i].className= contenu[i].className.replace('affiche', '');
             }
             for(var i=0; i<menuLength; i++){
                menu[i].className= menu[i].className.replace('active', '');
             }
             document.getElementById('valider').style.display= 'block';
             menu_valider= document.getElementById('menu_valider');
             menu_valider.className+= 'active';
             var tableau=document.querySelectorAll('#form_valider table')
               for(var i=0; i<tableau.length; i++){
               tableau[i].style.display='none';
            }
            document.getElementById(confirm_dep.value).style.display= 'block';
            document.getElementById('envoyer').style.display= 'block';
         }
    }, false);
    console.log(salle)
    /************* Systeme d'onglet de la validation de l'emploi de temps*************/
    (function(){
      
      
})()


/************** */






///////////dynamique dropdow select/////////////
function extractP1(element){
   var e=element.parentNode.previousElementSibling;
   if(e.hasChildNodes){
      var select1=e.firstChild;
        while(select1.nodeName!== 'SELECT'){
         select1=select1.nextSibling;
         
      }
      return fils
   }
}

function extractP2(element){
   var select2;
   select2=extraction(element);
   select2=extraction(select2)
   return select2
   
}

function extractChild(element){
   var e=element.parentNode.nextElementSibling;
   if(e.hasChildNodes){
      var select3=e.firstChild;
        while(select3.nodeName!== 'SELECT'){
         select3=select3.nextSibling;
         
      }
      return select3
   }
}
   
 




 function fetch_data(parent1, parent2, parent3, child){
    fetch('/get_horaire_data?parent1='+parent1.value+ '&parent2='+parent2.value+'&parent3='+parent3.value+'').then(
       function(response){
          return response.json();
       }).then(function(resData){
          var html='';

            html='<option value=""> Selectionner salle </option>'

          for(var count=0; count<resData.length; count++){
            html+='<option value="'+resData[count]+'">'+resData[count]+'</option>'
         }
          
          child.innerHTML= html;
       })
 }

function appel(a){
   fetch_data( a, extractP1(a), extractP2(a), extractChild(a))
}
