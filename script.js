const calorieCounter = document.getElementById("calorie-counter");
const budgetNumberInput = document.getElementById("budget");
const entryDropdown = document.getElementById("entry-dropdown");
const addEntryButton = document.getElementById('add-entry');
const clearButton = document.getElementById('clear');
const output = document.getElementById('output');
let isError = false;

const cleanInputString = (str) => {
    const regex = (/[+-\s]/g);
    // the above simply means for all (g) +,- and white space(\s)
    return str.replace(regex, "");

};
const isInvalidInput = (str) => {
    const regex = /\d+e\d+/i;
    //\d represents digits from 0-9. i makes the regex case insesitive
    return str.match(regex);
};
const addEntry = () => {
    const targetInputContainer = document.querySelector(`#${entryDropdown.value} .input-container`);
    const entryNumber = targetInputContainer.querySelectorAll('input[type="text"]').length + 1;
    const HTMLString = `
  <label for="${entryDropdown.value}-${entryNumber}-name">Entry ${entryNumber} Name</label>
  <input type="text" id="${entryDropdown.value}-${entryNumber}-name" placeholder="Name" />
  <label for="${entryDropdown.value}-${entryNumber}-calories">Entry ${entryNumber} Calories</label>
  <input
    type="number"
    min="0"
    id="${entryDropdown.value}-${entryNumber}-calories"
    placeholder="Calories"
  />`;  
  targetInputContainer.insertAdjacentHTML("beforeend", HTMLString);
  /*
  Your other bug occurs if you add a Breakfast entry, fill it in, then add a second Breakfast entry. You'll see that the values you added disappeared.

This is because you are updating innerHTML directly, which does not preserve your input content. Change your innerHTML assignment to use the insertAdjacentHTML() method of targetInputContainer instead.
  The insertAdjacentHtml method takes two arguments. The first argument is a string that specifies the position of the inserted element. The second argument is a string containing the HTML to be inserted.

For the first argument, pass the string "beforeend" to insert the new element as the last child of targetInputContainer.

For the second argument, pass your HTMLString variable.
*/
   

};
const calculateCalories = (e) => {
  e.preventDefault();//calls the preventDefault() method on the e parameter
  isError = false;
  const breakfastNumberInputs = document.querySelectorAll("#breakfast input[type=number]");
//This will return any number inputs that are in the #breakfast element.
  const lunchNumberInputs = document.querySelectorAll('#lunch input[type=number]');
  const dinnerNumberInputs = document.querySelectorAll('#dinner input[type=number]');
  const snacksNumberInputs = document.querySelectorAll('#snacks input[type=number]');
  const exerciseNumberInputs = document.querySelectorAll('#exercise input[type=number]');
  //Now that you have your lists of elements, you can pass them to your getCaloriesFromInputs function to extract the calorie total.
  const breakfastCalories = getCaloriesFromInputs(breakfastNumberInputs);
  const lunchCalories = getCaloriesFromInputs(lunchNumberInputs);
  const dinnerCalories = getCaloriesFromInputs(dinnerNumberInputs);
  const snacksCalories = getCaloriesFromInputs(snacksNumberInputs);
  const exerciseCalories = getCaloriesFromInputs(exerciseNumberInputs);
  /*
  ou also need to get the value of your #budget input. You already queried this at the top of your code, and set it to the budgetNumberInput variable. However, you used getElementById, which returns an Element, not a NodeList.

A NodeList is an array-like, which means you can iterate through it and it shares some common methods with an array. For your getCaloriesFromInputs function, an array will work for the argument just as well as a NodeList does.
  */
  const budgetCalories = getCaloriesFromInputs([budgetNumberInput]);
  if (isError) {
    return
 }
 /*
 Your getCaloriesFromInputs function will set the global error flag to true if an invalid input is detected. Add an if statement to your calculateCalories function that checks the truthiness of your global error flag, and if it is truthy then use return to end the function execution.
 */
 const consumedCalories = breakfastCalories + lunchCalories + dinnerCalories + snacksCalories;
 const remainingCalories = budgetCalories - consumedCalories + exerciseCalories;
 const surplusOrDeficit = remainingCalories < 0 ? "Surplus" : "Deficit";
  output.innerHTML = `
    <span class="${surplusOrDeficit.toLowerCase()}">${Math.abs(remainingCalories)} Calorie ${surplusOrDeficit}</span>
  <!Math.abs() converts a  number to its absolute form >
  <hr>
  <p>${budgetCalories} Calories Budgeted</p>
  <p>${consumedCalories} Calories Consumed</p>
  <p>${exerciseCalories} Calories Burned</p>`;
  output.classList.remove('hide');
  /* 
  Finally, you need to make the #output element visible so the user can see your text. Your output variable is an Element, which has a classList property. This property has a .remove() method, which accepts a string representing the class to remove from the element.

const paragraphElement = document.getElementById('paragraph');
paragraphElement.classList.remove('hide');
  */
};
const getCaloriesFromInputs = (list) => {
    let calories = 0;
   for (const item of list) {
       const  currVal = cleanInputString(item.value);
       const invalidInputMatch = isInvalidInput(currVal);
       if (invalidInputMatch) {
          alert(`Invalid Input: ${invalidInputMatch[0]}`);
          isError = true;
          return null;
          
       }// if statement that checks if invalidInputMatch is truthy.
   calories += Number(currVal);
      
   } 
   /*
   A for...of loop is used to iterate over elements in an iterable object like an array. The variable declared in the loop represents the current element being iterated over.

for (const element of elementArray) {
  console.log(element);
}
Create a for...of loop that loops through the list. For the loop's variable name, use const to declare a variable called item.
   */
  return calories;
};
const clearForm = () => {
  const inputContainers = Array.from(document.querySelectorAll(".input-container"));
/*
   Remember that document.querySelectorAll returns a NodeList, which is array-like but is not an array. However, the Array object has a .from() method that accepts an array-like and returns an array. This is helpful when you want access to more robust array methods, which you will learn about in a future project.

The following example takes a NodeList of li elements and converts it to an array of li elements:

<ul>
  <li>List 1</li>
  <li>List 2</li>
  <li>List 3</li>
</ul>
const listItemsArray = Array.from(document.querySelectorAll('li'));

console.log(listItemsArray); //Output: (3) [li, li, li]
*/
for (const container of inputContainers) {
  container.innerHTML = '';
}

budgetNumberInput.value = '';
output.innerText = '';
output.classList.add('hide');
};
addEntryButton.addEventListener("click", addEntry);
calorieCounter.addEventListener("submit", calculateCalories);
clearButton.addEventListener("click", clearForm);
