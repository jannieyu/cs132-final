/*
 * Name: Jennie Chung
 * CS 132 Spring 2022
 * This is the js file for our final project, an e-commerce store which sells
 * jewelry. This file contains client-side code which allows users to switch
 * between views.
 *
 */

(function()  {
  "use strict";

  // URLs to access dictionary and thesaurus APIs
  let dictURLPrefix = "https://www.dictionaryapi.com/api/v3/references/collegiate/json/";
  let dictURLSuffix = "?key=87bbf23a-ed9e-44bd-8640-80c4fc952b46";
  let thesURLPrefix = "https://www.dictionaryapi.com/api/v3/references/thesaurus/json/";
  let thesURLSuffix = "?key=cbe366a6-53d0-467a-8aa1-cf3991df4dde";

  // Colors for displaying synonyms and antonyms
  let synColor;
  let antColor;

  /**
   * Function for initializing the Word Tree page. Creates UI elements and adds
   * event listeners for the settings specified in the menu view as well as text
   * input used to grow the tree.
   */
  function init() {
    let createBtn = id("create-btn");
    let resetBtn = id("reset-btn");

    createBtn.addEventListener("click", toggleView); 
    createBtn.addEventListener("click", applyOptions);
    resetBtn.addEventListener("click", toggleView);
    resetBtn.addEventListener("click", clearTree);
  }

  /**
   * Function to toggle views between the menu view and the game view.
   */
  function toggleView() {
    const treeView = id("tree-view");
    treeView.classList.toggle("hidden");

    const menuView = id("menu-view");
    menuView.classList.toggle("hidden");
  }

  /**
   * Function to clear the tree if the reset button is selected.
   */
  function clearTree() {
    let tree = id("tree");
    tree.innerHTML = "";

    let currDefn = id("current-defn");
    currDefn.innerHTML = "";

    let errMsg = id("err-msg");
    errMsg.innerHTML = "";
  }

  /**
   * Function to apply the user's options specified in the menu view, such as the
   * root word and the colors of antonyms or synonyms.
   */
  function applyOptions() {
    const root = gen("btn");
    root.id = "root-word";
    root.textContent = id("root-word-input").value;

    root.addEventListener("click", addSynonym);
    root.addEventListener("click", addAntonym);
    root.addEventListener("mouseover", defineWord);
    
    let tree = id("tree");
    tree.appendChild(root);

    synColor = id("syn-color-picker").value;
    antColor = id("ant-color-picker").value;
  }

  /**
   * Function used to make requests to the dictionary API when defining a word.
   */
  async function defineWord() {
    const baseWord = this.textContent;
    
    let wordData = await fetch(dictURLPrefix + baseWord + dictURLSuffix)
    .then(checkStatus)
    .then(resp => resp.json())
    .catch(handleRequestError);

    processDefn(baseWord, wordData);
  }

  /**
   * Function used to process JSON object which contains dictionary information
   * assicated with a base word.
   * @param {*} baseWord - word for which the JSON object has additional information
   * @param {*} dictJSON - JSON object which contains info about base word
   */
  function processDefn(baseWord, dictJSON) {
    if (dictJSON.length &&
        typeof(dictJSON[0]) != "string" &&
        "shortdef" in dictJSON[0] &&
        dictJSON[0].shortdef) {
        const shortDef = dictJSON[0].shortdef[0];
        showDefinition(baseWord, shortDef);
    } else {
      produceErrMsg("Word not found in dictionary.");
    }
  }

  /**
   * Function to display a word and its corresponding definition on the page.
   * @param {string} baseWord - word whose definition is being shown
   * @param {string} shortDef - definition of base word
   */
  function showDefinition(baseWord, shortDef) {
    const defn = gen("p");
    defn.id = "current-defn";
    defn.textContent = baseWord + " : " + shortDef;

    let currentDefn = id("current-defn");
    currentDefn.parentNode.replaceChild(defn, currentDefn);
  }

  /**
   * Function for adding a synonym of a word to the tree.
   */
  function addSynonym() {
    const baseWord = this.textContent;
    addRandomWord(baseWord, processSynonym);
  }

  /**
   * Function for adding an antonym of a word to the tree.
   */
  function addAntonym() {
    const baseWord = this.textContent;
    addRandomWord(baseWord, processAntonym);
  }

  /**
   * Function used to make an async request to the thesaurus API to add a new
   * word to the tree
   * @param {string} baseWord - word used to lookup in the thesaurus
   * @param {function} processWord - function used to process the resulting JSON object from
   * making the request
   */
  async function addRandomWord(baseWord, processWord) {
    let wordData = await fetch(thesURLPrefix + baseWord + thesURLSuffix)
      .then(checkStatus)
      .then(resp => resp.json())
      .catch(handleRequestError);

    processWord(baseWord, wordData);
  }

  /**
   * Function for processing a JSON object by extracting the relevant synonyms
   * and adding one of these to the tree randomly.
   * @param {string} baseWord - word used to lookup in the thesaurus
   * @param {JSON} thesJSON - JSON object returned by thesaurus request using 
   * base word
   */
  function processSynonym(baseWord, thesJSON) {
    if (thesJSON.length) {
      if ("meta" in thesJSON[0] && 
        "syns" in thesJSON[0].meta &&
        thesJSON[0].meta.syns[0]) {
        const synonyms = thesJSON[0].meta.syns[0];
        const randomIndex = Math.floor(Math.random() * synonyms.length);
        const synonym = synonyms[randomIndex];
        addWord(synonym, synColor);
      } else {
        produceErrMsg("No synoynms for " + baseWord);
      }
    } else {
      produceErrMsg("Word not found in dictionary.");
    }
  }

  /**
   * Function for processing a JSON object by extracting the relevant antonyms
   * and adding one of these to the tree randomly.
   * @param {string} baseWord - word used to lookup in the thesaurus
   * @param {JSON} thesJSON - JSON object returned by thesaurus request using 
   * base word
   */
  function processAntonym(baseWord, thesJSON) {
    if (thesJSON.length) {
      if ("meta" in thesJSON[0] && 
        "ants" in thesJSON[0].meta &&
        thesJSON[0].meta.ants[0]) {
        const antonyms = thesJSON[0].meta.ants[0];
        const randomIndex = Math.floor(Math.random() * antonyms.length);
        const antonym = antonyms[randomIndex];
        addWord(antonym, antColor);
      } else {
        produceErrMsg("No antonyms for " + baseWord);
      }
    } else {
      produceErrMsg("Word not found in dictionary.");
    }
  }

  /**
   * Function for adding a word to the list of words in the word tree.
   * Generates the associated element with event listeners to the tree.
   * @param {string} word - word to be added to the list
   * @param {string} wordColor - hex code for coloring the word
   */
  function addWord(word, wordColor) {
    const branch = gen("div");
    branch.class = "branch";
    branch.textContent = word;

    branch.addEventListener("click", addSynonym);
    branch.addEventListener("click", addAntonym);
    branch.addEventListener("mouseover", defineWord);
    branch.style.color = wordColor;

    let tree = id("tree");
    tree.insertBefore(branch, tree.firstChild);
  }

  /**
   * Function for producing an error message and displaying it on the page
   * @param {string} msg - message to be displayed above tree
   */
  function produceErrMsg(msg) {
    let newErr = gen("p");
    newErr.id = "err-msg";
    newErr.textContent = msg;
    
    let currErr = id("err-msg");
    currErr.parentNode.replaceChild(newErr, currErr);
  }

  /**
   * Called when an error occurs in the fetch call chain (e.g. the request 
   * returns a non-200 error code, such as when the Merriam-Webster Dictionary 
   * or Thesaurus APIs are down). Displays a user-friendly error message on the 
   * page.
   * @param {Error} err - the error details of the request.
   */
     function handleRequestError(err) {
      let newErr = gen("p");
      newErr.id = "err-msg";
      newErr.textContent = "There was an error requesting data from the Merriam-Webster service. " + 
      "Please try again later. Error message: " + err;
      
      let currErr = id("err-msg");
      currErr.parentNode.replaceChild(newErr, currErr);
    }
  

  init();
})();