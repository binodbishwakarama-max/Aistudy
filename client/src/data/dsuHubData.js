/**
 * DSU Hub Static Dataset — Dayananda Sagar University (DSU) Engineering
 * Used by:
 * 1. Client SPA components (instant browsing & search)
 * 2. Build-time static prerenderer (generates static HTML files for crawlers)
 * 3. Seed script (seeds Supabase Postgres database)
 */

export const DSU_BRANCHES = [
  {
    name: 'Computer Science & Engineering',
    shortName: 'CSE',
    slug: 'cse',
    codePrefix: 'CS',
    description: 'Core software engineering, algorithms, system design, and computer architectures.',
    badge: 'Popular',
    semesters: [
      {
        number: 3,
        subjects: [
          {
            name: 'Data Structures and Applications',
            code: '21CS32',
            slug: 'data-structures-and-applications',
            credits: 4,
            guidance: {
              notes: 'Focus on Linked Lists, Trees (AVL, Binary Search Trees), Graph Traversals (BFS/DFS), and Time Complexity (Big-O). Module 3 (Trees) and Module 4 (Graphs) carry 40%+ of the final semester exam weightage.',
              passingTips: 'Master standard algorithm implementations (Insertion, Deletion, In-order/Pre-order traversal). Solve at least 3 previous year tree-balancing and Dijkstra question sets.',
              highYieldTopics: ['AVL Tree Rotations', 'Binary Search Tree Operations', 'Dijkstra Shortest Path', 'Queue & Stack Array Implementations', 'Hashing & Collision Resolution']
            },
            pyqs: [
              { year: 2024, examType: 'end_sem', title: 'End Semester Exam 2024 (Regular)', fileUrl: 'https://www.mindflowlearn.co.in/sample-pyqs/21CS32-2024-EndSem.pdf' },
              { year: 2024, examType: 'mid1', title: 'Continuous Internal Assessment (CIA-1) 2024', fileUrl: 'https://www.mindflowlearn.co.in/sample-pyqs/21CS32-2024-Mid1.pdf' },
              { year: 2023, examType: 'end_sem', title: 'End Semester Exam 2023', fileUrl: 'https://www.mindflowlearn.co.in/sample-pyqs/21CS32-2023-EndSem.pdf' },
              { year: 2023, examType: 'mid2', title: 'Continuous Internal Assessment (CIA-2) 2023', fileUrl: 'https://www.mindflowlearn.co.in/sample-pyqs/21CS32-2023-Mid2.pdf' },
              { year: 2022, examType: 'end_sem', title: 'End Semester Exam 2022', fileUrl: 'https://www.mindflowlearn.co.in/sample-pyqs/21CS32-2022-EndSem.pdf' }
            ]
          },
          {
            name: 'Analog and Digital Electronics',
            code: '21CS33',
            slug: 'analog-and-digital-electronics',
            credits: 3,
            guidance: {
              notes: 'Covers Op-Amps, Karnaugh Maps (K-Maps), Multiplexers, Decoders, Flip-Flops, and Counters. Digital logic questions are high scoring if state diagrams are neat.',
              passingTips: 'Practice 4-variable K-Map simplifications, JK flip-flop state transition tables, and 555 timer circuit diagrams.',
              highYieldTopics: ['4-Variable K-Map Minimization', 'Master-Slave JK Flip-Flop', 'Synchronous Up/Down Counter Design', 'Inverting & Non-Inverting Op-Amp Configurations']
            },
            pyqs: [
              { year: 2024, examType: 'end_sem', title: 'End Semester Exam 2024', fileUrl: 'https://www.mindflowlearn.co.in/sample-pyqs/21CS33-2024-EndSem.pdf' },
              { year: 2023, examType: 'end_sem', title: 'End Semester Exam 2023', fileUrl: 'https://www.mindflowlearn.co.in/sample-pyqs/21CS33-2023-EndSem.pdf' },
              { year: 2023, examType: 'mid1', title: 'Mid-1 Assessment 2023', fileUrl: 'https://www.mindflowlearn.co.in/sample-pyqs/21CS33-2023-Mid1.pdf' }
            ]
          },
          {
            name: 'Computer Organization and Architecture',
            code: '21CS34',
            slug: 'computer-organization-and-architecture',
            credits: 3,
            guidance: {
              notes: 'Focus on Memory Hierarchy (Cache mapping: Direct, Associative, Set-Associative), Instruction Formats, Pipelining hazards, and DMA controllers.',
              passingTips: 'Draw clear hardware architecture block diagrams and solve numerical problems on Cache Hit/Miss ratios.',
              highYieldTopics: ['Cache Memory Mapping Techniques', 'Instruction Pipelining Hazards (Data, Structural, Control)', 'Booth’s Multiplication Algorithm', 'DMA vs Interrupt Driven I/O']
            },
            pyqs: [
              { year: 2024, examType: 'end_sem', title: 'End Semester Exam 2024', fileUrl: 'https://www.mindflowlearn.co.in/sample-pyqs/21CS34-2024-EndSem.pdf' },
              { year: 2023, examType: 'end_sem', title: 'End Semester Exam 2023', fileUrl: 'https://www.mindflowlearn.co.in/sample-pyqs/21CS34-2023-EndSem.pdf' }
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
              notes: 'Master Master Theorem for recurrences, Divide-and-Conquer (Merge/Quick sort), Dynamic Programming (0/1 Knapsack, LCS), and Greedy strategies (Huffman Coding, Kruskal/Prim).',
              passingTips: 'Always write Pseudocode + Recurrence Relation + Complexity proof + Step-by-step trace on sample inputs.',
              highYieldTopics: ['Master Theorem Recurrences', '0/1 Knapsack & Fractional Knapsack', 'Longest Common Subsequence (LCS)', 'Kruskal and Prim MST Algorithms', 'NP-Complete vs NP-Hard definitions']
            },
            pyqs: [
              { year: 2024, examType: 'end_sem', title: 'End Semester Exam 2024', fileUrl: 'https://www.mindflowlearn.co.in/sample-pyqs/21CS42-2024-EndSem.pdf' },
              { year: 2024, examType: 'mid1', title: 'Mid-1 Assessment 2024', fileUrl: 'https://www.mindflowlearn.co.in/sample-pyqs/21CS42-2024-Mid1.pdf' },
              { year: 2023, examType: 'end_sem', title: 'End Semester Exam 2023', fileUrl: 'https://www.mindflowlearn.co.in/sample-pyqs/21CS42-2023-EndSem.pdf' }
            ]
          },
          {
            name: 'Operating Systems',
            code: '21CS44',
            slug: 'operating-systems',
            credits: 3,
            guidance: {
              notes: 'Key sections: CPU Scheduling (Round Robin, SRTF), Process Synchronization (Semaphores, Dining Philosophers), Deadlock (Banker’s Algorithm), and Virtual Memory (Page replacement algorithms: FIFO, LRU, Optimal).',
              passingTips: 'Banker’s Safety algorithm and Page replacement problems appear in every semester paper without exception.',
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
              notes: 'Focus on ER Diagrams, Relational Algebra queries, SQL joins/subqueries, Normalization (1NF, 2NF, 3NF, BCNF), and ACID transactions (Serializability, 2PL lock protocol).',
              passingTips: 'Solve functional dependency closure sets and normal form decomposition problems. Draw full ER diagrams with cardinalities.',
              highYieldTopics: ['BCNF & 3NF Lossless Join Decomposition', 'Conflict Serializability & Precedence Graphs', 'Two-Phase Locking (2PL) Protocol', 'Complex SQL Queries with Group By & Having', 'B+ Tree Insertions and Deletions']
            },
            pyqs: [
              { year: 2024, examType: 'end_sem', title: 'End Semester Exam 2024', fileUrl: 'https://www.mindflowlearn.co.in/sample-pyqs/21CS53-2024-EndSem.pdf' },
              { year: 2024, examType: 'mid1', title: 'CIA-1 Midterm 2024', fileUrl: 'https://www.mindflowlearn.co.in/sample-pyqs/21CS53-2024-Mid1.pdf' },
              { year: 2023, examType: 'end_sem', title: 'End Semester Exam 2023', fileUrl: 'https://www.mindflowlearn.co.in/sample-pyqs/21CS53-2023-EndSem.pdf' },
              { year: 2022, examType: 'end_sem', title: 'End Semester Exam 2022', fileUrl: 'https://www.mindflowlearn.co.in/sample-pyqs/21CS53-2022-EndSem.pdf' }
            ]
          },
          {
            name: 'Computer Networks',
            code: '21CS52',
            slug: 'computer-networks',
            credits: 4,
            guidance: {
              notes: 'OSI vs TCP/IP Layers, Subnetting (VLSM, CIDR), Sliding Window Protocols (Go-Back-N, Selective Repeat), Routing Algorithms (Link State, Distance Vector), and TCP Congestion Control.',
              passingTips: 'Practice IP subnet calculations and CRC error-detection polynomial division numericals.',
              highYieldTopics: ['CIDR Subnetting Calculations', 'CRC Polynomial Error Detection', 'Go-Back-N vs Selective Repeat ARQ', 'Distance Vector Routing & Count-to-Infinity Problem', 'TCP 3-Way Handshake & Congestion Window']
            },
            pyqs: [
              { year: 2024, examType: 'end_sem', title: 'End Semester Exam 2024', fileUrl: 'https://www.mindflowlearn.co.in/sample-pyqs/21CS52-2024-EndSem.pdf' },
              { year: 2023, examType: 'end_sem', title: 'End Semester Exam 2023', fileUrl: 'https://www.mindflowlearn.co.in/sample-pyqs/21CS52-2023-EndSem.pdf' }
            ]
          }
        ]
      },
      {
        number: 6,
        subjects: [
          {
            name: 'System Software and Compilers',
            code: '21CS61',
            slug: 'system-software-and-compilers',
            credits: 4,
            guidance: {
              notes: 'Phases of Compiler, Lexical Analysis, LL(1) Parsing tables, LR(0)/SLR(1) Parsing, Intermediate Code Generation (Three-Address Code), and Code Optimization (DAG representation).',
              passingTips: 'Compute First & Follow sets accurately and construct the LL(1) parse table step-by-step.',
              highYieldTopics: ['First and Follow Set Computation', 'LL(1) Parsing Table Construction', 'LR(0) Canonical Items and SLR(1) Table', 'Three-Address Code Generation (Quadruples/Triples)', 'Directed Acyclic Graph (DAG) for Basic Blocks']
            },
            pyqs: [
              { year: 2024, examType: 'end_sem', title: 'End Semester Exam 2024', fileUrl: 'https://www.mindflowlearn.co.in/sample-pyqs/21CS61-2024-EndSem.pdf' },
              { year: 2023, examType: 'end_sem', title: 'End Semester Exam 2023', fileUrl: 'https://www.mindflowlearn.co.in/sample-pyqs/21CS61-2023-EndSem.pdf' }
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
    description: 'Machine learning models, deep learning, NLP, computer vision, and cognitive systems.',
    badge: 'Trending',
    semesters: [
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
        number: 5,
        subjects: [
          {
            name: 'Data Mining and Warehousing',
            code: '21DS51',
            slug: 'data-mining-and-warehousing',
            credits: 4,
            guidance: {
              notes: 'Data Preprocessing, Star and Snowflake Schemas, Apriori Algorithm (Frequent Itemset Mining), FP-Growth, and DBSCAN Clustering.',
              passingTips: 'Apriori algorithm with candidate generation step-by-step is asked in almost every question paper.',
              highYieldTopics: ['Apriori Association Rule Generation', 'Star Schema vs Snowflake Schema Design', 'OLAP Operations (Roll-up, Drill-down, Slice, Dice)', 'DBSCAN vs K-Means Comparison']
            },
            pyqs: [
              { year: 2024, examType: 'end_sem', title: 'End Semester Exam 2024', fileUrl: 'https://www.mindflowlearn.co.in/sample-pyqs/21DS51-2024-EndSem.pdf' },
              { year: 2023, examType: 'end_sem', title: 'End Semester Exam 2023', fileUrl: 'https://www.mindflowlearn.co.in/sample-pyqs/21DS51-2023-EndSem.pdf' }
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
    description: 'Network security, applied cryptography, ethical hacking, forensics, and vulnerability assessment.',
    badge: 'High Demand',
    semesters: [
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
    description: 'Enterprise information systems, full-stack cloud computing, and software development.',
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
    description: 'Signal processing, VLSI design, wireless communication, RF systems, and microelectronics.',
    badge: 'Core',
    semesters: [
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
    description: 'Thermodynamics, fluid mechanics, CAD/CAM manufacturing, and robotics.',
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
    description: 'Aerodynamics, propulsion systems, flight mechanics, and space vehicle structures.',
    badge: 'Specialized',
    semesters: [
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
          }
        ]
      }
    ]
  }
];

/**
 * Helper to look up a branch by slug
 */
export const getBranchBySlug = (slug) => DSU_BRANCHES.find((b) => b.slug === slug) || null;

/**
 * Helper to look up a semester
 */
export const getSemester = (branchSlug, semesterNum) => {
  const branch = getBranchBySlug(branchSlug);
  if (!branch) return null;
  const num = parseInt(semesterNum, 10);
  const semester = branch.semesters.find((s) => s.number === num);
  return semester ? { ...semester, branch } : null;
};

/**
 * Helper to look up a subject
 */
export const getSubject = (branchSlug, semesterNum, subjectCodeOrSlug) => {
  const semester = getSemester(branchSlug, semesterNum);
  if (!semester) return null;
  const target = (subjectCodeOrSlug || '').toLowerCase();
  const subject = semester.subjects.find(
    (s) => s.code.toLowerCase() === target || s.slug.toLowerCase() === target
  );
  return subject ? { ...subject, semester, branch: semester.branch } : null;
};

/**
 * Helper to search all subjects across all branches
 */
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
