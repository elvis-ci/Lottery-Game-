const stakeDiv = document.querySelector('.stake-container')
const stakebtnsDiv = document.querySelector('.increment-buttons')
const stakeAmount = document.querySelector('.stake-amount');
const alertMsg = document.querySelector('.insufficient-funds');
const stakeContainer = document.querySelector('.amount-container')

// hide stake increment buttons container on page load
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
  alertMsg.textContent= ''; // set alert message to empty when stake input field is clicked
});

const stakebtns= document.querySelectorAll('.stake-increment'); // nodelist of all stake increment buttons
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
const game = document.forms['betform']; // game form
const playButton = document.querySelector('button[type=submit') // submit button
const playAgainButton = document.querySelector('button[type=reset') // play again button
const selection = document.querySelectorAll('.selections');
const outcomes = document.querySelectorAll('.outcomes');

// game form behaviour on submit
game.addEventListener('submit', e => {
  e.preventDefault();
  stakeDiv.style.height = '20px';
  stakebtnsDiv.style.display='none';   
  alertMsg.textContent='' // set balance alert message to empty (allows aria-live attribute to read and announce change with screen reader)

  // checks if stake amount is greater than 10
  if(stakeAmount.value && stakeAmount.value >= 10){
    const accountBalance = document.querySelector('.balance'); 
    // checks if stake amount is less than or equal to available balance
    if(stakeAmount.value <= Number(accountBalance.textContent)){
      stakeAmount.setAttribute('readonly', true); // set stake input field to readonly (prevents editing after submitting)
    
     
      const generatedNumbers= [];  // defines empty Array for generated numbers for lottery outcomes
      let initialBalance = Number(accountBalance.textContent.trim()); // defines initial balance when form is submitted

      //changes textContent of screen reader result announcement 
      function announceResult(resultAnnouncer){ resultAnnouncer.textContent="Results are"}

      //loops through array of selected numbers and array of outcomes
      for(let i = 0; i<selection.length && i<outcomes.length; i++){
        generatedNumbers[i] = Math.ceil(Math.random() * 3); // sets each generated number to a random number between 1 and 3
        // Display generated numbers as outcomes one after the other
        setTimeout(() =>{
          announceResult(resultAnnouncer)
          outcomes[i].textContent = generatedNumbers[i]; // sets each outcome text content to the corresponding generated number

          // checks if the selected number matches the corresponding random number
          if(selection[i].value == generatedNumbers[i]){
            selection[i].style.border = '2px solid greenyellow' // sets the border of each correct selection to green
            // selection[i].style.backgroundColor = 'greenyellow'
          }else{
            selection[i].style.border = '2px solid Red' // sets the border of each wrong selection to red 
            // selection[i].style.backgroundColor = 'greenyellow'
          }  
        }, ((i*1200) + 1000)); // calculates delay for each iteration. eg: multiplies i by 1.2 secs and adds 1sec. (when i is 1, delay is 2.2secs, when i is 2, delay = 3.4secs)
        
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

      // function to gradually update the balance with a counter
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
        playButton.style.display= 'none'; //hides play button after successful submit
        playAgainButton.style.display='block'; // makes playAgainbutton visible to reset game
        playAgainButton.focus(); // sets focus on playAgainbutton to aid accessibility with keyboard navigation
      }, 4500);
    }else{
      // display insufficient balance and annouce on screen reader when stake is greater than balance
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

// Reset game
playAgainButton.addEventListener('click', e =>{
  e.preventDefault();
  game.reset(); //resets form fields
  stakeAmount.removeAttribute('readonly'); //remove readonly attribute from stake input field
  stakeAmount.value = ''; // emptys stake input field
  // alertMsg.style.display='none';
  // alertMsg.textContent= '';

  const account = document.querySelector('.account') //defines account balance container
  account.focus(); // sets focus on account balance container so screen reader can announce new balance

  // Reset the selection and outcomes fields
  for(let i = 0; i<selection.length && i<outcomes.length; i++){
    selection[i].style.border = '1px solid black'
    selection[i].removeAttribute('readonly');
    outcomes[i].textContent= '?'
  }

  resultAnnouncer.textContent=''
  stakeContainer.style.border=''
  playButton.style.display= 'block'; // makes play button visible after reset
  playAgainButton.style.display='none'; // hides play again button after reset.
});
