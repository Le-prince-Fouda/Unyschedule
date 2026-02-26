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

//Pour le formulaire d'enregistrement des niveau les champs des effectifs 
//ne s'affichent que si le departement correspondant est selectionne
var effectif= document.getElementsByClassName('effectif'),
      check= document.getElementsByName('check');
for(i=0; i<effectif.length; i++){
   effectif[i].style.display='none';
}
for(var checkbox of check){
  checkbox.addEventListener('click', function(){
      if(this.checked==true){
         for(i=0; i<check.length; i++){
            if(this==check[i]){
               break
            }
         }
         effectif[i].style.display='block';
         effectif[i].required=true;
         effectif[i].name='effectif'
      }else{
         if(this.checked==false){
            for(i=0; i<check.length; i++){
               if(this==check[i]){
                  break
               }
            }
            effectif[i].style.display='none';
            effectif[i].require=false;
            effectif[i].name=''
      }
  }})
   
} 



//fonction permettant se verifier au moins une des cases a cocher du formulaire est selectionnee
//Sinon le formulaire ne peut etre soumis et un message d'erreur est envoyer 
(function(){
      var niv= document.getElementById('form_niv'),
         spec= document.getElementById('form_spec'),
         salle= document.getElementById('form_salle');
         ue= document.getElementById('form_ue');

      var appartient=document.getElementsByName('appartient'),
         niv_spec=document.getElementsByName('niv_spec'),
         ue_spec= document.getElementsByName('ue_spec');

      var valid_checkbox=[];
      niv.addEventListener('submit', function(event){
         for(var i=0; i<check.length; i++){
            if(check[i].checked==true){
               valid_checkbox.push(check[i]);
               break;
            }
         };
         if(valid_checkbox.length==0){
            alert('Vous devez selectionner tous les departements qui offre une formation dans ce niveau');
            event.preventDefault();
         }
      }, false);

      spec.addEventListener('submit', function(event){
         for(var i=0; i<niv_spec.length; i++){
            if(niv_spec[i].checked==true){
               valid_checkbox.push(check[i]);
               break;
            }
         };
         if(valid_checkbox.length==0){
            alert('Vous devez selectionner tous les niveaux ou la specialite apparaitra');
            event.preventDefault();
         }

      }, false)

      ue.addEventListener('submit', function(event){
         for(var i=0; i<ue_spec.length; i++){
            if(ue_spec[i].checked==true){
               valid_checkbox.push(ue_spec[i]);
               break;
            }
         };
         if(valid_checkbox.length==0){
            alert('Vous devez selectionner toutes les specialite ou cette ue sera dispense');
            event.preventDefault();
         }
      }, false);
   })()


////////////////////
function _(element){
   return document.getElementById(element);
}
function fetch_data(parent_element, child_element, type){
   fetch('/get_data?type='+type+'&parent_value='+parent_element.value+'').then(
      function(response){
         return response.json();
      }).then(function(resData){
         var html='';
         if(type == 'load_filiere'){
            html='<option value=""> Selectionner departement </option>'
            for(var count=0; count<resData.length; count++){
               html+='<option value="'+resData[count]+'">'+resData[count]+'</option>'
            }
         }

         if(type == 'load_specialite'){
            for(var count=0; count<resData.length; count++){
               html+='<tr> <td> <label for="'+resData[count]+'">'+resData[count]+'</label></td><td><input type="checkbox" id="'+resData[count]+'" name="ue_spec" value="'+resData[count]+'"/></td></tr>' 
            }
         }
         
         child_element.innerHTML= html;
      })
}

_('niv').onchange= function(){
   fetch_data( _('niv'), _('filiere'), 'load_filiere');
}

_('filiere').onchange=function(){
   fetch_data(_('filiere'), _('tab_spec'), 'load_specialite')
}