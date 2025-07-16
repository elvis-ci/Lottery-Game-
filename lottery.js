const game = document.forms['betform'];
const play = document.querySelector('button[type=submit')
const reset = document.querySelector('button[type=reset')
const accountBalance = document.querySelector('.balance');
const stakeDiv = document.querySelector('.stake-container')
const stakebtnsDiv = document.querySelector('.increment-buttons')
const stakebtns= document.querySelectorAll('.stake-increment');
const stakeAmount = document.querySelector('.stake-amount');
const selection = document.querySelectorAll('.selections');
const outcomes = document.querySelectorAll('.outcomes');
const alertMsg = document.querySelector('.insufficient-funds');
const stakeContainer = document.querySelector('.amount-container')
const account = document.querySelector('.account')

// hide stake increment buttons on page load
stakebtnsDiv.style.display='none';

// Display stake increment buttons when stake input field is clicked
stakeAmount.addEventListener('click', e=>{
  stakeContainer.style.border= '0.5px solid black';

  // remove stake increment buttons when stake input field is readonly (after submitting)
  stakeAmount.hasAttribute('readonly')? stakebtnsDiv.style.display='none'
  :(stakeDiv.style.height = 'fit-content', stakebtnsDiv.style.display='flex');
  
  // remove insufficient-stake and insufficient-funds alerts when stake amount is clicked
  alertMsg.style.display== 'block'? alertMsg.style.display= 'none'
  :''
});

// add each increment button's value to the current stake amount or reset to 0 when value is 0
stakebtns.forEach(btns =>{
  btns.addEventListener('click', f=>{
    f.preventDefault()
    let currentStakeAmount = Number(stakeAmount.value); // sets stake amout to a number to enamble math operation
    btns.value>0? stakeAmount.value = currentStakeAmount + Number(btns.value)
    :(btns.value == "00" && currentStakeAmount > 0)? stakeAmount.value = currentStakeAmount + "" + btns.value
    :stakeAmount.value = 0
  })
});

let newCalculatedBalance; // variable to store the new balance after the game
let resultAnnouncer = document.getElementById('announcement'); // result announcement for screen readers

// form field behaviour on submit
game.addEventListener('submit', e => {
  e.preventDefault();
  stakeDiv.style.height = '20px';
  stakebtnsDiv.style.display='none';   
  alertMsg.textContent='' // set balance alert message to empty (allows aria-live attribute to read and announce change with screen reader)

  // checks if stake amount is greater than 10
  if(stakeAmount.value && stakeAmount.value >= 10){
    // checks if stake amount is less than or equal to available balance
    if(stakeAmount.value <= Number(accountBalance.textContent)){
      stakeAmount.setAttribute('readonly', true); // set stake input field to readonly (prevents editing after submitting)
    
     
      const generatedNumbers= [];  // defines empty Array for generated numbers for lottery outcomes
      let initialBalance = Number(accountBalance.textContent.trim()); // defines initial balance when form is submitted

      //changes textContent of screen reader result announcement 
      function announceResult(resultAnnouncer){ resultAnnouncer.textContent="Results are"}

      
      for(let i = 0; i<selection.length && i<outcomes.length; i++){
        generatedNumbers[i] = Math.ceil(Math.random() * 3);
        // Display generated numbers as outcomes one after the other
        setTimeout(() =>{
          announceResult(resultAnnouncer)
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

      // Increment the balance gradually every 1 millisecond
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
      }, 1)};

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
        play.style.display= 'none';
        reset.style.display='block';

        reset.focus();

      }, 4500);      
    }else{
      // display insufficient balance and annouce on screen reader
      setTimeout(()=>{
        warning(alertMsg, beep, "Insufficient Balance!!!")
      }, 300)

    }
  }else{
    // callback beep function and display stake alert
    setTimeout(()=>{
      warning(alertMsg, beep, "Increase Your Stake!!!")
    }, 300)
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
  function warning(alertTxt, funct, errorMsg){
    const beepInterval = setInterval(funct , 300);

    //clear balance beep effect after 5secs   
    setTimeout(()=>{
      clearInterval(beepInterval);
    }, 5000)
    stakeContainer.style.border= '2px solid red';
    alertTxt.focus();
    alertTxt.textContent= errorMsg
    setTimeout(()=>{
      stakeAmount.focus();
    }, 4000)
  };
});

// Reset game behaviour
reset.addEventListener('click', e =>{
  e.preventDefault();
  game.reset();
  stakeAmount.removeAttribute('readonly'); //remove readonly attribute from stake input field
  stakeAmount.value = '';
  // alertMsg.style.display='none';
  // alertMsg.textContent= '';
  account.focus();

  // Reset the selection and outcomes fields
  for(let i = 0; i<selection.length && i<outcomes.length; i++){
    selection[i].style.border = '1px solid black'
    selection[i].removeAttribute('readonly');
    outcomes[i].innerText= '?'
  }

  resultAnnouncer.textContent=''
  stakeContainer.style.border=''
  play.style.display= 'block';
  reset.style.display='none';
});
