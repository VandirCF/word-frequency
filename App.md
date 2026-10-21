# Word Frequency

**Tier:** 1-Beginner

Calculating the frequency of words in a block of text is a technique which has
various uses in algorithms such as searching, sorting, and semantic analysis.
The objective of the Word Frequency app is count the frequency of words in a
block of text and create a tabular display of each unique word in the text
along with its frequency, in descending order by frequency.

## User Stories

-   [ ] User can see a text input box, a 'Translate' button, and a word
        frequency table.
-   [ ] User can enter text (or cut and paste) into the input box. This input
        box must allow the entry of large blocks of text (maximum of 2048 characters).
-   [ ] User can click the 'Translate' button to analyze the word frequency in
        the text that has been input.
-   [ ] User can see an error message if the text input box is empty. The
        message is "Please enter some text to analyze." It also appears when the
        input contains only whitespace.
-   [ ] User can see the word frequency table populated when the 'Translate'
        button is clicked. Each row in the table contains a word and the number of times
        it occurs in the input text.
-   [ ] User can see the word frequency table ordered in descending sequence
        by word frequency.

## Definitions

These rules remove ambiguity from the user stories above. The tests should follow them.

-   **Word:** a sequence of letters or digits (Unicode, so accents such as
    "ação" are kept). An apostrophe (`'` or `’`) or a hyphen (`-`) is part of a
    word only when it sits between two letters or digits. "don't" and
    "guarda-chuva" are single words. Leading or trailing punctuation is removed.
-   **Case:** counting is case-insensitive. "The" and "the" are the same word.
    The table shows the word in lowercase.
-   **Numbers:** a standalone number such as "2024" counts as a word.
-   **Character limit:** the 2048-character limit counts every character,
    including spaces and line breaks. The input box enforces it with
    `maxlength`, and the character counter shows the current total against
    the limit.
-   **Empty input:** a text with no characters, or only whitespace, is treated
    as empty and shows the error message.
-   **Ties:** words with the same count are sorted alphabetically (A to Z).
-   **Interface language:** all text shown to the user is in English, as in
    this specification.
-   **Button name:** the button label is "Translate", as required by the
    user stories. It does not translate anything, so it only describes the
    action in the assignment.

## Bonus features

-   [ ] User can see a graphical representation of the word frequency in a
        bubble chart, column chart, or any other form of graphical representation the
        developer chooses.
-   [ ] User may choose to enter the URL of a web page whose content is to be
        analyzed instead of manually entering text. The visible text of the page is
        analyzed. If the page text is longer than 2048 characters, only the first
        2048 characters are analyzed and the user sees a notice saying so. An invalid
        URL, a page that cannot be loaded, or a page without text shows an error
        message. (Hint: see the Podcast Directory application in the course
        materials for ideas.)

## Useful links and resources

-   [Bag of Words Model (Wikipedia)](https://en.wikipedia.org/wiki/Bag-of-words_model)
-   [Semantic Analysis (Wikipedia)](https://en.wikipedia.org/wiki/Semantic_analysis_(linguistics))

## Example projects

- [Word Frequency Counter](https://codepen.io/maxotar/pen/aLrwJM)
- [Bubble Chart](https://codepen.io/Quendoline/pen/pjELpM)
- [Svelte Word Frequency by Gabriele Corti](https://codepen.io/borntofrappe/pen/QWWWqQM)
