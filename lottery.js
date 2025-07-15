const game = document.forms['betform'];
const play = document.querySelector('button[type=submit')
const reset = document.querySelector('button[type=reset')
const accountBalance = document.querySelector('.balance');
const stakeDiv = document.querySelector('.stake-and-buttons')
const stakebtnsDiv = document.querySelector('.buttons')
const stakebtns= document.querySelectorAll('.stake-increment');
const stakeAmount = document.querySelector('.stake-amount');
const selection = document.querySelectorAll('.selections');
const outcomes = document.querySelectorAll('.outcomes');
const balanceAlert = document.querySelector('.insufficient-funds');
const stakeAlert = document.querySelector('.insufficient-stake');
const stakeContainer = document.querySelector('.amount')

stakebtnsDiv.style.display='none';
// Display the buttons for increasing stake amount
stakeAmount.addEventListener('click', e=>{
  stakeContainer.style.border= '0.5px solid black';

  // remove stake increment buttons when stake input field is readonly(after submitting)
  stakeAmount.hasAttribute('readonly')? stakebtnsDiv.style.display='none'
  :(stakeDiv.style.height = 'fit-content', stakebtnsDiv.style.display='flex');
  
  // remove insufficient-stake and insufficient-funds alerts when stake amount is clicked
  stakeAlert.style.display== 'block'? stakeAlert.style.display= 'none'
  :balanceAlert.style.display== 'block'? balanceAlert.style.display= 'none'
  :''
});

// stake increment buttons behaviour
stakebtns.forEach(btns =>{
  btns.addEventListener('click', f=>{
    f.preventDefault()
    let currentStakeAmount = Number(stakeAmount.value);
    btns.value>0? stakeAmount.value = currentStakeAmount + Number(btns.value)
    :(btns.value == "00" && currentStakeAmount > 0)? stakeAmount.value = currentStakeAmount + "" + btns.value
    :stakeAmount.value = 0
  })
});

let newCalculatedBalance; // variable to store the new balance after the game

// form field behaviour
game.addEventListener('submit', e => {
  e.preventDefault();
  stakeDiv.style.height = '20px';
  stakebtnsDiv.style.display='none';   

  // if stake amount has value greater than 10
  if(stakeAmount.value && stakeAmount.value >= 10){
    // if stake amount is less than or equal to available balance
    if(stakeAmount.value <= Number(accountBalance.textContent)){
      stakeAmount.setAttribute('readonly', true);
    
      // Array of generated numbers for lottery outcomes
      const generatedNumbers= [];
      let initialBalance = Number(accountBalance.textContent.trim());  
  
      for(let i = 0; i<selection.length && i<outcomes.length; i++){
        generatedNumbers[i] = Math.ceil(Math.random() * 3);
        // Display generated numbers as outcomes one after the other
        setTimeout(() =>{
          outcomes[i].innerText = generatedNumbers[i];
          if(selection[i].value == generatedNumbers[i]){
            selection[i].style.border = '2px solid greenyellow'
          }else{
            selection[i].style.border = '2px solid Red'
          }  
        }, ((i*1200) + 1000));
        
        // disable selection field after generating outcomes
        selection[i].setAttribute('readonly', true)
        selection[i].blur();
      }
      
      // Generated Numbers
      const G1 = generatedNumbers[0];
      const G2 = generatedNumbers[1];
      const G3 = generatedNumbers[2];
    
      // Selections
      const S1 = selection[0].value;
      const S2 = selection[1].value;
      const S3 = selection[2].value;

      // Increment the balance gradually
      function balanceIncrement (){ setInterval(() => {
        if (initialBalance < newCalculatedBalance) {
          initialBalance += 10; // Increment by 10
          if(initialBalance > newCalculatedBalance){
            initialBalance = newCalculatedBalance; // Ensure it stops exactly at the target
          }
          accountBalance.textContent = initialBalance;
        }else if(initialBalance > newCalculatedBalance){
          initialBalance -= 10; // decrease by 10
          if(initialBalance < newCalculatedBalance){
            initialBalance = newCalculatedBalance; // Ensure it stops exactly at the target
          } 
          accountBalance.textContent = initialBalance;
        } else {
          // Clear the interval when the target is reached
          clearInterval(balanceIncrement);
          accountBalance.textContent = newCalculatedBalance; // Ensure it stops exactly at the target
        }
      }, 1)}; // Update every 1 millisecond

      // Check the outcomes after 4.5 seconds. (2/3 = 50% cashback, 3/3 = stake * 10)
      setTimeout(() => {
        if (S1 == G1 && S2 == G2 && S3 == G3) {
          newCalculatedBalance = (initialBalance - stakeAmount.value) + (stakeAmount.value * 10); //
          balanceIncrement() // Increment the balance depending on the outcome
        } else if ((S1 == G1 && S2 == G2) || (S1 == G1 && S3 == G3) || (S2 == G2 && S3 == G3)) {
          newCalculatedBalance = (initialBalance - stakeAmount.value) + (stakeAmount.value / 2);
          balanceIncrement() // Increment the balance depending on the outcome
        } else {
          newCalculatedBalance = initialBalance - stakeAmount.value;
          balanceIncrement() // Increment the balance depending on the outcome
        }
      }, 4500);      
      play.style.display= 'none';
      reset.style.display='block';
    }else{
      // callback beep function and display balance alert
      warning(balanceAlert, beep)
    }
  }else{
    // callback beep function and display stake alert
    warning(stakeAlert, beep)
  }
  // stake input field beep red when invalid stake amount or insufficient balance
  function beep(){
    if(stakeContainer.style.border== '' || stakeContainer.style.border== '0.5px solid black'){
      stakeContainer.style.border= '2px solid red';
    } else{
      stakeContainer.style.border= '0.5px solid black';
    }
  };

  //beep behaviour: every 3milisecs and clear beep after 5secs
  function warning(alertTxt, funct){
    const beepInterval = setInterval(funct , 300);

    //clear balance beep effect after 5secs   
    setTimeout(()=>{
      clearInterval(beepInterval);
    }, 5000)
    stakeContainer.style.border= '2px solid red';
    alertTxt.style.display='block';  
  };
});

// Reset game behaviour
reset.addEventListener('click', e =>{
  e.preventDefault();
  game.reset();
  stakeAmount.removeAttribute('readonly'); //remove readonly attribute from stake input field
  stakeAmount.value = 0;
  balanceAlert.style.display='none';
  stakeAlert.style.display='none';

  // Reset the selection and outcomes fields
  for(let i = 0; i<selection.length && i<outcomes.length; i++){
    selection[i].style.border = '1px solid black'
    selection[i].removeAttribute('readonly');
    outcomes[i].innerText= '?'
  }

  stakeContainer.style.border=''
  play.style.display= 'block';
  reset.style.display='none';
});
