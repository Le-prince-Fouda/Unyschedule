//importrant declaration de variables
var content= document.querySelectorAll('article > div');
var contentLength= content.length,
    menu=document.querySelectorAll('nav button'),
    menuLength= menu.length;


// function 
function onglet(evt, name){
   for(var i=0; i < contentLength; i++){
      content[i].style.display='none';
      content[i].classList.remove('show'); // i have change 'affiche' to 'show'
   }
   for(var i=0; i < menuLength; i++){
      menu[i].classList.remove('active');
   }
   document.getElementById(name).style.display= 'flex';
   evt.currentTarget.classList.add('active')
}

//Pour le formulaire d'enregistrement des niveaux les champs des effectifs 
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



//Function to check whether at least one of the form’s checkboxes has been ticked
//If not, the form cannot be submitted and an error message is displayed 
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
            alert('You must select all the departments that offer courses at this level');
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
            alert('You must select all the levels where the specialty will appear');
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
            alert('You must select all the courses in which this unit will be dispensed.');
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


/*****************************************************************************/
/**********************  Custumer checkbox of academic page *****************************/
let label = document.querySelectorAll(".label-checkbox")

label.forEach((item, index) => {
   let checkbox = item.querySelector(".checkbox");
   let circle_checkbox = item.querySelector(".circle-checkbox")

   item.onclick = function(){
      if(checkbox.checked){
      circle_checkbox.style.backgroundColor = "#68509D"
      circle_checkbox.innerHTML = "<span class ='custom_check'></span>"
      }else{
      circle_checkbox.style.backgroundColor = "transparent"

      }

   }
}
)