export enum HelpDetails {
  HowToCreateAutomaton = `
    To create an automaton, there are two options. 
    Either states can be dragged in the canvas and connected through transitions filling the transition table automatically,
    or transition table can be filled manually creating states and their respective transitions automatically.
    Both options can be used simultaneously.`,

  HowToDownloadAutomaton = `
    To download automaton, click on Tools > Download automaton.
    A file will be downloaded with the automaton in JSON format.`,

  HowToUploadAutomaton = `
    To upload automaton, click on Tools > Upload automaton.
    Select your desired file.
    The automaton will be uploaded and you continue your work.`,

  HowToCheckIfAutomatonIsDFA = `
    To check if automaton is DFA, click on Tools > IsDFA.
    An automaton is considered a DFA if it has one initial state, final state(s), and exactly
    two transitions for each state i.e. a and b transitions. if any state has missing or null
    transition, it won't be considered as a DFA.`,

  HowToCheckIfAutomatonIsNFA = `
    To check if automaton is NFA, click on Tools > IsNFA.
    An automaton is considered a NFA if it has one initial state, final state(s), multiple
    "a" and "b" transitions, missing or null transition(s).`,

  HowToHighlightNullTransitions = `
    To highlight null transitions in an automaton, click on Tools > Highlight null transitions.
    This will highlight all the null transitions in automaton.`,

  HowToConvertNFAtoDFA = `
    To convert NFA to DFA, click on Tools > Convert NFA to DFA.
    This process requires an already built NFA. 
    The process first creates a null closure table to demosntrate null closure of each state. 
    Then a modified transition table is created where every state in transition label is replaced by its null closure. 
    The process is then followed by transition table for resultant DFA where null null closure of initial state becomes the initial state of DFA.
    New state is added whenever their is a new transition label. The process completes when all the states are added to the table.
    The process is demonstrated in the video below.

    1. Null Closure
    2. Modified Transition Table
    3. Resultant DFA`,

  HowToMinimizeDFA = `
    To minimize a DFA, click on Tools > Minimize DFA. 
    This process requires an already built DFA. 
    The process is started with a table containing rows and columns equal to the number of states of DFA.
    In the first step, all the diagonal entries are marked with "tick". 
    In the second step, all the upper triangle cells are marked with "dash". 
    In the third step, all the cells containing one final and one non-final state are marked with a "cross". 
    After that, the remaining cells are checked one-by-one for their a and b transitions. 
    If the cell lead by a or b transition is marked with cross, it is marked with a cross.
    Or if both cells lead by a and b transitions are marked "tick", then current cell is also marked with a tick.
    Otherwise left empty.
    This process continues for all the cells.
    After that, next iteration is performed following the last mentioned step.
    If the table remains same across two iterations, then blank cells are marked with a "tick". 
    After that, minimized DFA is created with states being merged according to the ticks in each row of the table.`,

  HowToTestAStringOnAutomaton = `
    To test a string on automaton, click on Tools > test a string. Enter a valid string. 
    Select animation duration and click play. The animation will start highlighting the path
    of each character. Note that if there are null transitions in the automaton, string will go through
    them and continue their path after the null transitions.`,
}
