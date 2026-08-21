/**
 * DSU Hub Authentic Syllabus Dataset — Dayananda Sagar University (DSU) School of Engineering
 * Covers 8 Engineering Branches across 1st to 8th Semesters with actual DSU course codes,
 * high-yield exam guidance notes, passing tips, and verified previous year question papers.
 */

export const DSU_BRANCHES = [
  {
    name: 'Computer Science & Engineering',
    shortName: 'CSE',
    slug: 'cse',
    codePrefix: 'CS',
    description: 'Core computer science: algorithms, database systems, computer networks, compiler design, and software architecture.',
    badge: 'Popular',
    semesters: [
      {
        number: 1,
        subjects: [
          {
            name: 'Chemistry for Computer Science Cluster',
            code: '25EN1103',
            slug: 'chemistry-for-computer-science-cluster',
            credits: 4,
            guidance: {
              notes: 'Focus on 5 Core Modules: (1) Electrochemical & Potentiometric Sensors, Dissolved Oxygen measurement, QDSSCs; (2) Pitting & Water-line corrosion, Electroless plating; (3) VSEPR Theory, Z-matrix of H2O, MO diagram of O2; (4) Polymer molecular weights (Mn, Mw), Polycarbonate, Polypyrrole; (5) E-waste toxic hazards, Pyrometallurgical vs Hydrometallurgical copper extraction.',
              passingTips: 'Copper extraction from e-waste, MO diagram of O2, and Potentiometric sensor principles are guaranteed 16-mark questions.',
              highYieldTopics: [
                'Electrochemical & Potentiometric Sensors (Dissolved O2)',
                'Quantum Dot Sensitized Solar Cells (QDSSCs)',
                'Pitting & Water-Line Corrosion with Labelled Diagrams',
                'Electroless Plating Mechanism & Advantages',
                'MO Diagram of O2 & VSEPR Z-Matrix for H2O',
                'Polycarbonate Preparation & Polypyrrole Synthesis',
                'E-Waste Toxic Hazards & Copper Extraction (Hydro vs Pyrometallurgical)'
              ]
            },
            pyqs: [
              { year: 2026, examType: 'end_sem', title: 'End Semester Exam Dec 2025 / Jan 2026 (Max Marks: 80)', fileUrl: 'https://www.mindflowlearn.co.in/sample-pyqs/25EN1103-2025-Dec-EndSem.pdf' },
              { year: 2024, examType: 'end_sem', title: 'End Semester Exam 2024', fileUrl: 'https://www.mindflowlearn.co.in/sample-pyqs/25EN1103-2024-EndSem.pdf' }
            ]
          },
          {
            name: 'Object Oriented Programming (Python)',
            code: '25EN1107',
            slug: 'object-oriented-programming-python',
            credits: 4,
            guidance: {
              notes: 'Covers OOP Pillars (Encapsulation, Inheritance, Polymorphism, Data Abstraction), Function Argument Types (Positional, Keyword, Default, *args), Loop Tracing (for, while, continue, break), Recursion Call Stack Tracing, and File I/O with Exception Handling.',
              passingTips: 'Practice writing standard Python programs: Student marks calculation (total, average, grade), Recursive Fibonacci/Factorial call trees, and custom Class inheritance structures.',
              highYieldTopics: [
                'Key OOP Concepts (Classes, Objects, Inheritance, Polymorphism)',
                'Python Function Argument Types (Positional, Keyword, Default)',
                'Loop Output Prediction (range, continue, while break)',
                'Recursion Tracing & Call Stack Output',
                'Dictionary & List Comprehensions',
                'File I/O and Exception Handling Blocks (try-except-finally)'
              ]
            },
            pyqs: [
              { year: 2026, examType: 'end_sem', title: 'End Semester Exam Dec 2025 / Jan 2026 (Max Marks: 80)', fileUrl: 'https://www.mindflowlearn.co.in/sample-pyqs/25EN1107-2026-Jan-EndSem.pdf' },
              { year: 2024, examType: 'end_sem', title: 'End Semester Exam 2024', fileUrl: 'https://www.mindflowlearn.co.in/sample-pyqs/25EN1107-2024-EndSem.pdf' }
            ]
          },
          {
            name: 'Engineering Graphics and Design Thinking',
            code: '25EN1102',
            slug: 'engineering-graphics-and-design-thinking',
            credits: 3,
            guidance: {
              notes: 'Focus on Orthographic Projections from 3D Isometric Machine Components (Front, Top, and Side Views), Development of Lateral Surfaces of Prisms and Pyramids, Section of Solids (Hexagonal Prism with Cone), and 3D CAD Modeling (AutoCAD / Fusion 360).',
              passingTips: 'Always use First Angle Projection. Ensure exact dimensioning and projection alignment between Front View and Top View.',
              highYieldTopics: [
                'Orthographic Projections (Front, Top, Side Views from Isometric 3D)',
                'Development of Lateral Surface of Prisms (Square / Hexagonal)',
                'Section of Solids with Inclined Cutting Planes (45° to HP)',
                'Isometric Projections of Frustums and Combined Solids',
                'AutoCAD & Fusion 360 3D Part Modeling'
              ]
            },
            pyqs: [
              { year: 2025, examType: 'end_sem', title: 'End Semester Exam Dec 2025 (Set III, Max Marks: 60)', fileUrl: 'https://www.mindflowlearn.co.in/sample-pyqs/25EN1102-2025-Dec-EndSem.pdf' },
              { year: 2024, examType: 'end_sem', title: 'End Semester Exam 2024', fileUrl: 'https://www.mindflowlearn.co.in/sample-pyqs/25EN1102-2024-EndSem.pdf' }
            ]
          },
          {
            name: 'Linear Algebra and Calculus',
            code: '25EN1101',
            slug: 'linear-algebra-and-calculus',
            credits: 4,
            guidance: {
              notes: 'Focus on Eigenvalues & Eigenvectors of 3x3 matrices, Cayley-Hamilton theorem, Taylor & Maclaurin series expansion in two variables, Partial derivatives (Euler’s theorem on homogeneous functions), and Gauss Elimination / Rank of a matrix.',
              passingTips: 'Master Cayley-Hamilton theorem inverse calculation and Gauss-Jordan elimination for 3x3 matrices for guaranteed full marks.',
              highYieldTopics: [
                'Cayley-Hamilton Theorem & Matrix Inverses',
                'Eigenvalues and Eigenvectors of 3x3 Matrices',
                'Euler’s Theorem on Homogeneous Functions',
                'Taylor Series Expansion in Two Variables',
                'Gauss-Elimination & Consistency of System of Linear Equations'
              ]
            },
            pyqs: [
              { year: 2026, examType: 'end_sem', title: 'End Semester Exam Dec 2025 / Jan 2026', fileUrl: 'https://www.mindflowlearn.co.in/sample-pyqs/25EN1101-2026-Jan-EndSem.pdf' },
              { year: 2024, examType: 'end_sem', title: 'End Semester Exam 2024', fileUrl: 'https://www.mindflowlearn.co.in/sample-pyqs/25EN1101-2024-EndSem.pdf' }
            ]
          }
        ]
      },
      {
        number: 2,
        subjects: [
          {
            name: 'Differential Equations and Vector Calculus',
            code: '25EN1201',
            slug: 'differential-equations-and-vector-calculus',
            credits: 4,
            guidance: {
              notes: 'Higher order linear differential equations with constant coefficients, Method of Variation of Parameters, Cauchy-Euler equations, Vector differentiation (Gradient, Divergence, Curl), and Green’s / Stokes’ / Gauss Divergence Theorems.',
              passingTips: 'Variation of Parameters and Stokes’ theorem surface integration problems are guaranteed 10-mark questions.',
              highYieldTopics: ['Method of Variation of Parameters', 'Stokes’ and Gauss Divergence Theorems', 'Cauchy-Euler Homogeneous Linear Equations', 'Gradient, Divergence, and Curl Solenoidal / Irrotational Vector Fields']
            },
            pyqs: [
              { year: 2025, examType: 'end_sem', title: 'End Semester Exam 2025', fileUrl: 'https://www.mindflowlearn.co.in/sample-pyqs/25EN1201-2025-EndSem.pdf' },
              { year: 2024, examType: 'end_sem', title: 'End Semester Exam 2024', fileUrl: 'https://www.mindflowlearn.co.in/sample-pyqs/25EN1201-2024-EndSem.pdf' }
            ]
          },
          {
            name: 'Applied Physics for Engineering',
            code: '25EN1203',
            slug: 'applied-physics-for-engineering',
            credits: 4,
            guidance: {
              notes: 'Quantum Mechanics (de Broglie hypothesis, Heisenberg uncertainty, 1D Schrödinger wave equation), Lasers & Fiber Optics (He-Ne laser, numerical aperture), Semiconductor Physics, and Dielectric Materials.',
              passingTips: 'Derive 1D time-independent Schrödinger wave equation and solve for energy eigenvalues of a particle in an infinite potential well.',
              highYieldTopics: ['1D Schrödinger Wave Equation & Particle in a Box', 'Numerical Aperture & Fiber Optic Loss', 'He-Ne & Semiconductor Lasers Principle', 'Hall Effect & Carrier Concentration']
            },
            pyqs: [
              { year: 2025, examType: 'end_sem', title: 'End Semester Exam 2025', fileUrl: 'https://www.mindflowlearn.co.in/sample-pyqs/25EN1203-2025-EndSem.pdf' }
            ]
          },
          {
            name: 'Basic Electronics & Communication',
            code: '25EN1205',
            slug: 'basic-electronics-communication',
            credits: 3,
            guidance: {
              notes: 'Semiconductor Diodes, Bipolar Junction Transistors (BJT in CE configuration), Operational Amplifiers (Op-Amps as Inverting, Non-inverting, Adder, Subtractor), and Digital Logic Gates.',
              passingTips: 'Draw clear circuit diagrams for Full Wave Bridge Rectifiers with capacitor filter and Op-Amp inverting amplifier with formula derivations.',
              highYieldTopics: ['Full Wave Bridge Rectifier & Ripple Factor', 'BJT Input/Output Characteristics in CE Mode', 'Op-Amp Inverting, Non-Inverting & Summer Circuits', 'Boolean Algebra & De Morgan Theorems']
            },
            pyqs: [
              { year: 2025, examType: 'end_sem', title: 'End Semester Exam 2025', fileUrl: 'https://www.mindflowlearn.co.in/sample-pyqs/25EN1205-2025-EndSem.pdf' }
            ]
          }
        ]
      },
      {
        number: 3,
        subjects: [
          {
            name: 'Data Structures and Applications',
            code: '21CS32',
            slug: 'data-structures-and-applications',
            credits: 4,
            guidance: {
              notes: 'Focus on Linked Lists (Singly, Doubly, Circular), Stacks & Queues, Trees (AVL, BST, B-Trees), and Graph Traversals (BFS/DFS). Module 3 & 4 carry 40%+ of exam weightage.',
              passingTips: 'Master BST insertion/deletion and AVL tree rotation step-by-step traces.',
              highYieldTopics: ['AVL Tree Single & Double Rotations', 'Binary Search Tree Deletion Algorithm', 'Dijkstra Shortest Path & Prim’s MST', 'Stack Applications (Infix to Postfix Conversion)']
            },
            pyqs: [
              { year: 2024, examType: 'end_sem', title: 'End Semester Exam 2024 (Regular)', fileUrl: 'https://www.mindflowlearn.co.in/sample-pyqs/21CS32-2024-EndSem.pdf' },
              { year: 2024, examType: 'mid1', title: 'CIA-1 Midterm 2024', fileUrl: 'https://www.mindflowlearn.co.in/sample-pyqs/21CS32-2024-Mid1.pdf' },
              { year: 2023, examType: 'end_sem', title: 'End Semester Exam 2023', fileUrl: 'https://www.mindflowlearn.co.in/sample-pyqs/21CS32-2023-EndSem.pdf' }
            ]
          },
          {
            name: 'Analog and Digital Electronics',
            code: '21CS33',
            slug: 'analog-and-digital-electronics',
            credits: 3,
            guidance: {
              notes: 'Op-Amps, Karnaugh Maps (K-Maps), Multiplexers, Decoders, Flip-Flops, and Synchronous Counter Design.',
              passingTips: 'Practice 4-variable K-Map minimization and draw neat JK / D flip-flop state diagrams.',
              highYieldTopics: ['4-Variable K-Map Minimization', 'Master-Slave JK Flip-Flop', 'Synchronous Up/Down Counter Design', 'Inverting & Non-Inverting Op-Amp Circuits']
            },
            pyqs: [
              { year: 2024, examType: 'end_sem', title: 'End Semester Exam 2024', fileUrl: 'https://www.mindflowlearn.co.in/sample-pyqs/21CS33-2024-EndSem.pdf' },
              { year: 2023, examType: 'end_sem', title: 'End Semester Exam 2023', fileUrl: 'https://www.mindflowlearn.co.in/sample-pyqs/21CS33-2023-EndSem.pdf' }
            ]
          },
          {
            name: 'Computer Organization and Architecture',
            code: '21CS34',
            slug: 'computer-organization-and-architecture',
            credits: 3,
            guidance: {
              notes: 'Memory Hierarchy, Cache Mapping (Direct, Set-Associative), Pipelining Hazards, and Booth’s Multiplication Algorithm.',
              passingTips: 'Solve numericals on Cache Hit/Miss ratios and instruction execution cycles.',
              highYieldTopics: ['Cache Memory Mapping Techniques', 'Instruction Pipelining Hazards', 'Booth’s Multiplication Algorithm', 'DMA Controller Block Diagram']
            },
            pyqs: [
              { year: 2024, examType: 'end_sem', title: 'End Semester Exam 2024', fileUrl: 'https://www.mindflowlearn.co.in/sample-pyqs/21CS34-2024-EndSem.pdf' }
            ]
          }
        ]
      },
      {
        number: 4,
        subjects: [
          {
            name: 'Design and Analysis of Algorithms',
            code: '21CS42',
            slug: 'design-and-analysis-of-algorithms',
            credits: 4,
            guidance: {
              notes: 'Master Theorem for recurrences, Divide-and-Conquer (Merge/Quick sort), Dynamic Programming (0/1 Knapsack, LCS), and Greedy strategies (Huffman Coding, Kruskal/Prim).',
              passingTips: 'Always provide Pseudocode + Recurrence relation + Time Complexity proof.',
              highYieldTopics: ['Master Theorem Recurrences', '0/1 Knapsack Problem (DP vs Greedy)', 'Longest Common Subsequence (LCS)', 'Kruskal and Prim Minimum Spanning Trees', 'NP-Complete vs NP-Hard Definitions']
            },
            pyqs: [
              { year: 2024, examType: 'end_sem', title: 'End Semester Exam 2024', fileUrl: 'https://www.mindflowlearn.co.in/sample-pyqs/21CS42-2024-EndSem.pdf' },
              { year: 2023, examType: 'end_sem', title: 'End Semester Exam 2023', fileUrl: 'https://www.mindflowlearn.co.in/sample-pyqs/21CS42-2023-EndSem.pdf' }
            ]
          },
          {
            name: 'Operating Systems',
            code: '21CS44',
            slug: 'operating-systems',
            credits: 3,
            guidance: {
              notes: 'CPU Scheduling (Round Robin, SRTF), Process Synchronization (Semaphores, Dining Philosophers), Deadlock (Banker’s Algorithm), and Virtual Memory (Page replacement: FIFO, LRU, Optimal).',
              passingTips: 'Banker’s Safety algorithm calculations and Gantt chart scheduling numericals are guaranteed.',
              highYieldTopics: ['Banker’s Deadlock Avoidance Algorithm', 'LRU and Optimal Page Replacement Calculations', 'Classical IPC Problems (Producer-Consumer, Reader-Writer)', 'Process State Transition Diagram & PCB']
            },
            pyqs: [
              { year: 2024, examType: 'end_sem', title: 'End Semester Exam 2024', fileUrl: 'https://www.mindflowlearn.co.in/sample-pyqs/21CS44-2024-EndSem.pdf' },
              { year: 2023, examType: 'end_sem', title: 'End Semester Exam 2023', fileUrl: 'https://www.mindflowlearn.co.in/sample-pyqs/21CS44-2023-EndSem.pdf' }
            ]
          }
        ]
      },
      {
        number: 5,
        subjects: [
          {
            name: 'Database Management Systems',
            code: '21CS53',
            slug: 'database-management-systems',
            credits: 4,
            guidance: {
              notes: 'ER Modeling, Relational Algebra, SQL joins/subqueries, Normalization (1NF, 2NF, 3NF, BCNF), and ACID transactions (Serializability, 2PL lock protocol).',
              passingTips: 'Solve functional dependency closure sets and normal form decomposition problems.',
              highYieldTopics: ['BCNF & 3NF Lossless Join Decomposition', 'Conflict Serializability & Precedence Graphs', 'Two-Phase Locking (2PL) Protocol', 'Complex SQL Queries with Group By & Having', 'B+ Tree Insertions and Deletions']
            },
            pyqs: [
              { year: 2024, examType: 'end_sem', title: 'End Semester Exam 2024', fileUrl: 'https://www.mindflowlearn.co.in/sample-pyqs/21CS53-2024-EndSem.pdf' },
              { year: 2024, examType: 'mid1', title: 'CIA-1 Midterm 2024', fileUrl: 'https://www.mindflowlearn.co.in/sample-pyqs/21CS53-2024-Mid1.pdf' },
              { year: 2023, examType: 'end_sem', title: 'End Semester Exam 2023', fileUrl: 'https://www.mindflowlearn.co.in/sample-pyqs/21CS53-2023-EndSem.pdf' }
            ]
          },
          {
            name: 'Computer Networks',
            code: '21CS52',
            slug: 'computer-networks',
            credits: 4,
            guidance: {
              notes: 'OSI vs TCP/IP Layers, Subnetting (VLSM, CIDR), Sliding Window Protocols (Go-Back-N, Selective Repeat), Routing Algorithms (Link State, Distance Vector), and TCP Congestion Control.',
              passingTips: 'Practice IP subnet calculations and CRC error-detection polynomial division.',
              highYieldTopics: ['CIDR Subnetting Calculations', 'CRC Polynomial Error Detection', 'Go-Back-N vs Selective Repeat ARQ', 'Distance Vector Routing & Count-to-Infinity Problem', 'TCP 3-Way Handshake & Congestion Window']
            },
            pyqs: [
              { year: 2024, examType: 'end_sem', title: 'End Semester Exam 2024', fileUrl: 'https://www.mindflowlearn.co.in/sample-pyqs/21CS52-2024-EndSem.pdf' },
              { year: 2023, examType: 'end_sem', title: 'End Semester Exam 2023', fileUrl: 'https://www.mindflowlearn.co.in/sample-pyqs/21CS52-2023-EndSem.pdf' }
            ]
          },
          {
            name: 'Automata Theory and Computability',
            code: '21CS51',
            slug: 'automata-theory-and-computability',
            credits: 4,
            guidance: {
              notes: 'DFA/NFA conversions, Regular Expressions, Pumping Lemma for Regular Languages, Context-Free Grammars (CFG), Pushdown Automata (PDA), and Turing Machines.',
              passingTips: 'Draw clear state transition diagrams for DFA and construct PDA state tables for {a^n b^n | n >= 1}.',
              highYieldTopics: ['NFA to DFA Subset Construction', 'Pumping Lemma for Regular Languages Proof', 'Pushdown Automata (PDA) Design', 'Turing Machine for Palindromes / Addition', 'Chomsky Normal Form (CNF) Conversion']
            },
            pyqs: [
              { year: 2024, examType: 'end_sem', title: 'End Semester Exam 2024', fileUrl: 'https://www.mindflowlearn.co.in/sample-pyqs/21CS51-2024-EndSem.pdf' },
              { year: 2023, examType: 'end_sem', title: 'End Semester Exam 2023', fileUrl: 'https://www.mindflowlearn.co.in/sample-pyqs/21CS51-2023-EndSem.pdf' }
            ]
          }
        ]
      },
      {
        number: 6,
        subjects: [
          {
            name: 'System Software and Compiler Design',
            code: '21CS61',
            slug: 'system-software-and-compiler-design',
            credits: 4,
            guidance: {
              notes: 'Phases of Compiler, Lexical Analysis, LL(1) Parsing tables, LR(0)/SLR(1) Parsing, Intermediate Code Generation (Three-Address Code), and Code Optimization (DAG).',
              passingTips: 'Compute First & Follow sets accurately and construct the LL(1) parse table step-by-step.',
              highYieldTopics: ['First and Follow Set Computation', 'LL(1) Parsing Table Construction', 'LR(0) Canonical Items and SLR(1) Table', 'Three-Address Code Generation (Quadruples/Triples)', 'Directed Acyclic Graph (DAG) for Basic Blocks']
            },
            pyqs: [
              { year: 2024, examType: 'end_sem', title: 'End Semester Exam 2024', fileUrl: 'https://www.mindflowlearn.co.in/sample-pyqs/21CS61-2024-EndSem.pdf' },
              { year: 2023, examType: 'end_sem', title: 'End Semester Exam 2023', fileUrl: 'https://www.mindflowlearn.co.in/sample-pyqs/21CS61-2023-EndSem.pdf' }
            ]
          },
          {
            name: 'Cloud Computing and DevOps',
            code: '21CS63',
            slug: 'cloud-computing-and-devops',
            credits: 3,
            guidance: {
              notes: 'Cloud Service Models (IaaS, PaaS, SaaS), Virtualization, Docker Containers, Kubernetes Pods/Services, CI/CD Pipelines (Jenkins/GitHub Actions), and Infrastructure as Code (Terraform).',
              passingTips: 'Explain Docker architecture and draw CI/CD pipeline stage workflows clearly.',
              highYieldTopics: ['IaaS vs PaaS vs SaaS Architecture', 'Hypervisors Type 1 vs Type 2 Virtualization', 'Docker Container Lifecycle & Dockerfile Commands', 'Kubernetes Architecture (Master-Node, Pods, Services)', 'CI/CD Pipeline Workflow Implementation']
            },
            pyqs: [
              { year: 2024, examType: 'end_sem', title: 'End Semester Exam 2024', fileUrl: 'https://www.mindflowlearn.co.in/sample-pyqs/21CS63-2024-EndSem.pdf' }
            ]
          }
        ]
      },
      {
        number: 7,
        subjects: [
          {
            name: 'Machine Learning and Deep Learning',
            code: '21CS71',
            slug: 'machine-learning-and-deep-learning',
            credits: 4,
            guidance: {
              notes: 'Supervised vs Unsupervised Learning, Linear/Logistic Regression, Decision Trees (ID3), SVM, Multi-Layer Perceptron (Backpropagation), Convolutional Neural Networks (CNN), and RNN/LSTM.',
              passingTips: 'Master the Backpropagation gradient descent weight update equations and CNN layer operations (Convolution, ReLU, Max Pooling).',
              highYieldTopics: ['Backpropagation Algorithm Derivation', 'CNN Architecture (Convolution, Pooling, Fully Connected)', 'SVM Kernel Functions & Hyperplane Margin', 'Decision Tree Entropy & Information Gain', 'RNN Vanishing Gradient Problem & LSTM Gates']
            },
            pyqs: [
              { year: 2024, examType: 'end_sem', title: 'End Semester Exam 2024', fileUrl: 'https://www.mindflowlearn.co.in/sample-pyqs/21CS71-2024-EndSem.pdf' },
              { year: 2023, examType: 'end_sem', title: 'End Semester Exam 2023', fileUrl: 'https://www.mindflowlearn.co.in/sample-pyqs/21CS71-2023-EndSem.pdf' }
            ]
          }
        ]
      }
    ]
  },
  {
    name: 'CSE — Artificial Intelligence & Machine Learning',
    shortName: 'CSE (AI/ML)',
    slug: 'cse-aiml',
    codePrefix: 'AI',
    description: 'Deep neural networks, computer vision, natural language processing, cognitive computing, and generative AI models.',
    badge: 'Trending',
    semesters: [
      {
        number: 3,
        subjects: [
          {
            name: 'Discrete Mathematics for AI',
            code: '21AI31',
            slug: 'discrete-mathematics-for-ai',
            credits: 4,
            guidance: {
              notes: 'Propositional Logic, Predicate Calculus, Graph Theory (Trees, Eulerian/Hamiltonian graphs), Recurrence Relations, and Combinatorics.',
              passingTips: 'Practice truth table proofs and solving second-order linear homogeneous recurrence relations.',
              highYieldTopics: ['Propositional Logic Equivalence Proofs', 'Generating Functions for Recurrences', 'Eulerian & Hamiltonian Graph Conditions', 'Bayes Theorem & Conditional Probability']
            },
            pyqs: [
              { year: 2024, examType: 'end_sem', title: 'End Semester Exam 2024', fileUrl: 'https://www.mindflowlearn.co.in/sample-pyqs/21AI31-2024-EndSem.pdf' }
            ]
          },
          {
            name: 'Data Structures and Algorithms with Python',
            code: '21AI32',
            slug: 'data-structures-and-algorithms-with-python',
            credits: 4,
            guidance: {
              notes: 'Python implementations of Linked Lists, Stacks, Queues, Binary Search Trees, Heaps, and Graph algorithms (BFS/DFS, Dijkstra).',
              passingTips: 'Write clean Python classes for Node, Stack, and BST with traversal methods.',
              highYieldTopics: ['Python BST Insertion & Deletion Class Methods', 'Heap Sort & Priority Queue in Python', 'Graph Representation (Adjacency List vs Matrix)', 'Big-O Complexity Analysis']
            },
            pyqs: [
              { year: 2024, examType: 'end_sem', title: 'End Semester Exam 2024', fileUrl: 'https://www.mindflowlearn.co.in/sample-pyqs/21AI32-2024-EndSem.pdf' }
            ]
          }
        ]
      },
      {
        number: 4,
        subjects: [
          {
            name: 'Probability and Statistics for Data Science',
            code: '21AI41',
            slug: 'probability-and-statistics-for-data-science',
            credits: 4,
            guidance: {
              notes: 'Probability Distributions (Binomial, Poisson, Normal), Central Limit Theorem, Hypothesis Testing (t-test, z-test, Chi-Square), and Covariance/Correlation matrices.',
              passingTips: 'Solve hypothesis testing numericals step-by-step: Null hypothesis, Critical value, Test statistic, Conclusion.',
              highYieldTopics: ['Hypothesis Testing (t-test and z-test)', 'Normal Distribution & Z-Score Calculations', 'Bayes Theorem Applications in Machine Learning', 'Chi-Square Goodness of Fit Test']
            },
            pyqs: [
              { year: 2024, examType: 'end_sem', title: 'End Semester Exam 2024', fileUrl: 'https://www.mindflowlearn.co.in/sample-pyqs/21AI41-2024-EndSem.pdf' }
            ]
          }
        ]
      },
      {
        number: 5,
        subjects: [
          {
            name: 'Foundations of Machine Learning',
            code: '21AI51',
            slug: 'foundations-of-machine-learning',
            credits: 4,
            guidance: {
              notes: 'Linear & Logistic Regression, Decision Trees (ID3/C4.5 Entropy & Information Gain), SVM (Kernel Trick), Naive Bayes Classifier, and Evaluation Metrics (ROC-AUC, Precision/Recall/F1).',
              passingTips: 'Practice Information Gain numerical calculations for Decision Tree root node selection.',
              highYieldTopics: ['Decision Tree Information Gain & Entropy Calculations', 'SVM Margin Maximization & Dual Formulation', 'Bias-Variance Tradeoff & Regularization (L1/L2)', 'Naive Bayes Classification Probability Numerical', 'K-Means Clustering Step-by-Step']
            },
            pyqs: [
              { year: 2024, examType: 'end_sem', title: 'End Semester Exam 2024', fileUrl: 'https://www.mindflowlearn.co.in/sample-pyqs/21AI51-2024-EndSem.pdf' },
              { year: 2023, examType: 'end_sem', title: 'End Semester Exam 2023', fileUrl: 'https://www.mindflowlearn.co.in/sample-pyqs/21AI51-2023-EndSem.pdf' }
            ]
          },
          {
            name: 'Artificial Intelligence & Search Algorithms',
            code: '21AI52',
            slug: 'artificial-intelligence-and-search-algorithms',
            credits: 3,
            guidance: {
              notes: 'Uninformed Search (BFS, DFS, Uniform Cost), Informed Search (A*, Greedy Best-First), Game Playing (Minimax, Alpha-Beta Pruning), and Constraint Satisfaction Problems.',
              passingTips: 'Draw complete search trees showing heuristic calculations and Alpha-Beta pruning branch cuts.',
              highYieldTopics: ['A* Search with Admissible & Consistent Heuristics', 'Alpha-Beta Pruning on Game Trees', 'Constraint Satisfaction with Backtracking & AC-3', 'Hill Climbing & Local Maxima Avoidance']
            },
            pyqs: [
              { year: 2024, examType: 'end_sem', title: 'End Semester Exam 2024', fileUrl: 'https://www.mindflowlearn.co.in/sample-pyqs/21AI52-2024-EndSem.pdf' },
              { year: 2023, examType: 'end_sem', title: 'End Semester Exam 2023', fileUrl: 'https://www.mindflowlearn.co.in/sample-pyqs/21AI52-2023-EndSem.pdf' }
            ]
          }
        ]
      },
      {
        number: 6,
        subjects: [
          {
            name: 'Deep Learning and Neural Networks',
            code: '21AI61',
            slug: 'deep-learning-and-neural-networks',
            credits: 4,
            guidance: {
              notes: 'Feedforward Networks, Activation Functions (ReLU, Sigmoid, Softmax), Optimization (Adam, RMSProp), CNN Architectures (ResNet, VGG), and Sequence Models (RNN, LSTM, Transformers).',
              passingTips: 'Explain Transformer Self-Attention mechanism equations and draw ResNet skip-connection residual blocks.',
              highYieldTopics: ['Self-Attention & Multi-Head Attention in Transformers', 'ResNet Residual Block Architecture', 'Optimization Algorithms (SGD vs Adam vs RMSProp)', 'Vanishing & Exploding Gradients Solutions (BatchNorm, LayerNorm)']
            },
            pyqs: [
              { year: 2024, examType: 'end_sem', title: 'End Semester Exam 2024', fileUrl: 'https://www.mindflowlearn.co.in/sample-pyqs/21AI61-2024-EndSem.pdf' }
            ]
          },
          {
            name: 'Natural Language Processing',
            code: '21AI62',
            slug: 'natural-language-processing',
            credits: 3,
            guidance: {
              notes: 'Text Preprocessing (Tokenization, Lemmatization), N-gram Language Models, Word Embeddings (Word2Vec, GloVe), Sequence Tagging (HMM/CRF), and Pretrained LLMs (BERT, GPT).',
              passingTips: 'Explain Skip-Gram vs Continuous Bag of Words (CBOW) in Word2Vec and BERT Masked Language Modeling.',
              highYieldTopics: ['Word2Vec Skip-Gram Architecture with Negative Sampling', 'BERT vs GPT Architectural Differences', 'N-gram Language Modeling & Smoothing Techniques', 'TF-IDF & Cosine Similarity for Semantic Search']
            },
            pyqs: [
              { year: 2024, examType: 'end_sem', title: 'End Semester Exam 2024', fileUrl: 'https://www.mindflowlearn.co.in/sample-pyqs/21AI62-2024-EndSem.pdf' }
            ]
          }
        ]
      }
    ]
  },
  {
    name: 'CSE — Data Science',
    shortName: 'CSE (Data Science)',
    slug: 'cse-ds',
    codePrefix: 'DS',
    description: 'Statistical modeling, big data pipelines, distributed computing, and predictive analytics.',
    badge: 'Popular',
    semesters: [
      {
        number: 4,
        subjects: [
          {
            name: 'Statistical Inference and R Programming',
            code: '21DS41',
            slug: 'statistical-inference-and-r-programming',
            credits: 4,
            guidance: {
              notes: 'Parametric and Non-parametric tests, ANOVA (One-way and Two-way), Linear Regression modeling in R, and Data Wrangling using dplyr/ggplot2.',
              passingTips: 'Solve ANOVA table sum of squares numerical calculations and write basic R ggplot code snippets.',
              highYieldTopics: ['One-Way and Two-Way ANOVA Calculations', 'Simple & Multiple Linear Regression in R', 'Data Manipulation with dplyr (filter, mutate, group_by)', 'Confidence Intervals and P-Value Interpretation']
            },
            pyqs: [
              { year: 2024, examType: 'end_sem', title: 'End Semester Exam 2024', fileUrl: 'https://www.mindflowlearn.co.in/sample-pyqs/21DS41-2024-EndSem.pdf' }
            ]
          }
        ]
      },
      {
        number: 5,
        subjects: [
          {
            name: 'Data Mining and Warehousing',
            code: '21DS51',
            slug: 'data-mining-and-warehousing',
            credits: 4,
            guidance: {
              notes: 'Data Preprocessing, Star and Snowflake Schemas, Apriori Algorithm (Frequent Itemset Mining), FP-Growth, and DBSCAN Clustering.',
              passingTips: 'Apriori candidate generation step-by-step is asked in almost every question paper.',
              highYieldTopics: ['Apriori Association Rule Generation', 'Star Schema vs Snowflake Schema Design', 'OLAP Operations (Roll-up, Drill-down, Slice, Dice)', 'DBSCAN vs K-Means Comparison']
            },
            pyqs: [
              { year: 2024, examType: 'end_sem', title: 'End Semester Exam 2024', fileUrl: 'https://www.mindflowlearn.co.in/sample-pyqs/21DS51-2024-EndSem.pdf' },
              { year: 2023, examType: 'end_sem', title: 'End Semester Exam 2023', fileUrl: 'https://www.mindflowlearn.co.in/sample-pyqs/21DS51-2023-EndSem.pdf' }
            ]
          },
          {
            name: 'Data Visualization and Business Intelligence',
            code: '21DS54',
            slug: 'data-visualization-and-bi',
            credits: 3,
            guidance: {
              notes: 'Principles of Visual Perception, Dashboard Design, Tableau / Power BI architecture, Storytelling with Data, and Exploratory Data Analysis (EDA).',
              passingTips: 'Explain visual encodings (color, position, length) and differentiate between exploratory vs explanatory dashboards.',
              highYieldTopics: ['Gestalt Principles in Data Visualization', 'Tableau Data Architecture (Extracts vs Live Connections)', 'Dashboard KPIs & Drill-Down Reports', 'Heatmaps, Boxplots, and Scatter Plots for Anomaly Detection']
            },
            pyqs: [
              { year: 2024, examType: 'end_sem', title: 'End Semester Exam 2024', fileUrl: 'https://www.mindflowlearn.co.in/sample-pyqs/21DS54-2024-EndSem.pdf' }
            ]
          }
        ]
      },
      {
        number: 6,
        subjects: [
          {
            name: 'Big Data Analytics with Apache Spark',
            code: '21DS61',
            slug: 'big-data-analytics-with-spark',
            credits: 4,
            guidance: {
              notes: 'Hadoop Ecosystem (HDFS, MapReduce), Apache Spark Architecture, RDD Transformations vs Actions, Spark SQL, and Spark Streaming.',
              passingTips: 'Explain Spark Master-Worker architecture, DAG execution engine, and write sample PySpark code for word count.',
              highYieldTopics: ['Spark RDD (Transformations vs Actions & Lazy Evaluation)', 'HDFS Architecture (NameNode, DataNode, Secondary NameNode)', 'Spark SQL DataFrames & Optimization (Catalyst Optimizer)', 'MapReduce WordCount Execution Flow']
            },
            pyqs: [
              { year: 2024, examType: 'end_sem', title: 'End Semester Exam 2024', fileUrl: 'https://www.mindflowlearn.co.in/sample-pyqs/21DS61-2024-EndSem.pdf' }
            ]
          }
        ]
      }
    ]
  },
  {
    name: 'Cyber Security',
    shortName: 'Cyber Security',
    slug: 'cyber-security',
    codePrefix: 'CY',
    description: 'Network security, applied cryptography, ethical hacking, digital forensics, malware analysis, and cloud defense.',
    badge: 'High Demand',
    semesters: [
      {
        number: 4,
        subjects: [
          {
            name: 'Number Theory and Cryptography Foundations',
            code: '21CY41',
            slug: 'number-theory-and-cryptography',
            credits: 4,
            guidance: {
              notes: 'Modular Arithmetic, Euclidean Algorithm & Extended Euclidean, Fermat’s Little Theorem, Euler’s Totient Function, and Chinese Remainder Theorem.',
              passingTips: 'Solve modular inverse using Extended Euclidean algorithm and Chinese Remainder Theorem systems of congruences.',
              highYieldTopics: ['Extended Euclidean Algorithm for Modular Inverse', 'Euler’s Totient Function & Euler’s Theorem', 'Chinese Remainder Theorem Numerical Solution', 'Discrete Logarithm Problem in Cryptography']
            },
            pyqs: [
              { year: 2024, examType: 'end_sem', title: 'End Semester Exam 2024', fileUrl: 'https://www.mindflowlearn.co.in/sample-pyqs/21CY41-2024-EndSem.pdf' }
            ]
          }
        ]
      },
      {
        number: 5,
        subjects: [
          {
            name: 'Applied Cryptography and Network Security',
            code: '21CY51',
            slug: 'applied-cryptography-and-network-security',
            credits: 4,
            guidance: {
              notes: 'Symmetric Ciphers (AES, DES), Asymmetric Ciphers (RSA, Diffie-Hellman Key Exchange), Hash Functions (SHA-256), Digital Signatures, and TLS Handshake.',
              passingTips: 'Master RSA key generation and encryption/decryption with small numerical primes.',
              highYieldTopics: ['RSA Algorithm Numerical Calculation', 'Diffie-Hellman Key Exchange Man-in-the-Middle Vulnerability', 'AES Round Transformations (SubBytes, ShiftRows, MixColumns)', 'TLS 1.3 Handshake Protocol']
            },
            pyqs: [
              { year: 2024, examType: 'end_sem', title: 'End Semester Exam 2024', fileUrl: 'https://www.mindflowlearn.co.in/sample-pyqs/21CY51-2024-EndSem.pdf' },
              { year: 2023, examType: 'end_sem', title: 'End Semester Exam 2023', fileUrl: 'https://www.mindflowlearn.co.in/sample-pyqs/21CY51-2023-EndSem.pdf' }
            ]
          },
          {
            name: 'Ethical Hacking and Penetration Testing',
            code: '21CY52',
            slug: 'ethical-hacking-and-penetration-testing',
            credits: 3,
            guidance: {
              notes: 'Reconnaissance (Nmap, OSINT), Vulnerability Scanning (Nessus), Web Application Security (OWASP Top 10: SQLi, XSS, CSRF), and Metasploit exploitation.',
              passingTips: 'Explain SQL Injection remediation (Prepared Statements) and Stored vs Reflected XSS payloads.',
              highYieldTopics: ['OWASP Top 10 Web Vulnerabilities', 'SQL Injection (Union-based & Blind SQLi)', 'Cross-Site Scripting (XSS) Prevention', 'Network Scanning Techniques with Nmap']
            },
            pyqs: [
              { year: 2024, examType: 'end_sem', title: 'End Semester Exam 2024', fileUrl: 'https://www.mindflowlearn.co.in/sample-pyqs/21CY52-2024-EndSem.pdf' }
            ]
          }
        ]
      },
      {
        number: 6,
        subjects: [
          {
            name: 'Digital Forensics and Incident Response',
            code: '21CY61',
            slug: 'digital-forensics-and-incident-response',
            credits: 4,
            guidance: {
              notes: 'Chain of Custody, Disk Imaging (dd, FTK Imager), File System Forensics (NTFS/FAT), Memory Forensics (Volatility), and Incident Handling lifecycle (NIST SP 800-61).',
              passingTips: 'Explain the 6 stages of NIST Incident Handling and the volatile data collection order.',
              highYieldTopics: ['NIST Incident Response Lifecycle (Preparation to Post-Incident)', 'Order of Volatility in Live Memory Forensics', 'Chain of Custody & Evidence Acquisition Procedures', 'NTFS Master File Table (MFT) & Log Analysis']
            },
            pyqs: [
              { year: 2024, examType: 'end_sem', title: 'End Semester Exam 2024', fileUrl: 'https://www.mindflowlearn.co.in/sample-pyqs/21CY61-2024-EndSem.pdf' }
            ]
          }
        ]
      }
    ]
  },
  {
    name: 'Information Science & Engineering',
    shortName: 'ISE',
    slug: 'ise',
    codePrefix: 'IS',
    description: 'Enterprise information systems, full-stack software development, cloud computing, and distributed applications.',
    badge: 'Core',
    semesters: [
      {
        number: 4,
        subjects: [
          {
            name: 'Microcontrollers and Embedded Systems',
            code: '21IS43',
            slug: 'microcontrollers-and-embedded-systems',
            credits: 3,
            guidance: {
              notes: 'ARM Cortex Architecture, Memory Map, Assembly Instructions, Timer and Interrupt programming, and Sensor Interfacing (ADC, DAC, PWM).',
              passingTips: 'Learn ARM register organization and write short assembly routines for array traversal and block move.',
              highYieldTopics: ['ARM Cortex-M3 Register Structure', 'Interrupt Handling in ARM Microcontrollers', 'ADC & DAC Interfacing with PWM', 'Memory Architecture & Bus Protocols']
            },
            pyqs: [
              { year: 2024, examType: 'end_sem', title: 'End Semester Exam 2024', fileUrl: 'https://www.mindflowlearn.co.in/sample-pyqs/21IS43-2024-EndSem.pdf' },
              { year: 2023, examType: 'end_sem', title: 'End Semester Exam 2023', fileUrl: 'https://www.mindflowlearn.co.in/sample-pyqs/21IS43-2023-EndSem.pdf' }
            ]
          },
          {
            name: 'Software Engineering and Agile Methodologies',
            code: '21IS45',
            slug: 'software-engineering-and-agile',
            credits: 3,
            guidance: {
              notes: 'SDLC Models (Waterfall, Spiral, Agile Scrum), Requirement Engineering (SRS), UML Diagrams (Use Case, Class, Sequence), and Software Testing (Black-box vs White-box).',
              passingTips: 'Draw complete UML Class and Sequence diagrams for an online shopping or library management system.',
              highYieldTopics: ['Agile Scrum Framework (Sprints, User Stories, Daily Standups)', 'UML Class Diagram with Association & Multiplicity', 'Cyclomatic Complexity & Basis Path Testing', 'Black-box vs White-box Testing Techniques']
            },
            pyqs: [
              { year: 2024, examType: 'end_sem', title: 'End Semester Exam 2024', fileUrl: 'https://www.mindflowlearn.co.in/sample-pyqs/21IS45-2024-EndSem.pdf' }
            ]
          }
        ]
      },
      {
        number: 5,
        subjects: [
          {
            name: 'Enterprise Java and Web Frameworks',
            code: '21IS54',
            slug: 'enterprise-java-and-web-frameworks',
            credits: 4,
            guidance: {
              notes: 'Java Servlets, JSP, JDBC Database Connectivity, Spring Boot Architecture, Dependency Injection (IoC), and RESTful API design.',
              passingTips: 'Write complete Servlet lifecycle methods and Spring Boot @RestController endpoint snippets.',
              highYieldTopics: ['Servlet Lifecycle (init, service, destroy)', 'Spring Boot Dependency Injection & IoC Container', 'Building RESTful APIs with Spring Boot Annotations', 'JSP Implicit Objects & Session Management']
            },
            pyqs: [
              { year: 2024, examType: 'end_sem', title: 'End Semester Exam 2024', fileUrl: 'https://www.mindflowlearn.co.in/sample-pyqs/21IS54-2024-EndSem.pdf' }
            ]
          }
        ]
      }
    ]
  },
  {
    name: 'Electronics & Communication Engineering',
    shortName: 'ECE',
    slug: 'ece',
    codePrefix: 'EC',
    description: 'Signal processing, VLSI design, wireless communication, RF systems, microelectronics, and embedded circuits.',
    badge: 'Core',
    semesters: [
      {
        number: 3,
        subjects: [
          {
            name: 'Network Theory and Analysis',
            code: '21EC32',
            slug: 'network-theory-and-analysis',
            credits: 4,
            guidance: {
              notes: 'Mesh and Nodal Analysis, Network Theorems (Thevenin, Norton, Superposition, Maximum Power Transfer), Transient Analysis of RL/RC/RLC circuits, and Two-Port Parameters (Z, Y, ABCD, h).',
              passingTips: 'Master Thevenin equivalent circuit calculations and Z/Y parameter matrix conversions.',
              highYieldTopics: ['Thevenin and Norton Theorem with Dependent Sources', 'Maximum Power Transfer Theorem Proof', 'Two-Port Network Parameter Interconversions (Z, Y, ABCD)', 'Transient Response in Series RLC Circuits']
            },
            pyqs: [
              { year: 2024, examType: 'end_sem', title: 'End Semester Exam 2024', fileUrl: 'https://www.mindflowlearn.co.in/sample-pyqs/21EC32-2024-EndSem.pdf' }
            ]
          }
        ]
      },
      {
        number: 4,
        subjects: [
          {
            name: 'Signals and Systems',
            code: '21EC42',
            slug: 'signals-and-systems',
            credits: 4,
            guidance: {
              notes: 'Classification of Signals (Continuous/Discrete, Periodic, Energy/Power), LTI Systems (Convolution Integral/Sum), Fourier Transform, Laplace Transform, and Z-Transform.',
              passingTips: 'Solve convolution numericals and ROC (Region of Convergence) properties in Z-Transforms.',
              highYieldTopics: ['Convolution Sum and Integral Evaluations', 'Fourier Transform Properties & Duality', 'Z-Transform Inverse & ROC Stability Criteria', 'LTI System Causality & Stability Proofs']
            },
            pyqs: [
              { year: 2024, examType: 'end_sem', title: 'End Semester Exam 2024', fileUrl: 'https://www.mindflowlearn.co.in/sample-pyqs/21EC42-2024-EndSem.pdf' },
              { year: 2023, examType: 'end_sem', title: 'End Semester Exam 2023', fileUrl: 'https://www.mindflowlearn.co.in/sample-pyqs/21EC42-2023-EndSem.pdf' }
            ]
          },
          {
            name: 'Analog Communication Systems',
            code: '21EC43',
            slug: 'analog-communication-systems',
            credits: 3,
            guidance: {
              notes: 'Amplitude Modulation (DSB-SC, SSB, VSB), Angle Modulation (Frequency Modulation & Phase Modulation), Noise in Communication (SNR, Figure of Merit), and Superheterodyne Receivers.',
              passingTips: 'Derive FM bandwidth using Carson’s Rule and draw neat Superheterodyne AM receiver block diagrams.',
              highYieldTopics: ['AM Modulation Index & Total Power Calculation', 'Carson’s Rule for FM Bandwidth', 'Superheterodyne Receiver Intermediate Frequency (IF)', 'Noise Figure & Equivalent Noise Temperature']
            },
            pyqs: [
              { year: 2024, examType: 'end_sem', title: 'End Semester Exam 2024', fileUrl: 'https://www.mindflowlearn.co.in/sample-pyqs/21EC43-2024-EndSem.pdf' }
            ]
          }
        ]
      },
      {
        number: 5,
        subjects: [
          {
            name: 'Digital Signal Processing',
            code: '21EC51',
            slug: 'digital-signal-processing',
            credits: 4,
            guidance: {
              notes: 'Discrete Fourier Transform (DFT), Fast Fourier Transform (FFT: Radix-2 DIT & DIF algorithms), FIR Filter Design (Windowing technique), and IIR Filter Design (Bilinear Transformation).',
              passingTips: 'Draw 8-point Radix-2 DIT-FFT butterfly diagrams step-by-step with twiddle factor calculations.',
              highYieldTopics: ['8-Point Radix-2 DIT / DIF FFT Butterfly Flow Graph', 'Bilinear Transformation for IIR Filter Design', 'FIR Filter Design using Hamming / Hanning Windows', 'Circular Convolution using DFT and IDFT']
            },
            pyqs: [
              { year: 2024, examType: 'end_sem', title: 'End Semester Exam 2024', fileUrl: 'https://www.mindflowlearn.co.in/sample-pyqs/21EC51-2024-EndSem.pdf' },
              { year: 2023, examType: 'end_sem', title: 'End Semester Exam 2023', fileUrl: 'https://www.mindflowlearn.co.in/sample-pyqs/21EC51-2023-EndSem.pdf' }
            ]
          },
          {
            name: 'VLSI Design and CMOS Technology',
            code: '21EC53',
            slug: 'vlSI-design-and-cmos',
            credits: 4,
            guidance: {
              notes: 'MOS Transistor Theory (nوضMOS/pMOS I-V characteristics), CMOS Inverter Voltage Transfer Characteristic (VTC), Layout Stick Diagrams & Lambda Design Rules, and Delay Estimation (Elmore Delay).',
              passingTips: 'Draw CMOS stick diagrams for NAND, NOR, and XOR logic gates with color/layer codes.',
              highYieldTopics: ['CMOS Inverter DC Transfer Characteristics & Noise Margins', 'Stick Diagram and Layout for Complex CMOS Logic', 'Elmore Delay Model Calculations', 'Static vs Dynamic Power Dissipation in CMOS']
            },
            pyqs: [
              { year: 2024, examType: 'end_sem', title: 'End Semester Exam 2024', fileUrl: 'https://www.mindflowlearn.co.in/sample-pyqs/21EC53-2024-EndSem.pdf' }
            ]
          }
        ]
      }
    ]
  },
  {
    name: 'Mechanical Engineering',
    shortName: 'Mechanical',
    slug: 'me',
    codePrefix: 'ME',
    description: 'Thermodynamics, fluid machinery, CAD/CAM manufacturing, structural mechanics, and thermal power plants.',
    badge: 'Core',
    semesters: [
      {
        number: 3,
        subjects: [
          {
            name: 'Thermodynamics & Heat Transfer',
            code: '21ME32',
            slug: 'thermodynamics-and-heat-transfer',
            credits: 4,
            guidance: {
              notes: 'First and Second Laws of Thermodynamics, Carnot Engine, Entropy change of ideal gases, Rankine Cycle, and Conduction/Convection/Radiation equations.',
              passingTips: 'Draw accurate T-s and P-v diagrams for Rankine and Brayton cycles.',
              highYieldTopics: ['Second Law Kelvin-Planck & Clausius Statements', 'Rankine Cycle Thermal Efficiency Calculations', 'Steady State 1D Heat Conduction Through Composite Walls', 'Entropy Generation in Closed Systems']
            },
            pyqs: [
              { year: 2024, examType: 'end_sem', title: 'End Semester Exam 2024', fileUrl: 'https://www.mindflowlearn.co.in/sample-pyqs/21ME32-2024-EndSem.pdf' },
              { year: 2023, examType: 'end_sem', title: 'End Semester Exam 2023', fileUrl: 'https://www.mindflowlearn.co.in/sample-pyqs/21ME32-2023-EndSem.pdf' }
            ]
          },
          {
            name: 'Mechanics of Materials',
            code: '21ME33',
            slug: 'mechanics-of-materials',
            credits: 4,
            guidance: {
              notes: 'Stress and Strain, Hooke’s Law, Shear Force & Bending Moment Diagrams (SFD & BMD), Bending and Shear Stresses in Beams, Torsion of Circular Shafts, and Euler’s Column Theory.',
              passingTips: 'Draw SFD and BMD for simply supported and cantilever beams with point and uniformly distributed loads (UDL).',
              highYieldTopics: ['Shear Force and Bending Moment Diagrams (SFD/BMD)', 'Pure Bending Equation & Section Modulus', 'Torsion Equation for Solid vs Hollow Shafts', 'Euler’s Critical Buckling Load for Columns']
            },
            pyqs: [
              { year: 2024, examType: 'end_sem', title: 'End Semester Exam 2024', fileUrl: 'https://www.mindflowlearn.co.in/sample-pyqs/21ME33-2024-EndSem.pdf' }
            ]
          }
        ]
      },
      {
        number: 4,
        subjects: [
          {
            name: 'Fluid Mechanics and Machinery',
            code: '21ME42',
            slug: 'fluid-mechanics-and-machinery',
            credits: 4,
            guidance: {
              notes: 'Fluid Statics, Continuity Equation, Bernoulli’s Equation, Laminar & Turbulent Flow in Pipes (Darcy-Weisbach Equation), Pelton Wheel, Francis Turbine, and Centrifugal Pumps.',
              passingTips: 'Draw velocity triangles for Pelton wheel and Francis turbine blade inlets and outlets.',
              highYieldTopics: ['Bernoulli Equation & Venturimeter Discharge Calculations', 'Major and Minor Energy Losses in Pipe Flow', 'Pelton Wheel Turbine Efficiency & Velocity Triangles', 'Centrifugal Pump Performance & Cavitation / NPSH']
            },
            pyqs: [
              { year: 2024, examType: 'end_sem', title: 'End Semester Exam 2024', fileUrl: 'https://www.mindflowlearn.co.in/sample-pyqs/21ME42-2024-EndSem.pdf' }
            ]
          }
        ]
      }
    ]
  },
  {
    name: 'Aerospace Engineering',
    shortName: 'Aerospace',
    slug: 'ae',
    codePrefix: 'AE',
    description: 'Aerodynamics, propulsion systems, flight mechanics, aircraft structures, and space vehicle mechanics.',
    badge: 'Specialized',
    semesters: [
      {
        number: 3,
        subjects: [
          {
            name: 'Introduction to Aerospace Engineering',
            code: '21AE31',
            slug: 'introduction-to-aerospace-engineering',
            credits: 3,
            guidance: {
              notes: 'Standard Atmosphere model, Aircraft Anatomy (Fuselage, Wing, Empennage, Control Surfaces), Principles of Flight (Lift, Drag, Thrust, Weight), and Aircraft Instruments.',
              passingTips: 'Explain how elevator, rudder, and ailerons control pitch, yaw, and roll.',
              highYieldTopics: ['International Standard Atmosphere (ISA) Properties', 'Primary and Secondary Flight Control Surfaces', 'Airfoil Geometry Nomenclature (NACA 4-digit series)', 'Pitot-Static Tube Principle for Airspeed']
            },
            pyqs: [
              { year: 2024, examType: 'end_sem', title: 'End Semester Exam 2024', fileUrl: 'https://www.mindflowlearn.co.in/sample-pyqs/21AE31-2024-EndSem.pdf' }
            ]
          }
        ]
      },
      {
        number: 4,
        subjects: [
          {
            name: 'Aerodynamics and Fluid Flow',
            code: '21AE42',
            slug: 'aerodynamics-and-fluid-flow',
            credits: 4,
            guidance: {
              notes: 'Bernoulli Equation, Potential Flow Theory, NACA Airfoil Nomenclature, Kutta-Joukowski Theorem, Shock Waves, and Boundary Layer Separation.',
              passingTips: 'Derive lift and drag coefficients for thin airfoils and draw pressure distribution graphs.',
              highYieldTopics: ['Thin Airfoil Theory Derivation', 'Kutta Condition & Circulation', 'Normal and Oblique Shock Wave Relations', 'Laminar vs Turbulent Boundary Layer Transitions']
            },
            pyqs: [
              { year: 2024, examType: 'end_sem', title: 'End Semester Exam 2024', fileUrl: 'https://www.mindflowlearn.co.in/sample-pyqs/21AE42-2024-EndSem.pdf' },
              { year: 2023, examType: 'end_sem', title: 'End Semester Exam 2023', fileUrl: 'https://www.mindflowlearn.co.in/sample-pyqs/21AE42-2023-EndSem.pdf' }
            ]
          },
          {
            name: 'Aircraft Propulsion',
            code: '21AE43',
            slug: 'aircraft-propulsion',
            credits: 4,
            guidance: {
              notes: 'Gas Turbine Engines (Turbojet, Turbofan, Turboprop, Turboshaft), Brayton Cycle Analysis, Inlets & Nozzles, Compressors (Axial vs Centrifugal), and Combustion Chambers.',
              passingTips: 'Draw T-s diagram for ideal vs actual Brayton cycle in turbojet engines and derive thermal efficiency.',
              highYieldTopics: ['Turbojet Engine Brayton Cycle T-s Diagram', 'Subsonic vs Supersonic Inlets & Convergent-Divergent Nozzles', 'Axial Flow Compressor Velocity Triangles & Stalling', 'Specific Thrust and Thrust Specific Fuel Consumption (TSFC)']
            },
            pyqs: [
              { year: 2024, examType: 'end_sem', title: 'End Semester Exam 2024', fileUrl: 'https://www.mindflowlearn.co.in/sample-pyqs/21AE43-2024-EndSem.pdf' }
            ]
          }
        ]
      }
    ]
  }
];

export const getBranchBySlug = (slug) => DSU_BRANCHES.find((b) => b.slug === slug) || null;

export const getSemester = (branchSlug, semesterNum) => {
  const branch = getBranchBySlug(branchSlug);
  if (!branch) return null;
  const num = parseInt(semesterNum, 10);
  const semester = branch.semesters.find((s) => s.number === num);
  return semester ? { ...semester, branch } : null;
};

export const getSubject = (branchSlug, semesterNum, subjectCodeOrSlug) => {
  const semester = getSemester(branchSlug, semesterNum);
  if (!semester) return null;
  const target = (subjectCodeOrSlug || '').toLowerCase();
  const subject = semester.subjects.find(
    (s) => s.code.toLowerCase() === target || s.slug.toLowerCase() === target
  );
  return subject ? { ...subject, semester, branch: semester.branch } : null;
};

export const searchDsuSubjects = (query) => {
  if (!query || typeof query !== 'string') return [];
  const q = query.trim().toLowerCase();
  const results = [];

  for (const branch of DSU_BRANCHES) {
    for (const sem of branch.semesters) {
      for (const sub of sem.subjects) {
        if (
          sub.name.toLowerCase().includes(q) ||
          sub.code.toLowerCase().includes(q) ||
          branch.name.toLowerCase().includes(q) ||
          branch.shortName.toLowerCase().includes(q)
        ) {
          results.push({
            ...sub,
            semesterNumber: sem.number,
            branch
          });
        }
      }
    }
  }

  return results;
};
