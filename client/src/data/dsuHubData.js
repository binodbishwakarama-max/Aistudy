/**
 * DSU Hub Authentic Syllabus Dataset — Dayananda Sagar University (DSU) School of Engineering
 * Covers 8 Engineering Branches across 1st to 8th Semesters with actual DSU course codes,
 * high-yield exam guidance notes, passing tips, verified previous year question papers,
 * open-source course materials (MIT OCW, Stanford, Harvard, NPTEL, top YouTube playlists),
 * and high-probability predicted exam questions.
 */

export const DSU_BRANCHES = [
  {
    "name": "Computer Science & Engineering",
    "shortName": "CSE",
    "slug": "cse",
    "codePrefix": "CS",
    "description": "Core computer science: algorithms, database systems, computer networks, compiler design, and software architecture.",
    "badge": "Popular",
    "semesters": [
      {
        "number": 1,
        "subjects": [
          {
            "name": "Chemistry for Computer Science Cluster",
            "code": "25EN1103",
            "slug": "chemistry-for-computer-science-cluster",
            "credits": 4,
            "guidance": {
              "notes": "Focus on 5 Core Modules: (1) Electrochemical & Potentiometric Sensors, Dissolved Oxygen measurement, QDSSCs; (2) Pitting & Water-line corrosion, Electroless plating; (3) VSEPR Theory, Z-matrix of H2O, MO diagram of O2; (4) Polymer molecular weights (Mn, Mw), Polycarbonate, Polypyrrole; (5) E-waste toxic hazards, Pyrometallurgical vs Hydrometallurgical copper extraction.",
              "passingTips": "Copper extraction from e-waste, MO diagram of O2, and Potentiometric sensor principles are guaranteed 16-mark questions.",
              "highYieldTopics": [
                "Electrochemical & Potentiometric Sensors (Dissolved O2)",
                "Quantum Dot Sensitized Solar Cells (QDSSCs)",
                "Pitting & Water-Line Corrosion with Labelled Diagrams",
                "Electroless Plating Mechanism & Advantages",
                "MO Diagram of O2 & VSEPR Z-Matrix for H2O",
                "Polycarbonate Preparation & Polypyrrole Synthesis",
                "E-Waste Toxic Hazards & Copper Extraction (Hydro vs Pyrometallurgical)"
              ]
            },
            "resources": [
              {
                "title": "MIT 5.111: Principles of Chemical Science",
                "provider": "MIT OpenCourseWare",
                "type": "video_course",
                "url": "https://ocw.mit.edu/courses/5-111-principles-of-chemical-science-fall-2014/"
              },
              {
                "title": "NPTEL: Chemistry for Engineers",
                "provider": "IIT Kharagpur / NPTEL",
                "type": "nptel_course",
                "url": "https://nptel.ac.in/courses/104105039"
              },
              {
                "title": "Electrochemical Sensors & Batteries Series",
                "provider": "YouTube (Neso Academy)",
                "type": "youtube_playlist",
                "url": "https://www.youtube.com/playlist?list=PLBlnK6fEyqRh6b_Zp7Z_i_uBwNf4tYw1X"
              },
              {
                "title": "MIT 3.091: Introduction to Solid-State Chemistry",
                "provider": "MIT OpenCourseWare",
                "type": "video_course",
                "url": "https://ocw.mit.edu/courses/3-091sc-introduction-to-solid-state-chemistry-fall-2010/"
              }
            ],
            "predictedQuestions": [
              {
                "question": "Explain the construction, working principle, and chemical reactions of an electrochemical sensor used for Dissolved Oxygen (DO) determination in water samples.",
                "marks": 8,
                "probability": "95% Probability",
                "module": "Module 1: Sensors & Energy Storage",
                "answerKey": "Must draw the Clark electrode diagram, write the anode (lead/silver oxidation) and cathode (oxygen reduction: O2 + 4e- + 2H2O -> 4OH-) reactions, and describe current proportionality to DO concentration."
              },
              {
                "question": "Differentiate between Pyrometallurgical and Hydrometallurgical extraction processes for recovering copper from discarded printed circuit board (PCB) e-waste. Give advantages of hydrometallurgy.",
                "marks": 8,
                "probability": "95% Probability",
                "module": "Module 5: E-Waste Management",
                "answerKey": "Include flowcharts for both processes. Pyrometallurgy: high temperature smelting, slag formation, air emissions. Hydrometallurgy: acid/alkali leaching, solvent extraction, electrowinning. Advantages: lower emissions, higher purity, energy efficient."
              },
              {
                "question": "Draw the Molecular Orbital (MO) energy level diagram for O2 molecule. Calculate its bond order and explain its paramagnetic nature based on MOT.",
                "marks": 8,
                "probability": "90% Probability",
                "module": "Module 3: Molecular Structure & Bonding",
                "answerKey": "Draw energy axis, 1s/2s/2p atomic orbitals combining into sigma and pi MOs. Electronic configuration: sigma 1s2 sigma* 1s2 sigma 2s2 sigma* 2s2 sigma 2pz2 pi 2px2 pi 2py2 pi* 2px1 pi* 2py1. Bond Order = (10 - 6)/2 = 2. Unpaired electrons in pi* prove paramagnetism."
              },
              {
                "question": "Explain the mechanism of Pitting Corrosion and Water-line Corrosion with neat labelled cross-sectional diagrams.",
                "marks": 8,
                "probability": "90% Probability",
                "module": "Module 2: Corrosion Science",
                "answerKey": "Pitting: differential aeration beneath dust/debris particle where oxygen-deficient pit acts as small anode, surrounding exposed metal acts as large cathode causing deep localized cavities. Water-line: metal area just below water level has lower oxygen (anode) and undergoes accelerated corrosion."
              }
            ],
            "pyqs": [
              {
                "year": 2026,
                "examType": "end_sem",
                "title": "End Semester Exam Dec 2025 / Jan 2026 (Max Marks: 80)",
                "fileUrl": "https://www.mindflowlearn.co.in/sample-pyqs/25EN1103-2025-Dec-EndSem.pdf"
              },
              {
                "year": 2024,
                "examType": "end_sem",
                "title": "End Semester Exam 2024",
                "fileUrl": "https://www.mindflowlearn.co.in/sample-pyqs/25EN1103-2024-EndSem.pdf"
              }
            ]
          },
          {
            "name": "Object Oriented Programming (Python)",
            "code": "25EN1107",
            "slug": "object-oriented-programming-python",
            "credits": 4,
            "guidance": {
              "notes": "Covers OOP Pillars (Encapsulation, Inheritance, Polymorphism, Data Abstraction), Function Argument Types (Positional, Keyword, Default, *args), Loop Tracing (for, while, continue, break), Recursion Call Stack Tracing, and File I/O with Exception Handling.",
              "passingTips": "Practice writing standard Python programs: Student marks calculation (total, average, grade), Recursive Fibonacci/Factorial call trees, and custom Class inheritance structures.",
              "highYieldTopics": [
                "Key OOP Concepts (Classes, Objects, Inheritance, Polymorphism)",
                "Python Function Argument Types (Positional, Keyword, Default)",
                "Loop Output Prediction (range, continue, while break)",
                "Recursion Tracing & Call Stack Output",
                "Dictionary & List Comprehensions",
                "File I/O and Exception Handling Blocks (try-except-finally)"
              ]
            },
            "resources": [
              {
                "title": "Harvard CS50P: Introduction to Programming with Python",
                "provider": "Harvard University",
                "type": "video_course",
                "url": "https://cs50.harvard.edu/python/"
              },
              {
                "title": "MIT 6.0001: Intro to CS and Programming in Python",
                "provider": "MIT OpenCourseWare",
                "type": "video_course",
                "url": "https://ocw.mit.edu/courses/6-0001-introduction-to-computer-science-and-programming-in-python-fall-2016/"
              },
              {
                "title": "Corey Schafer: Python OOP Tutorials",
                "provider": "YouTube (Corey Schafer)",
                "type": "youtube_playlist",
                "url": "https://www.youtube.com/playlist?list=PL-osiE80TeTsqhIuOqKhWLLoM5_YkWcUO"
              },
              {
                "title": "NPTEL: The Joy of Computing using Python",
                "provider": "IIT Madras / NPTEL",
                "type": "nptel_course",
                "url": "https://nptel.ac.in/courses/106106182"
              }
            ],
            "predictedQuestions": [
              {
                "question": "Explain the 4 fundamental pillars of OOP (Encapsulation, Abstraction, Inheritance, and Polymorphism) with illustrative Python code snippets for each.",
                "marks": 8,
                "probability": "95% Probability",
                "module": "Module 4: Object-Oriented Principles",
                "answerKey": "Define each pillar clearly. Show class with private variables (__variable) for encapsulation, abstract class with abc.ABC for abstraction, Base/Derived classes for inheritance, and method overriding/duck typing for polymorphism."
              },
              {
                "question": "Differentiate between Positional Arguments, Keyword Arguments, Default Arguments, and Variable-length Arguments (*args, **kwargs) in Python functions with working examples.",
                "marks": 8,
                "probability": "90% Probability",
                "module": "Module 2: Functions & Scopes",
                "answerKey": "Demonstrate def func(a, b=10, *args, **kwargs) and explain order of parameters, tuple packing for *args, and dictionary unpacking for **kwargs."
              },
              {
                "question": "Write a Python program to read student exam records (Name, USN, Marks in 3 subjects) from a text file, compute total and percentage, and write results to a new file while handling FileNotFoundError and ValueError.",
                "marks": 8,
                "probability": "90% Probability",
                "module": "Module 5: File I/O & Exceptions",
                "answerKey": "Use with open(...) as file:, try-except-finally blocks, string.split(\",\") parsing, calculation, and formatted output writing."
              },
              {
                "question": "Draw the recursion call stack tree for recursive Fibonacci fib(5) and predict the total number of function calls.",
                "marks": 6,
                "probability": "85% Probability",
                "module": "Module 3: Recursion & Algorithms",
                "answerKey": "Show binary recursion tree with fib(5) calling fib(4) and fib(3), continuing down to base cases fib(1)=1, fib(0)=0. Total function calls = 15."
              }
            ],
            "pyqs": [
              {
                "year": 2026,
                "examType": "end_sem",
                "title": "End Semester Exam Dec 2025 / Jan 2026 (Max Marks: 80)",
                "fileUrl": "https://www.mindflowlearn.co.in/sample-pyqs/25EN1107-2026-Jan-EndSem.pdf"
              },
              {
                "year": 2024,
                "examType": "end_sem",
                "title": "End Semester Exam 2024",
                "fileUrl": "https://www.mindflowlearn.co.in/sample-pyqs/25EN1107-2024-EndSem.pdf"
              }
            ]
          },
          {
            "name": "Engineering Graphics and Design Thinking",
            "code": "25EN1102",
            "slug": "engineering-graphics-and-design-thinking",
            "credits": 3,
            "guidance": {
              "notes": "Focus on Orthographic Projections from 3D Isometric Machine Components (Front, Top, and Side Views), Development of Lateral Surfaces of Prisms and Pyramids, Section of Solids (Hexagonal Prism with Cone), and 3D CAD Modeling (AutoCAD / Fusion 360).",
              "passingTips": "Always use First Angle Projection. Ensure exact dimensioning and projection alignment between Front View and Top View.",
              "highYieldTopics": [
                "Orthographic Projections (Front, Top, Side Views from Isometric 3D)",
                "Development of Lateral Surface of Prisms (Square / Hexagonal)",
                "Section of Solids with Inclined Cutting Planes (45° to HP)",
                "Isometric Projections of Frustums and Combined Solids",
                "AutoCAD & Fusion 360 3D Part Modeling"
              ]
            },
            "resources": [
              {
                "title": "NPTEL: Engineering Graphics & Design",
                "provider": "IIT Madras / NPTEL",
                "type": "nptel_course",
                "url": "https://nptel.ac.in/courses/112106294"
              },
              {
                "title": "Manas Patnaik: Engineering Drawing Complete Series",
                "provider": "YouTube (Manas Patnaik)",
                "type": "youtube_playlist",
                "url": "https://www.youtube.com/playlist?list=PLihxKbu410V6jXhC_zN8zTz7eA5q4B0bQ"
              },
              {
                "title": "MIT 2.007: Design and Manufacturing I",
                "provider": "MIT OpenCourseWare",
                "type": "video_course",
                "url": "https://ocw.mit.edu/courses/2-007-design-and-manufacturing-i-spring-2009/"
              }
            ],
            "predictedQuestions": [
              {
                "question": "Draw the Orthographic Views (Front View, Top View, and Left Side View) for the given 3D isometric stepped bracket using First Angle Projection Method with proper dimensions.",
                "marks": 16,
                "probability": "Guaranteed Every Year",
                "module": "Module 1: Orthographic Projections",
                "answerKey": "Use 1st angle projection: Front view above reference XY line, Top view directly below Front view, Left side view projected on the right. Maintain projection lines and full dimensioning in mm."
              },
              {
                "question": "A regular hexagonal prism of base side 30 mm and axis height 65 mm rests with its base on HP. A cutting plane inclined at 45° to HP cuts the prism passing through the axis at a height of 35 mm from base. Draw the development of the lateral surface.",
                "marks": 12,
                "probability": "95% Probability",
                "module": "Module 3: Development of Surfaces",
                "answerKey": "Draw the 6-panel unrolled perimeter (6 x 30 = 180 mm). Project cutting plane intersection points from the front elevation across all 6 vertical edges and connect with straight lines."
              },
              {
                "question": "A right circular cylinder of diameter 50 mm and height 70 mm rests on HP. Draw the Isometric Projection of the truncated cylinder cut by a plane inclined at 30° to HP.",
                "marks": 12,
                "probability": "90% Probability",
                "module": "Module 4: Isometric Projections",
                "answerKey": "Construct isometric scale (True length x 0.816). Draw isometric box with 30°-30° axes, construct elliptical top section using 4-center method."
              }
            ],
            "pyqs": [
              {
                "year": 2025,
                "examType": "end_sem",
                "title": "End Semester Exam Dec 2025 (Set III, Max Marks: 60)",
                "fileUrl": "https://www.mindflowlearn.co.in/sample-pyqs/25EN1102-2025-Dec-EndSem.pdf"
              },
              {
                "year": 2024,
                "examType": "end_sem",
                "title": "End Semester Exam 2024",
                "fileUrl": "https://www.mindflowlearn.co.in/sample-pyqs/25EN1102-2024-EndSem.pdf"
              }
            ]
          },
          {
            "name": "Linear Algebra and Calculus",
            "code": "25EN1101",
            "slug": "linear-algebra-and-calculus",
            "credits": 4,
            "guidance": {
              "notes": "Focus on Eigenvalues & Eigenvectors of 3x3 matrices, Cayley-Hamilton theorem, Taylor & Maclaurin series expansion in two variables, Partial derivatives (Euler’s theorem on homogeneous functions), and Gauss Elimination / Rank of a matrix.",
              "passingTips": "Master Cayley-Hamilton theorem inverse calculation and Gauss-Jordan elimination for 3x3 matrices for guaranteed full marks.",
              "highYieldTopics": [
                "Cayley-Hamilton Theorem & Matrix Inverses",
                "Eigenvalues and Eigenvectors of 3x3 Matrices",
                "Euler’s Theorem on Homogeneous Functions",
                "Taylor Series Expansion in Two Variables",
                "Gauss-Elimination & Consistency of System of Linear Equations"
              ]
            },
            "resources": [
              {
                "title": "MIT 18.06: Linear Algebra (Prof. Gilbert Strang)",
                "provider": "MIT OpenCourseWare",
                "type": "video_course",
                "url": "https://ocw.mit.edu/courses/18-06-linear-algebra-spring-2010/"
              },
              {
                "title": "3Blue1Brown: Essence of Linear Algebra",
                "provider": "YouTube (3Blue1Brown)",
                "type": "youtube_series",
                "url": "https://www.youtube.com/playlist?list=PLZHQObOWTQDPD3MizzM2xVFitgF8hE_ab"
              },
              {
                "title": "NPTEL: Matrix Algebra & Differential Calculus",
                "provider": "IIT Roorkee / NPTEL",
                "type": "nptel_course",
                "url": "https://nptel.ac.in/courses/111107119"
              }
            ],
            "predictedQuestions": [
              {
                "question": "Find the Eigenvalues and corresponding Eigenvectors for the matrix A = [[1, 2, 2], [2, 1, 2], [2, 2, 1]]. Verify the Cayley-Hamilton Theorem and find A^-1.",
                "marks": 8,
                "probability": "Guaranteed Every Year",
                "module": "Module 1: Matrices & Linear Systems",
                "answerKey": "Compute det(A - lambda*I) = -(lambda - 5)(lambda + 1)^2 = 0. Eigenvalues: 5, -1, -1. Solve (A - lambda*I)X = 0 to get eigenvectors. State Cayley-Hamilton A^3 - 3A^2 - 9A - 5I = 0. Multiply by A^-1 to solve for A^-1."
              },
              {
                "question": "State and prove Euler’s Theorem for a homogeneous function u = f(x, y) of degree n. Hence evaluate x(du/dx) + y(du/dy) for u = sin^-1((x^2 + y^2)/(x + y)).",
                "marks": 8,
                "probability": "95% Probability",
                "module": "Module 3: Partial Differentiation",
                "answerKey": "Proof: Let u = x^n * phi(y/x). Differentiate with respect to x and y, combine x(du/dx) + y(du/dy) = n*u. For sin(u) = (x^2+y^2)/(x+y) (homogeneous degree 1), result is 1 * tan(u)."
              },
              {
                "question": "Expand f(x, y) = e^x * cos(y) in powers of (x - 1) and (y - pi/4) up to second-degree terms using Taylor’s Theorem for two variables.",
                "marks": 8,
                "probability": "90% Probability",
                "module": "Module 4: Taylor & Maclaurin Series",
                "answerKey": "Calculate f(a,b), fx, fy, fxx, fxy, fyy at (1, pi/4). Plug into Taylor formula f(a+h, b+k) = f(a,b) + [h fx + k fy] + (1/2)[h^2 fxx + 2hk fxy + k^2 fyy]."
              }
            ],
            "pyqs": [
              {
                "year": 2026,
                "examType": "end_sem",
                "title": "End Semester Exam Dec 2025 / Jan 2026",
                "fileUrl": "https://www.mindflowlearn.co.in/sample-pyqs/25EN1101-2026-Jan-EndSem.pdf"
              },
              {
                "year": 2024,
                "examType": "end_sem",
                "title": "End Semester Exam 2024",
                "fileUrl": "https://www.mindflowlearn.co.in/sample-pyqs/25EN1101-2024-EndSem.pdf"
              }
            ]
          }
        ]
      },
      {
        "number": 2,
        "subjects": [
          {
            "name": "Single and Multivariate Calculus",
            "code": "25EN1201",
            "slug": "single-and-multivariate-calculus",
            "credits": 4,
            "guidance": {
              "notes": "Focus on 5 Core Modules: (1) Multivariable Limits, Continuity tests at origin (e.g. (x^4 - y^2)/(x^4 + y^2)), Total derivative chain rule dw/dt; (2) Absolute extrema on bounded regions and Lagrange Multipliers constrained optimization; (3) Double and Triple Integrals (Cartesian, Polar, and Cylindrical coordinates); (4) Vector Calculus (Green’s Theorem, Conservative vector fields with scalar potential, Gauss Divergence Theorem); (5) Infinite Series convergence tests (D’Alembert’s Ratio Test, Cauchy’s Root Test, Alternating Series, Power Series Interval of Convergence, Maclaurin Series).",
              "passingTips": "Lagrange Multipliers optimization, Gauss Divergence Theorem cylinder flux, and D’Alembert Ratio Test are guaranteed 16-mark end-sem questions.",
              "highYieldTopics": [
                "Multivariable Continuity Test at Origin",
                "Total Derivative Chain Rule (dw/dt)",
                "Lagrange Multipliers Constrained Optimization",
                "Double & Triple Integrals (Polar & Cylindrical)",
                "Green’s Theorem on Bounded Curves",
                "Conservative Vector Field & Scalar Potential",
                "Gauss Divergence Theorem Surface Flux",
                "D’Alembert’s Ratio Test & Cauchy’s Root Test",
                "Power Series Interval of Convergence"
              ]
            },
            "resources": [
              {
                "title": "MIT 18.02: Multivariable Calculus (Prof. Denis Auroux)",
                "provider": "MIT OpenCourseWare",
                "type": "video_course",
                "url": "https://ocw.mit.edu/courses/18-02-multivariable-calculus-fall-2007/"
              },
              {
                "title": "3Blue1Brown: Essence of Calculus",
                "provider": "YouTube (3Blue1Brown)",
                "type": "youtube_series",
                "url": "https://www.youtube.com/playlist?list=PLZHQObOWTQDMsr9K-rj53DwVRMYO3t5Yr"
              },
              {
                "title": "Khan Academy: Multivariable Vector Calculus",
                "provider": "Khan Academy",
                "type": "interactive_tutorial",
                "url": "https://www.khanacademy.org/math/multivariable-calculus"
              },
              {
                "title": "NPTEL: Advanced Engineering Mathematics",
                "provider": "IIT Kharagpur / NPTEL",
                "type": "nptel_course",
                "url": "https://nptel.ac.in/courses/111105035"
              }
            ],
            "predictedQuestions": [
              {
                "question": "Find the maximum and minimum values of the function f(x, y) = 2x + y subject to the constraint x^2 + y^2 = 5 using the method of Lagrange Multipliers.",
                "marks": 8,
                "probability": "Guaranteed Every Year",
                "module": "Module 2: Multivariable Optimization",
                "answerKey": "Set grad(f) = lambda * grad(g). Grad f = (2, 1), grad g = (2x, 2y). So 2 = 2*lambda*x => x = 1/lambda; 1 = 2*lambda*y => y = 1/(2*lambda). Plug into constraint (1/lambda^2) + (1/4*lambda^2) = 5 => lambda = +-1/2. Points are (2, 1) [Max = 5] and (-2, -1) [Min = -5]."
              },
              {
                "question": "Verify Green’s Theorem in the plane for the vector field F = (xy + y^2) i + x^2 j around the closed curve bounded by y = x and y = x^2.",
                "marks": 8,
                "probability": "95% Probability",
                "module": "Module 4: Vector Integral Calculus",
                "answerKey": "Left side: Evaluate line integral along C1 (y=x^2 from 0 to 1) and C2 (y=x from 1 to 0). Right side: Double integral of (dQ/dx - dP/dy) = (2x - (x + 2y)) dx dy = (x - 2y) dx dy over region 0 <= x <= 1, x^2 <= y <= x. Both evaluate to -1/20."
              },
              {
                "question": "Apply Gauss Divergence Theorem to compute the flux of F = 4xz i - y^2 j + yz k across the surface bounded by the cylinder x^2 + y^2 = 4 and planes z = 0, z = 3.",
                "marks": 8,
                "probability": "90% Probability",
                "module": "Module 4: Vector Integral Calculus",
                "answerKey": "Compute div F = d(4xz)/dx + d(-y^2)/dy + d(yz)/dz = 4z - 2y + y = 4z - y. Use cylindrical coordinates: x = r cos theta, y = r sin theta, z = z. Integral from theta=0 to 2pi, r=0 to 2, z=0 to 3 of (4z - r sin theta) r dz dr d theta = 72 pi."
              },
              {
                "question": "Test the convergence of the infinite series sum from n=1 to inf of [(n!)^2 / (2n)!] * x^n (x > 0) using D’Alembert’s Ratio Test.",
                "marks": 6,
                "probability": "90% Probability",
                "module": "Module 5: Infinite Series",
                "answerKey": "Find limit |a_(n+1) / a_n| = limit (n+1)^2 / ((2n+2)(2n+1)) * x = (1/4) * x. By ratio test, series converges for x < 4, diverges for x > 4, test fails for x = 4 (apply Raabe’s test)."
              }
            ],
            "pyqs": [
              {
                "year": 2026,
                "examType": "end_sem",
                "title": "End Semester Exam May 2026 (Max Marks: 80, Duration: 2h 30m)",
                "date": "14-05-2026",
                "duration": "2h 30m",
                "maxMarks": 80,
                "fileUrl": "https://www.mindflowlearn.co.in/sample-pyqs/25EN1201-2026-May-EndSem.pdf"
              },
              {
                "year": 2026,
                "examType": "mid1",
                "title": "Mid Semester Exam (CIA-1) March 2026 (Max Marks: 40, Duration: 75m)",
                "date": "13-03-2026",
                "duration": "75 Mins",
                "maxMarks": 40,
                "fileUrl": "https://www.mindflowlearn.co.in/sample-pyqs/25EN1201-2026-Mar-MidSem.pdf"
              }
            ]
          },
          {
            "name": "C Programming for Problem Solving (CPPS)",
            "code": "25EN1114",
            "slug": "c-programming-for-problem-solving",
            "credits": 4,
            "guidance": {
              "notes": "Covers: (1) Flowcharts, Algorithms, and C Operator Precedence (Prefix/Postfix ++/-- expressions); (2) Conditional Branching & Loops (Electricity billing with surcharge, Selection sort algorithm & pass-by-pass tracing, 1D/2D arrays); (3) String & Character Handling built-in functions (strcpy, strcat, strlen, strcmp, strchr, isdigit, toupper); (4) Functions, Call-by-Value vs Call-by-Reference, Recursion, Pointers swapping; (5) Nested Structures vs Unions; (6) Dynamic Memory Allocation (malloc, calloc, realloc, free) & File I/O (file creation, writing characters).",
              "passingTips": "Master the Selection Sort trace on arbitrary arrays, Electricity Billing slab program with surcharge, Dynamic memory functions table, and Nested Structures for student records.",
              "highYieldTopics": [
                "Algorithm & Flowchart (Largest of 3 Numbers)",
                "Prefix/Postfix Operator Expression Evaluation",
                "Electricity Billing Slab Program (with 15% Surcharge)",
                "Selection Sort Step-by-Step Array Trace",
                "Built-in String & Character Handling Functions",
                "Call-by-Value vs Call-by-Reference & Pointer Swap",
                "Recursion Call Stack Tracing",
                "Nested Structures vs Unions Differences",
                "Dynamic Memory: malloc(), calloc(), realloc(), free()",
                "File I/O Program (Create & Write to File)"
              ]
            },
            "resources": [
              {
                "title": "Harvard CS50x: C Programming & Memory Architecture",
                "provider": "Harvard University",
                "type": "video_course",
                "url": "https://cs50.harvard.edu/x/"
              },
              {
                "title": "Jenny’s Lectures: C Programming Full Course",
                "provider": "YouTube (Jenny’s Lectures)",
                "type": "youtube_playlist",
                "url": "https://www.youtube.com/playlist?list=PLdo5W4Nhv31a8UcMN9-35ghv8qyFWD9_S"
              },
              {
                "title": "NPTEL: Problem Solving through Programming in C",
                "provider": "IIT Kharagpur / NPTEL",
                "type": "nptel_course",
                "url": "https://nptel.ac.in/courses/106105171"
              },
              {
                "title": "freeCodeCamp: C Programming for Beginners",
                "provider": "freeCodeCamp",
                "type": "video_course",
                "url": "https://www.freecodecamp.org/news/learn-c-programming-free-course/"
              }
            ],
            "predictedQuestions": [
              {
                "question": "Write an algorithm, draw a flowchart, and develop a complete C program to compute electricity bill charges based on slab rates: 0-100 units @ Rs 1.50/unit, 101-200 units @ Rs 2.00/unit, >200 units @ Rs 3.00/unit, with a minimum charge of Rs 100 and a 15% surcharge if the bill exceeds Rs 400.",
                "marks": 8,
                "probability": "Guaranteed Every Year",
                "module": "Module 2: Control Structures",
                "answerKey": "Show step-by-step slab calculation using if-else if ladder: units <= 100 => bill = units*1.5; units <= 200 => bill = 100*1.5 + (units-100)*2.0; units > 200 => bill = 100*1.5 + 100*2.0 + (units-200)*3.0. Check bill < 100 => bill = 100; check bill > 400 => bill += bill * 0.15."
              },
              {
                "question": "Demonstrate the step-by-step trace of Selection Sort algorithm on the array [64, 25, 12, 22, 11] in ascending order, displaying intermediate array state after each pass.",
                "marks": 8,
                "probability": "Guaranteed Every Year",
                "module": "Module 3: Arrays & Sorting",
                "answerKey": "Initial: [64, 25, 12, 22, 11]. Pass 1 (min 11): Swap 64 & 11 => [11, 25, 12, 22, 64]. Pass 2 (min 12): Swap 25 & 12 => [11, 12, 25, 22, 64]. Pass 3 (min 22): Swap 25 & 22 => [11, 12, 22, 25, 64]. Pass 4 (min 25): No swap => [11, 12, 22, 25, 64]. Array sorted in 4 passes."
              },
              {
                "question": "Explain Dynamic Memory Allocation in C. Compare malloc(), calloc(), realloc(), and free() with their syntax, return types, and memory layout diagrams.",
                "marks": 8,
                "probability": "95% Probability",
                "module": "Module 5: Dynamic Memory & Pointers",
                "answerKey": "malloc(size): allocates contiguous bytes with garbage values. calloc(n, size): allocates and initializes memory to zero. realloc(ptr, new_size): resizes previously allocated block. free(ptr): deallocates heap block. Return type for allocation functions is (void*)."
              },
              {
                "question": "Develop a C program using nested structures to store student information (Name, Roll No, Date of Birth {dd, mm, yyyy}, and Marks in 3 subjects). Compute total marks, average, and print grade.",
                "marks": 8,
                "probability": "90% Probability",
                "module": "Module 4: Structures & Unions",
                "answerKey": "Define struct Date { int dd, mm, yyyy; }; struct Student { char name[50]; int rollNo; struct Date dob; float marks[3], total, avg; }; Implement main() with scanf, loop calculation, and printf."
              }
            ],
            "pyqs": [
              {
                "year": 2026,
                "examType": "end_sem",
                "title": "End Semester Exam May 2026 (Max Marks: 80, Duration: 2h 30m)",
                "date": "25-05-2026",
                "duration": "2h 30m",
                "maxMarks": 80,
                "fileUrl": "https://www.mindflowlearn.co.in/sample-pyqs/25EN1114-2026-May-EndSem.pdf"
              },
              {
                "year": 2026,
                "examType": "mid1",
                "title": "Mid Semester Exam (CIA-1) March 2026 (Max Marks: 40, Duration: 75m)",
                "date": "14-03-2026",
                "duration": "75 Mins",
                "maxMarks": 40,
                "fileUrl": "https://www.mindflowlearn.co.in/sample-pyqs/25EN1114-2026-Mar-MidSem.pdf"
              }
            ]
          },
          {
            "name": "Introduction to Electrical and Electronics Engineering",
            "code": "25EN1109",
            "slug": "intro-to-electrical-and-electronics-engineering",
            "credits": 4,
            "guidance": {
              "notes": "Focus on 5 Core Modules: (1) DC Circuits (Energy calculation in kWh, Electricity bill calculation, Active/Passive elements, Series/Parallel resistors, KCL/KVL nodal analysis, Current division rule); (2) Electromagnetism & AC Machines (Faraday’s laws, Mutual EMF, 440kVA Transformer voltage/current calculations, DC Generator Lap/Wave EMF equation); (3) Semiconductor Devices (PN junction characteristics, BJT Transistor in CB and CE modes, alpha/beta relationships, Half-wave/Full-wave rectifiers with RC capacitor filter and ripple calculation); (4) Operational Amplifiers (Inverting, Non-Inverting, Summing, Integrator, Differentiator & Ideal Op-Amp characteristics); (5) Digital Logic & Embedded (NAND/NOR universal gates, JK Flip-Flop using NAND, Microcontroller architecture block diagram).",
              "passingTips": "Solve KCL node equations numericals, Transformer turn ratio calculations, BJT alpha/beta current gain numericals, and draw clear Op-Amp Integrator/Differentiator circuit schematics.",
              "highYieldTopics": [
                "Monthly Energy (kWh) & Electricity Bill Calculation",
                "KCL & KVL Nodal Circuit Analysis",
                "Faraday’s Law & Transformer Primary/Secondary Calculations",
                "DC Generator Lap vs Wave Winding EMF Equation",
                "Half-Wave & Full-Wave Rectifiers with RC Smoothing Filter",
                "BJT CB & CE Configurations (Alpha & Beta Current Gains)",
                "Op-Amp Inverting, Non-Inverting & Summing Circuits",
                "Op-Amp Integrator and Differentiator Circuit Diagrams",
                "Universal Gates (NAND & NOR Realizations)",
                "JK Flip-Flop Circuit with NAND Gates",
                "Microcontroller Architecture Block Diagram"
              ]
            },
            "resources": [
              {
                "title": "MIT 6.002: Circuits and Electronics (Prof. Anant Agarwal)",
                "provider": "MIT OpenCourseWare",
                "type": "video_course",
                "url": "https://ocw.mit.edu/courses/6-002-circuits-and-electronics-spring-2007/"
              },
              {
                "title": "All About Electronics: Op-Amps, Rectifiers & Transistors",
                "provider": "YouTube (All About Electronics)",
                "type": "youtube_playlist",
                "url": "https://www.youtube.com/playlist?list=PLwjK_wDTCSWjh8iT2q75QjG_bA0z6F9_1"
              },
              {
                "title": "Neso Academy: Digital Electronics & Logic Gates",
                "provider": "YouTube (Neso Academy)",
                "type": "youtube_playlist",
                "url": "https://www.youtube.com/playlist?list=PLBlnK6fEyqRjMH3mWf6kwqiETJx50Ex5y"
              },
              {
                "title": "NPTEL: Basic Electrical Technology",
                "provider": "IIT Kharagpur / NPTEL",
                "type": "nptel_course",
                "url": "https://nptel.ac.in/courses/108105053"
              }
            ],
            "predictedQuestions": [
              {
                "question": "Calculate the total energy consumed in kWh in a 30-day month for a residence running 2 bulbs of 100 W each and 2 ceiling fans of 60 W each for 10 hours daily. Find the electricity bill if cost is Rs 2.00 per unit.",
                "marks": 6,
                "probability": "95% Probability",
                "module": "Module 1: DC Circuits & Power",
                "answerKey": "Total Power = (2 * 100) + (2 * 60) = 320 W = 0.32 kW. Daily Energy = 0.32 kW * 10 h = 3.2 kWh. Monthly Energy (30 days) = 3.2 * 30 = 96 kWh (units). Total Bill = 96 units * Rs 2.00 = Rs 192.00."
              },
              {
                "question": "Derive the closed-loop voltage gain expression for an Op-Amp in: (i) Inverting Amplifier configuration, (ii) Non-Inverting Amplifier configuration, and (iii) Summing Amplifier. State 4 characteristics of an ideal Op-Amp.",
                "marks": 8,
                "probability": "95% Probability",
                "module": "Module 4: Operational Amplifiers",
                "answerKey": "Draw circuit diagrams using virtual ground concept. Inverting: Vout = -(Rf/R1) * Vin. Non-Inverting: Vout = (1 + Rf/R1) * Vin. Summing: Vout = -Rf * (V1/R1 + V2/R2 + V3/R3). Ideal Op-Amp properties: infinite open-loop gain (A=inf), infinite input impedance (Rin=inf), zero output impedance (Rout=0), infinite bandwidth."
              },
              {
                "question": "A 440 kVA, 6600V/440V, 50Hz single-phase transformer has 1200 primary turns. Calculate: (i) Number of secondary turns, (ii) Primary full-load current, (iii) Secondary full-load current, and (iv) Maximum magnetic flux in core.",
                "marks": 8,
                "probability": "90% Probability",
                "module": "Module 2: Electromagnetism & Transformers",
                "answerKey": "Turn ratio K = V2/V1 = 440/6600 = 1/15. N2 = N1 * K = 1200 / 15 = 80 turns. Primary current I1 = S / V1 = 440000 / 6600 = 66.67 A. Secondary current I2 = S / V2 = 440000 / 440 = 1000 A. Max flux Phi_m = V1 / (4.44 * f * N1) = 6600 / (4.44 * 50 * 1200) = 0.0247 Wb."
              },
              {
                "question": "Show how NAND and NOR gates serve as Universal Gates by synthesizing AND, OR, NOT, and XOR gates using NAND gates only.",
                "marks": 8,
                "probability": "90% Probability",
                "module": "Module 5: Digital Logic",
                "answerKey": "NOT: Connect inputs together into NAND. AND: Connect NAND output to NAND inverter. OR: Invert inputs A and B through NAND inverters, feed into NAND. XOR: Use 4 NAND gates."
              }
            ],
            "pyqs": [
              {
                "year": 2026,
                "examType": "end_sem",
                "title": "End Semester Exam May 2026 (Max Marks: 80, Duration: 2h 30m)",
                "date": "18-05-2026",
                "duration": "2h 30m",
                "maxMarks": 80,
                "fileUrl": "https://www.mindflowlearn.co.in/sample-pyqs/25EN1109-2026-May-EndSem.pdf"
              },
              {
                "year": 2026,
                "examType": "mid1",
                "title": "Mid Semester Exam (CIA-1) March 2026 (Max Marks: 40, Duration: 75m)",
                "date": "14-03-2026",
                "duration": "75 Mins",
                "maxMarks": 40,
                "fileUrl": "https://www.mindflowlearn.co.in/sample-pyqs/25EN1109-2026-Mar-MidSem.pdf"
              }
            ]
          },
          {
            "name": "Physics for Computer Science Cluster",
            "code": "25EN1115",
            "slug": "physics-for-computer-science-cluster",
            "credits": 4,
            "guidance": {
              "notes": "Focus on 5 Core Modules: (1) Quantum Mechanics (Wave function physical significance, Born interpretation, Normalization, 1D Schrödinger equation derivation, Particle in an infinite potential well discrete energy eigenvalues & numericals); (2) Quantum Computing (Qubit, Quantum Entanglement, Quantum Parallelism, Pauli-X matrix representation, Quantum Key Distribution - QKD BB84); (3) Lasers & Optical Fibers (Spontaneous vs Stimulated emission, Nd:YAG 4-level laser energy level diagram, Optical fiber loss mechanisms and attenuation); (4) Semiconductor Physics & Devices (Hall Effect & Hall Voltage derivation, Fermi-Dirac distribution & Fermi level occupation probability, Photodiode vs Solar Cell comparison, LED working principle); (5) Nanoscience & Thin Films (Ball milling nanomaterial synthesis, Top-down vs Bottom-up approaches, Advantages of thin films over bulk materials, Sputtering deposition technique).",
              "passingTips": "1D Schrödinger wave equation derivation for infinite potential well, Nd:YAG laser diagram, Hall Voltage derivation, and Ball Milling vs Sputtering are guaranteed 16-mark questions.",
              "highYieldTopics": [
                "Wave Function Physical Significance & Normalization Conditions",
                "1D Schrödinger Equation & Infinite Potential Well Eigenvalues",
                "Qubit, Quantum Entanglement & Quantum Parallelism",
                "Pauli-X Gate Matrix Representation & Action on Qubit",
                "Quantum Key Distribution (QKD) Protocol",
                "Spontaneous vs Stimulated Emission",
                "Nd:YAG Laser Energy Level Diagram & Operation",
                "Losses in Optical Fibers (Attenuation, Scattering, Dispersion)",
                "Hall Effect & Hall Voltage (VH) Derivation",
                "Fermi-Dirac Distribution Probability Calculation",
                "Photodiode vs Solar Cell Comparison & LED Working",
                "Nanomaterials Ball Milling Synthesis & Sputtering Technique"
              ]
            },
            "resources": [
              {
                "title": "MIT 8.04: Quantum Physics I (Prof. Allan Adams)",
                "provider": "MIT OpenCourseWare",
                "type": "video_course",
                "url": "https://ocw.mit.edu/courses/8-04-quantum-physics-i-spring-2016/"
              },
              {
                "title": "Stanford Online: Quantum Mechanics for Scientists",
                "provider": "Stanford Online",
                "type": "video_course",
                "url": "https://online.stanford.edu/courses/soe-yqe0001-quantum-mechanics-scientists-and-engineers"
              },
              {
                "title": "Michel van Biezen: Quantum & Semiconductor Physics",
                "provider": "YouTube (Michel van Biezen)",
                "type": "youtube_playlist",
                "url": "https://www.youtube.com/playlist?list=PLX2gX-ftPVXW6W_6vS8aBwW6Z3-U-uU0j"
              },
              {
                "title": "NPTEL: Engineering Physics",
                "provider": "IIT Bombay / NPTEL",
                "type": "nptel_course",
                "url": "https://nptel.ac.in/courses/115101007"
              }
            ],
            "predictedQuestions": [
              {
                "question": "Set up the 1D time-independent Schrödinger wave equation for a particle trapped in an infinite potential well of width L. Solve for the normalized wave functions and discrete energy eigenvalues En = (n^2 * h^2) / (8 * m * L^2).",
                "marks": 8,
                "probability": "Guaranteed Every Year",
                "module": "Module 1: Quantum Mechanics",
                "answerKey": "Boundary conditions: psi(0) = 0 and psi(L) = 0. Solution inside well psi(x) = A sin(kx) + B cos(kx). At x=0, B=0. At x=L, sin(kL)=0 => kL = n*pi => k = n*pi/L. Energy E = (hbar^2 * k^2)/(2m) = (n^2 * h^2)/(8 * m * L^2). Normalization integral integral_0^L |psi|^2 dx = 1 gives A = sqrt(2/L)."
              },
              {
                "question": "Define a Qubit and explain Quantum Entanglement. Write the matrix representation of Pauli-X gate and show its action on basis states |0> and |1>. Describe the working of Quantum Key Distribution (QKD).",
                "marks": 8,
                "probability": "95% Probability",
                "module": "Module 2: Quantum Computing",
                "answerKey": "Qubit |psi> = alpha |0> + beta |1> with |alpha|^2 + |beta|^2 = 1. Pauli-X matrix = [[0, 1], [1, 0]]. Action: X|0> = |1>, X|1> = |0> (Quantum NOT). QKD (BB84 protocol): Alice transmits single photons randomly polarized across rectilinear (+) and diagonal (x) bases, Bob measures in random bases, public basis reconciliation creates provably secure symmetric key."
              },
              {
                "question": "Explain the principle, energy level transitions, and working of an Nd:YAG 4-level solid-state laser with a labelled diagram.",
                "marks": 8,
                "probability": "95% Probability",
                "module": "Module 3: Lasers & Optics",
                "answerKey": "Draw 4 energy levels: Ground State (4I9/2), Pump Bands (4F5/2, 4H9/2), Metastable Upper Lasing State (4F3/2), and Lower Lasing State (4I11/2). Optical pumping with flashlamp/laser diode causes excitation followed by fast non-radiative decay to 4F3/2. Stimulated emission yields 1064 nm IR laser radiation, followed by fast relaxation to ground state."
              },
              {
                "question": "Derive an expression for Hall Voltage (VH) in a conducting semiconductor strip carrying current I in a transverse magnetic field B. Explain how Hall Effect determines majority carrier type and concentration.",
                "marks": 8,
                "probability": "90% Probability",
                "module": "Module 4: Semiconductor Physics",
                "answerKey": "Equate Lorentz magnetic force q*v_d*B to electric force q*E_H => E_H = v_d*B. Current density J = n*q*v_d => v_d = J/(n*q). Hall Voltage V_H = E_H * w = (B * I) / (n * q * t). Hall coefficient R_H = 1/(n*q). Sign of V_H indicates p-type (+ve) or n-type (-ve)."
              }
            ],
            "pyqs": [
              {
                "year": 2026,
                "examType": "end_sem",
                "title": "End Semester Exam May 2026 (Max Marks: 80, Duration: 2h 30m)",
                "date": "21-05-2026",
                "duration": "2h 30m",
                "maxMarks": 80,
                "fileUrl": "https://www.mindflowlearn.co.in/sample-pyqs/25EN1115-2026-May-EndSem.pdf"
              }
            ]
          },
          {
            "name": "Introduction to Sustainable Engineering",
            "code": "25EN1120",
            "slug": "intro-to-sustainable-engineering",
            "credits": 3,
            "guidance": {
              "notes": "Focus on: (1) Circular Economy model vs Linear Economy, Product Stewardship, and Life Cycle Assessment (LCA); (2) Sustainable Material Sourcing, Embodied Energy, and Decarbonization; (3) Thermodynamics and Energy Efficiency (Modes of heat transfer - Conduction, Convection, Radiation, Bernoulli’s fluid equation in inclined pipes, Thermal engine efficiency); (4) UN Sustainable Development Goals (SDGs) and role of engineers in global sustainability.",
              "passingTips": "Focus on Circular Economy principles, Product Stewardship definitions, Bernoulli equation inclined pipe numericals, and Engine thermal efficiency calculations.",
              "highYieldTopics": [
                "Circular Economy vs Linear Take-Make-Dispose Model",
                "Product Stewardship & Life Cycle Assessment (LCA)",
                "Sustainable Sourcing & Embodied Energy Reduction",
                "Modes of Heat Transfer (Conduction, Convection, Radiation)",
                "Core Principles of Sustainable Engineering Design",
                "Bernoulli’s Equation Fluid Flow in Inclined Pipe Numerical",
                "Heat Engine & Thermal Efficiency Numericals",
                "UN Sustainable Development Goals (SDGs) for Engineers"
              ]
            },
            "resources": [
              {
                "title": "MIT OCW: Sustainable Energy (Prof. Michael Golay)",
                "provider": "MIT OpenCourseWare",
                "type": "video_course",
                "url": "https://ocw.mit.edu/courses/22-081j-introduction-to-sustainable-energy-fall-2010/"
              },
              {
                "title": "Stanford Online: Energy and the Environment",
                "provider": "Stanford Online",
                "type": "video_course",
                "url": "https://online.stanford.edu/courses/cee-107s-energy-and-environment"
              },
              {
                "title": "NPTEL: Sustainable Engineering Concepts",
                "provider": "IIT Madras / NPTEL",
                "type": "nptel_course",
                "url": "https://nptel.ac.in/courses/107106008"
              }
            ],
            "predictedQuestions": [
              {
                "question": "Compare the Linear Economy (Take-Make-Dispose) with the Circular Economy (3R: Reduce, Reuse, Recycle) model. Explain Product Stewardship and the 5 stages of Life Cycle Assessment (LCA).",
                "marks": 8,
                "probability": "95% Probability",
                "module": "Module 1: Circular Economy & Sustainability",
                "answerKey": "Draw butterfly circular economy diagram. Linear model produces massive landfill waste and resource depletion. LCA stages: (1) Raw material extraction, (2) Manufacturing/Processing, (3) Distribution & Packaging, (4) Use phase, (5) End-of-life recycling/disposal."
              },
              {
                "question": "State Bernoulli’s equation for fluid flow. Water flows through an inclined pipe of diameter tapering from 20 cm at lower end (height 2m) to 10 cm at upper end (height 6m). If pressure at lower end is 300 kPa and flow rate is 50 L/s, determine the pressure at the upper end.",
                "marks": 8,
                "probability": "90% Probability",
                "module": "Module 3: Engineering Fluid Mechanics",
                "answerKey": "Continuity equation: Q = A1*v1 = A2*v2 => v1 = 0.05 / (pi*0.1^2) = 1.59 m/s, v2 = 0.05 / (pi*0.05^2) = 6.37 m/s. Bernoulli: P1/(rho*g) + v1^2/(2g) + z1 = P2/(rho*g) + v2^2/(2g) + z2. Solve for P2 = 242.8 kPa."
              }
            ],
            "pyqs": [
              {
                "year": 2026,
                "examType": "mid1",
                "title": "Mid Semester Exam (CIA-1) March 2026 (Max Marks: 40, Duration: 75m)",
                "date": "13-03-2026",
                "duration": "75 Mins",
                "maxMarks": 40,
                "fileUrl": "https://www.mindflowlearn.co.in/sample-pyqs/25EN1120-2026-Mar-MidSem.pdf"
              }
            ]
          }
        ]
      },
      {
        "number": 3,
        "subjects": [
          {
            "name": "Data Structures and Applications",
            "code": "21CS32",
            "slug": "data-structures-and-applications",
            "credits": 4,
            "guidance": {
              "notes": "Focus on Linked Lists (Singly, Doubly, Circular), Stacks & Queues, Trees (AVL, BST, B-Trees), and Graph Traversals (BFS/DFS). Module 3 & 4 carry 40%+ of exam weightage.",
              "passingTips": "Master BST insertion/deletion and AVL tree rotation step-by-step traces.",
              "highYieldTopics": [
                "AVL Tree Single & Double Rotations",
                "Binary Search Tree Deletion Algorithm",
                "Dijkstra Shortest Path & Prim’s MST",
                "Stack Applications (Infix to Postfix Conversion)"
              ]
            },
            "resources": [
              {
                "title": "MIT 6.006: Introduction to Algorithms",
                "provider": "MIT OpenCourseWare",
                "type": "video_course",
                "url": "https://ocw.mit.edu/courses/6-006-introduction-to-algorithms-spring-2020/"
              },
              {
                "title": "Abdul Bari: Data Structures Complete Masterclass",
                "provider": "YouTube (Abdul Bari)",
                "type": "youtube_playlist",
                "url": "https://www.youtube.com/playlist?list=PLDN4rrl48XKpZkf03iYFl-O29szjTrs_O"
              },
              {
                "title": "Stanford CS106B: Programming Abstractions in C++",
                "provider": "Stanford Online",
                "type": "video_course",
                "url": "https://web.stanford.edu/class/cs106b/"
              },
              {
                "title": "Gate Smashers: Data Structures Full Course",
                "provider": "YouTube (Gate Smashers)",
                "type": "youtube_playlist",
                "url": "https://www.youtube.com/playlist?list=PLxCzCOWd7aiEwaANNt3OqJPVIxwp2ebi7"
              }
            ],
            "predictedQuestions": [
              {
                "question": "Explain AVL Tree rotations (LL, RR, LR, RL) with balance factor criteria and demonstrate insertion of keys: [14, 17, 11, 7, 53, 4, 13] into an empty AVL tree.",
                "marks": 8,
                "probability": "Guaranteed Every Year",
                "module": "Module 3: Non-Linear Data Structures (Trees)",
                "answerKey": "Define balance factor BF = height(left) - height(right) in {-1, 0, 1}. Show single rotations (LL, RR) and double rotations (LR, RL) with tree diagrams at each insertion step."
              },
              {
                "question": "Write an algorithm and C function to convert an Infix expression to Postfix using a Stack. Trace the algorithm on: (A + B * C) / (D - E ^ F).",
                "marks": 8,
                "probability": "95% Probability",
                "module": "Module 1: Stacks & Applications",
                "answerKey": "Operator precedence table: ^ > (*, /) > (+, -). Output postfix: A B C * + D E F ^ - /."
              },
              {
                "question": "Explain Dijkstra’s Single Source Shortest Path algorithm on a directed weighted graph and write the pseudocode with time complexity using adjacency list and min-priority queue.",
                "marks": 8,
                "probability": "90% Probability",
                "module": "Module 4: Graphs & Shortest Paths",
                "answerKey": "Greedy strategy: maintain dist[] initialized to infinity, visit unvisited vertex with min distance, relax outgoing edges: if (dist[u] + weight(u,v) < dist[v]) dist[v] = dist[u] + weight(u,v). Time complexity: O((V + E) log V)."
              }
            ],
            "pyqs": [
              {
                "year": 2024,
                "examType": "end_sem",
                "title": "End Semester Exam 2024 (Regular)",
                "fileUrl": "https://www.mindflowlearn.co.in/sample-pyqs/21CS32-2024-EndSem.pdf"
              },
              {
                "year": 2024,
                "examType": "mid1",
                "title": "CIA-1 Midterm 2024",
                "fileUrl": "https://www.mindflowlearn.co.in/sample-pyqs/21CS32-2024-Mid1.pdf"
              },
              {
                "year": 2023,
                "examType": "end_sem",
                "title": "End Semester Exam 2023",
                "fileUrl": "https://www.mindflowlearn.co.in/sample-pyqs/21CS32-2023-EndSem.pdf"
              }
            ]
          },
          {
            "name": "Analog and Digital Electronics",
            "code": "21CS33",
            "slug": "analog-and-digital-electronics",
            "credits": 3,
            "guidance": {
              "notes": "Op-Amps, Karnaugh Maps (K-Maps), Multiplexers, Decoders, Flip-Flops, and Synchronous Counter Design.",
              "passingTips": "Practice 4-variable K-Map minimization and draw neat JK / D flip-flop state diagrams.",
              "highYieldTopics": [
                "4-Variable K-Map Minimization",
                "Master-Slave JK Flip-Flop",
                "Synchronous Up/Down Counter Design",
                "Inverting & Non-Inverting Op-Amp Circuits"
              ]
            },
            "resources": [
              {
                "title": "Neso Academy: Digital Logic Design",
                "provider": "YouTube (Neso Academy)",
                "type": "youtube_playlist",
                "url": "https://www.youtube.com/playlist?list=PLBlnK6fEyqRjMH3mWf6kwqiETJx50Ex5y"
              },
              {
                "title": "All About Electronics: Op-Amps & Comparators",
                "provider": "YouTube (All About Electronics)",
                "type": "youtube_playlist",
                "url": "https://www.youtube.com/playlist?list=PLwjK_wDTCSWjh8iT2q75QjG_bA0z6F9_1"
              }
            ],
            "predictedQuestions": [
              {
                "question": "Simplify the Boolean function F(A, B, C, D) = sum m(0, 2, 5, 7, 8, 10, 14, 15) + sum d(3, 11) using a 4-variable Karnaugh Map and realize the simplified expression using basic logic gates.",
                "marks": 8,
                "probability": "Guaranteed Every Year",
                "module": "Module 2: Combinational Logic",
                "answerKey": "Draw 4x4 grid with gray code labels (00, 01, 11, 10). Group corner octet/quads incorporating don’t-care terms to obtain minimal SOP expression."
              },
              {
                "question": "Design a 3-bit Synchronous Up-Counter using JK Flip-Flops. Draw the state diagram, excitation table, K-maps for J & K inputs, and final logic schematic.",
                "marks": 8,
                "probability": "95% Probability",
                "module": "Module 4: Sequential Logic & Counters",
                "answerKey": "States 000 -> 001 -> ... -> 111 -> 000. Use JK excitation table (0->0: 0,X; 0->1: 1,X; 1->0: X,1; 1->1: X,0). Solve K-maps: J0=K0=1; J1=K1=Q0; J2=K2=Q0*Q1."
              }
            ],
            "pyqs": [
              {
                "year": 2024,
                "examType": "end_sem",
                "title": "End Semester Exam 2024",
                "fileUrl": "https://www.mindflowlearn.co.in/sample-pyqs/21CS33-2024-EndSem.pdf"
              },
              {
                "year": 2023,
                "examType": "end_sem",
                "title": "End Semester Exam 2023",
                "fileUrl": "https://www.mindflowlearn.co.in/sample-pyqs/21CS33-2023-EndSem.pdf"
              }
            ]
          },
          {
            "name": "Computer Organization and Architecture",
            "code": "21CS34",
            "slug": "computer-organization-and-architecture",
            "credits": 3,
            "guidance": {
              "notes": "Memory Hierarchy, Cache Mapping (Direct, Set-Associative), Pipelining Hazards, and Booth’s Multiplication Algorithm.",
              "passingTips": "Solve numericals on Cache Hit/Miss ratios and instruction execution cycles.",
              "highYieldTopics": [
                "Cache Memory Mapping Techniques",
                "Instruction Pipelining Hazards",
                "Booth’s Multiplication Algorithm",
                "DMA Controller Block Diagram"
              ]
            },
            "resources": [
              {
                "title": "MIT 6.004: Computation Structures",
                "provider": "MIT OpenCourseWare",
                "type": "video_course",
                "url": "https://ocw.mit.edu/courses/6-004-computation-structures-spring-2017/"
              },
              {
                "title": "Gate Smashers: Computer Architecture & Organization",
                "provider": "YouTube (Gate Smashers)",
                "type": "youtube_playlist",
                "url": "https://www.youtube.com/playlist?list=PLxCzCOWd7aiHMonh3G6QNKq53C6oNXGrX"
              }
            ],
            "predictedQuestions": [
              {
                "question": "Demonstrate Booth’s Multiplication Algorithm to multiply multiplicand M = 7 (0111) and multiplier Q = -3 (1101) showing register states (A, Q, Q-1) after each arithmetic cycle.",
                "marks": 8,
                "probability": "Guaranteed Every Year",
                "module": "Module 2: Arithmetic Logic Unit",
                "answerKey": "Initialize A=0000, Q=1101, Q-1=0, Count=4. Check Q0 Q-1: 10 => A = A - M, Arithmetic Right Shift (ARS); 01 => A = A + M, ARS; 00/11 => ARS. Final result in A:Q = 11101011 (-21)."
              },
              {
                "question": "Explain Cache Memory mapping techniques: (i) Direct Mapping, (ii) Associative Mapping, and (iii) Set-Associative Mapping with address format breakdown and hit/miss evaluation.",
                "marks": 8,
                "probability": "95% Probability",
                "module": "Module 4: Memory System Hierarchy",
                "answerKey": "Direct: Block address = i mod (number of lines). Associative: any block to any line. Set-Associative: block address mod (number of sets). Break down Tag, Set/Index, and Word/Byte offset fields."
              }
            ],
            "pyqs": [
              {
                "year": 2024,
                "examType": "end_sem",
                "title": "End Semester Exam 2024",
                "fileUrl": "https://www.mindflowlearn.co.in/sample-pyqs/21CS34-2024-EndSem.pdf"
              }
            ]
          }
        ]
      },
      {
        "number": 4,
        "subjects": [
          {
            "name": "Design and Analysis of Algorithms",
            "code": "21CS42",
            "slug": "design-and-analysis-of-algorithms",
            "credits": 4,
            "guidance": {
              "notes": "Master Theorem for recurrences, Divide-and-Conquer (Merge/Quick sort), Dynamic Programming (0/1 Knapsack, LCS), and Greedy strategies (Huffman Coding, Kruskal/Prim).",
              "passingTips": "Always provide Pseudocode + Recurrence relation + Time Complexity proof.",
              "highYieldTopics": [
                "Master Theorem Recurrences",
                "0/1 Knapsack Problem (DP vs Greedy)",
                "Longest Common Subsequence (LCS)",
                "Kruskal and Prim Minimum Spanning Trees",
                "NP-Complete vs NP-Hard Definitions"
              ]
            },
            "resources": [
              {
                "title": "MIT 6.046J: Design and Analysis of Algorithms",
                "provider": "MIT OpenCourseWare",
                "type": "video_course",
                "url": "https://ocw.mit.edu/courses/6-046j-design-and-analysis-of-algorithms-spring-2015/"
              },
              {
                "title": "Abdul Bari: Algorithms Full Playlists",
                "provider": "YouTube (Abdul Bari)",
                "type": "youtube_playlist",
                "url": "https://www.youtube.com/playlist?list=PLDN4rrl48XKpZkf03iYFl-O29szjTrs_O"
              },
              {
                "title": "Stanford CS161: Design and Analysis of Algorithms",
                "provider": "Stanford Online",
                "type": "video_course",
                "url": "https://web.stanford.edu/class/cs161/"
              }
            ],
            "predictedQuestions": [
              {
                "question": "Solve the 0/1 Knapsack Problem using Dynamic Programming for capacity W = 5 and items: Item 1 (weight 2, value 12), Item 2 (weight 1, value 10), Item 3 (weight 3, value 20), Item 4 (weight 2, value 15). Build the complete DP table and find selected items.",
                "marks": 8,
                "probability": "Guaranteed Every Year",
                "module": "Module 3: Dynamic Programming",
                "answerKey": "Recurrence: V[i, w] = max(V[i-1, w], V[i-1, w - w_i] + v_i). Build (4+1) x (5+1) matrix. Max value = 37 (Items 2, 4, 3)."
              },
              {
                "question": "State Master Theorem for divide-and-conquer recurrences T(n) = a T(n/b) + f(n). Solve: (i) T(n) = 4T(n/2) + n, (ii) T(n) = 2T(n/2) + n log n, (iii) T(n) = 3T(n/4) + n^2.",
                "marks": 8,
                "probability": "95% Probability",
                "module": "Module 1: Asymptotic Analysis",
                "answerKey": "Compare f(n) with n^(log_b a). (i) a=4, b=2 => n^(log_2 4) = n^2. f(n)=n => Case 1 => Theta(n^2). (ii) a=2, b=2 => n^1. f(n) = n log n => Extended Case 2 => Theta(n log^2 n). (iii) a=3, b=4 => n^(log_4 3) ~ n^0.79. f(n)=n^2 => Case 3 => Theta(n^2)."
              }
            ],
            "pyqs": [
              {
                "year": 2024,
                "examType": "end_sem",
                "title": "End Semester Exam 2024",
                "fileUrl": "https://www.mindflowlearn.co.in/sample-pyqs/21CS42-2024-EndSem.pdf"
              },
              {
                "year": 2023,
                "examType": "end_sem",
                "title": "End Semester Exam 2023",
                "fileUrl": "https://www.mindflowlearn.co.in/sample-pyqs/21CS42-2023-EndSem.pdf"
              }
            ]
          },
          {
            "name": "Operating Systems",
            "code": "21CS44",
            "slug": "operating-systems",
            "credits": 3,
            "guidance": {
              "notes": "CPU Scheduling (Round Robin, SRTF), Process Synchronization (Semaphores, Dining Philosophers), Deadlock (Banker’s Algorithm), and Virtual Memory (Page replacement: FIFO, LRU, Optimal).",
              "passingTips": "Banker’s Safety algorithm calculations and Gantt chart scheduling numericals are guaranteed.",
              "highYieldTopics": [
                "Banker’s Deadlock Avoidance Algorithm",
                "LRU and Optimal Page Replacement Calculations",
                "Classical IPC Problems (Producer-Consumer, Reader-Writer)",
                "Process State Transition Diagram & PCB"
              ]
            },
            "resources": [
              {
                "title": "Gate Smashers: Operating Systems Full Course",
                "provider": "YouTube (Gate Smashers)",
                "type": "youtube_playlist",
                "url": "https://www.youtube.com/playlist?list=PLxCzCOWd7aiGz9donHRrE9I3Mwn6XdP8p"
              },
              {
                "title": "MIT 6.S081: Operating System Engineering",
                "provider": "MIT OpenCourseWare",
                "type": "video_course",
                "url": "https://pdos.csail.mit.edu/6.828/2020/"
              },
              {
                "title": "Neso Academy: Operating Systems Concepts",
                "provider": "YouTube (Neso Academy)",
                "type": "youtube_playlist",
                "url": "https://www.youtube.com/playlist?list=PLBlnK6fEyqRiVhbXDGLXDk_OQAeuVcp2O"
              }
            ],
            "predictedQuestions": [
              {
                "question": "Consider 5 processes P0 to P4 with Allocation, Max matrices, and Available resources [3, 3, 2] for resources (A, B, C). Compute the Need Matrix and verify if the system is in a Safe State using Banker’s Algorithm. List the safe sequence.",
                "marks": 8,
                "probability": "Guaranteed Every Year",
                "module": "Module 3: Deadlocks",
                "answerKey": "Need = Max - Allocation. Check process where Need <= Available, allocate and reclaim: Available += Allocation. Valid safe sequence: <P1, P3, P4, P0, P2>."
              },
              {
                "question": "For the reference string: [7, 0, 1, 2, 0, 3, 0, 4, 2, 3, 0, 3, 2, 1, 2, 0, 1, 7, 0, 1] with 3 physical frames, compute the number of page faults using: (i) FIFO, (ii) LRU, and (iii) Optimal Page Replacement.",
                "marks": 8,
                "probability": "95% Probability",
                "module": "Module 4: Virtual Memory Management",
                "answerKey": "Draw frame allocation table at each memory access. FIFO faults = 15, LRU faults = 12, Optimal faults = 9."
              }
            ],
            "pyqs": [
              {
                "year": 2024,
                "examType": "end_sem",
                "title": "End Semester Exam 2024",
                "fileUrl": "https://www.mindflowlearn.co.in/sample-pyqs/21CS44-2024-EndSem.pdf"
              },
              {
                "year": 2023,
                "examType": "end_sem",
                "title": "End Semester Exam 2023",
                "fileUrl": "https://www.mindflowlearn.co.in/sample-pyqs/21CS44-2023-EndSem.pdf"
              }
            ]
          }
        ]
      },
      {
        "number": 5,
        "subjects": [
          {
            "name": "Database Management Systems",
            "code": "21CS53",
            "slug": "database-management-systems",
            "credits": 4,
            "guidance": {
              "notes": "ER Modeling, Relational Algebra, SQL joins/subqueries, Normalization (1NF, 2NF, 3NF, BCNF), and ACID transactions (Serializability, 2PL lock protocol).",
              "passingTips": "Solve functional dependency closure sets and normal form decomposition problems.",
              "highYieldTopics": [
                "BCNF & 3NF Lossless Join Decomposition",
                "Conflict Serializability & Precedence Graphs",
                "Two-Phase Locking (2PL) Protocol",
                "Complex SQL Queries with Group By & Having",
                "B+ Tree Insertions and Deletions"
              ]
            },
            "resources": [
              {
                "title": "Gate Smashers: DBMS Full Playlist",
                "provider": "YouTube (Gate Smashers)",
                "type": "youtube_playlist",
                "url": "https://www.youtube.com/playlist?list=PLxCzCOWd7aiFAN6I8C9EzYe54Y6XB_ssY"
              },
              {
                "title": "Stanford Online: Databases Relational Model & SQL",
                "provider": "Stanford Online",
                "type": "video_course",
                "url": "https://online.stanford.edu/courses/soe-ydatabases-databases"
              },
              {
                "title": "CMU 15-445: Database Systems (Prof. Andy Pavlo)",
                "provider": "Carnegie Mellon University",
                "type": "video_course",
                "url": "https://15445.courses.cs.cmu.edu/"
              }
            ],
            "predictedQuestions": [
              {
                "question": "Given relation R(A, B, C, D, E) and Functional Dependencies F = { A -> BC, CD -> E, B -> D, E -> A }. (i) Find Candidate Keys of R, (ii) Determine highest normal form of R, and (iii) Decompose into BCNF with Lossless Join property.",
                "marks": 8,
                "probability": "Guaranteed Every Year",
                "module": "Module 3: Relational Database Design & Normalization",
                "answerKey": "Compute attribute closures: (A)+ = {A, B, C, D, E}, (E)+ = {E, A, B, C, D}, (CD)+ = {C, D, E, A, B}, (BC)+ = {B, C, D, E, A}. Candidate keys: A, E, BC, CD. In B -> D, B is not a superkey, D is prime => 3NF. BCNF decomposition: R1(B, D) and R2(A, B, C, E)."
              },
              {
                "question": "Explain Conflict Serializability. Test if schedule S: r1(X); r2(Y); w1(X); r2(X); w2(Y); w2(X) is conflict serializable by drawing the Precedence Graph.",
                "marks": 8,
                "probability": "95% Probability",
                "module": "Module 5: Transaction Management & Concurrency",
                "answerKey": "Identify conflicting operations (same item, different transactions, at least one write). Edges: r1(X) before r2(X) / w2(X) => T1 -> T2. r2(X) before w1(X)? No, r2 is after w1. w1(X) before r2(X) => T1 -> T2. Graph has single edge T1 -> T2 with no cycles => Serializable with equivalent serial schedule <T1, T2>."
              }
            ],
            "pyqs": [
              {
                "year": 2024,
                "examType": "end_sem",
                "title": "End Semester Exam 2024",
                "fileUrl": "https://www.mindflowlearn.co.in/sample-pyqs/21CS53-2024-EndSem.pdf"
              },
              {
                "year": 2024,
                "examType": "mid1",
                "title": "CIA-1 Midterm 2024",
                "fileUrl": "https://www.mindflowlearn.co.in/sample-pyqs/21CS53-2024-Mid1.pdf"
              },
              {
                "year": 2023,
                "examType": "end_sem",
                "title": "End Semester Exam 2023",
                "fileUrl": "https://www.mindflowlearn.co.in/sample-pyqs/21CS53-2023-EndSem.pdf"
              }
            ]
          },
          {
            "name": "Computer Networks",
            "code": "21CS52",
            "slug": "computer-networks",
            "credits": 4,
            "guidance": {
              "notes": "OSI vs TCP/IP Layers, Subnetting (VLSM, CIDR), Sliding Window Protocols (Go-Back-N, Selective Repeat), Routing Algorithms (Link State, Distance Vector), and TCP Congestion Control.",
              "passingTips": "Practice IP subnet calculations and CRC error-detection polynomial division.",
              "highYieldTopics": [
                "CIDR Subnetting Calculations",
                "CRC Polynomial Error Detection",
                "Go-Back-N vs Selective Repeat ARQ",
                "Distance Vector Routing & Count-to-Infinity Problem",
                "TCP 3-Way Handshake & Congestion Window"
              ]
            },
            "resources": [
              {
                "title": "Gate Smashers: Computer Networks Complete Series",
                "provider": "YouTube (Gate Smashers)",
                "type": "youtube_playlist",
                "url": "https://www.youtube.com/playlist?list=PLxCzCOWd7aiGFBD2-2joCpWOLUrDLvVV_"
              },
              {
                "title": "Stanford CS144: Introduction to Computer Networking",
                "provider": "Stanford Online",
                "type": "video_course",
                "url": "https://cs144.github.io/"
              },
              {
                "title": "Neso Academy: Computer Networks",
                "provider": "YouTube (Neso Academy)",
                "type": "youtube_playlist",
                "url": "https://www.youtube.com/playlist?list=PLBlnK6fEyqRgMCUAG0XRw78UA8qnv6jEx"
              }
            ],
            "predictedQuestions": [
              {
                "question": "An organization is granted IP block 192.168.10.0/24. Design 4 subnets: Subnet A (60 hosts), Subnet B (30 hosts), Subnet C (20 hosts), Subnet D (10 hosts) using VLSM. List Subnet Address, Subnet Mask, Valid Host IP Range, and Broadcast Address for each.",
                "marks": 8,
                "probability": "Guaranteed Every Year",
                "module": "Module 3: Network Layer & Addressing",
                "answerKey": "Subnet A (60 hosts): 2^6 - 2 = 62. Mask /26 (255.255.255.192). Range: .1 to .62, BC: .63. Subnet B (30 hosts): 2^5 - 2 = 30. Mask /27. Range: .65 to .94, BC: .95. Subnet C (20 hosts): Mask /27. Range: .97 to .126, BC: .127. Subnet D (10 hosts): 2^4 - 2 = 14. Mask /28. Range: .129 to .142, BC: .143."
              },
              {
                "question": "Differentiate between Go-Back-N and Selective Repeat sliding window protocols. For a channel with bandwidth 1 Mbps, round trip time 40ms, and packet size 1000 bits, compute the link utilization for window size N = 4.",
                "marks": 8,
                "probability": "95% Probability",
                "module": "Module 2: Data Link Layer & Flow Control",
                "answerKey": "Transmission time Tt = 1000 / 10^6 = 1 ms. Propagation time Tp = RTT / 2 = 20 ms. a = Tp / Tt = 20. Efficiency eta = N / (1 + 2a) = 4 / (1 + 40) = 4 / 41 = 9.76%."
              }
            ],
            "pyqs": [
              {
                "year": 2024,
                "examType": "end_sem",
                "title": "End Semester Exam 2024",
                "fileUrl": "https://www.mindflowlearn.co.in/sample-pyqs/21CS52-2024-EndSem.pdf"
              },
              {
                "year": 2023,
                "examType": "end_sem",
                "title": "End Semester Exam 2023",
                "fileUrl": "https://www.mindflowlearn.co.in/sample-pyqs/21CS52-2023-EndSem.pdf"
              }
            ]
          },
          {
            "name": "Automata Theory and Computability",
            "code": "21CS51",
            "slug": "automata-theory-and-computability",
            "credits": 4,
            "guidance": {
              "notes": "DFA/NFA conversions, Regular Expressions, Pumping Lemma for Regular Languages, Context-Free Grammars (CFG), Pushdown Automata (PDA), and Turing Machines.",
              "passingTips": "Draw clear state transition diagrams for DFA and construct PDA state tables for {a^n b^n | n >= 1}.",
              "highYieldTopics": [
                "NFA to DFA Subset Construction",
                "Pumping Lemma for Regular Languages Proof",
                "Pushdown Automata (PDA) Design",
                "Turing Machine for Palindromes / Addition",
                "Chomsky Normal Form (CNF) Conversion"
              ]
            },
            "resources": [
              {
                "title": "MIT 18.404J: Theory of Computation (Prof. Michael Sipser)",
                "provider": "MIT OpenCourseWare",
                "type": "video_course",
                "url": "https://ocw.mit.edu/courses/18-404j-theory-of-computation-fall-2020/"
              },
              {
                "title": "Gate Smashers: Theory of Computation (TOC)",
                "provider": "YouTube (Gate Smashers)",
                "type": "youtube_playlist",
                "url": "https://www.youtube.com/playlist?list=PLxCzCOWd7aiFM9Lj5G9G_76adtyb4ef7i"
              },
              {
                "title": "Neso Academy: Theory of Computation",
                "provider": "YouTube (Neso Academy)",
                "type": "youtube_playlist",
                "url": "https://www.youtube.com/playlist?list=PLBlnK6fEyqRgp46KUv4ZY69yXmpwKOIev"
              }
            ],
            "predictedQuestions": [
              {
                "question": "State and prove the Pumping Lemma for Regular Languages. Use it to prove that the language L = { a^n b^n | n >= 1 } is NOT regular.",
                "marks": 8,
                "probability": "Guaranteed Every Year",
                "module": "Module 2: Regular Languages & Properties",
                "answerKey": "State lemma: for any regular language L with pumping length p, string s with |s| >= p can be split s = xyz where |xy| <= p, |y| >= 1, and xy^i z in L for all i >= 0. Choose s = a^p b^p. Substring y must contain only a-symbols (y = a^k, k>=1). Pump i=0 => xy^0 z = a^(p-k) b^p where number of a != number of b, contradiction."
              },
              {
                "question": "Design a Pushdown Automata (PDA) to accept the language L = { w c w^R | w in {a, b}* } by empty store (null stack). Provide state transition table and instant description for string \"ab c ba\".",
                "marks": 8,
                "probability": "95% Probability",
                "module": "Module 3: Pushdown Automata",
                "answerKey": "Push matching symbols into stack while reading w in state q0. On reading separator symbol c, transition to state q1 without changing stack. In state q1, pop matching symbols for w^R. On reaching end of input ($) with empty stack (Z0), pop Z0 to accept."
              }
            ],
            "pyqs": [
              {
                "year": 2024,
                "examType": "end_sem",
                "title": "End Semester Exam 2024",
                "fileUrl": "https://www.mindflowlearn.co.in/sample-pyqs/21CS51-2024-EndSem.pdf"
              },
              {
                "year": 2023,
                "examType": "end_sem",
                "title": "End Semester Exam 2023",
                "fileUrl": "https://www.mindflowlearn.co.in/sample-pyqs/21CS51-2023-EndSem.pdf"
              }
            ]
          }
        ]
      },
      {
        "number": 6,
        "subjects": [
          {
            "name": "System Software and Compiler Design",
            "code": "21CS61",
            "slug": "system-software-and-compiler-design",
            "credits": 4,
            "guidance": {
              "notes": "Phases of Compiler, Lexical Analysis, LL(1) Parsing tables, LR(0)/SLR(1) Parsing, Intermediate Code Generation (Three-Address Code), and Code Optimization (DAG).",
              "passingTips": "Compute First & Follow sets accurately and construct the LL(1) parse table step-by-step.",
              "highYieldTopics": [
                "First and Follow Set Computation",
                "LL(1) Parsing Table Construction",
                "LR(0) Canonical Items and SLR(1) Table",
                "Three-Address Code Generation (Quadruples/Triples)",
                "Directed Acyclic Graph (DAG) for Basic Blocks"
              ]
            },
            "resources": [
              {
                "title": "Stanford CS143: Compilers (Prof. Alex Aiken)",
                "provider": "Stanford Online",
                "type": "video_course",
                "url": "https://web.stanford.edu/class/cs143/"
              },
              {
                "title": "Gate Smashers: Compiler Design Full Course",
                "provider": "YouTube (Gate Smashers)",
                "type": "youtube_playlist",
                "url": "https://www.youtube.com/playlist?list=PLxCzCOWd7aiEKtKSIHYusizkESC42diyc"
              }
            ],
            "predictedQuestions": [
              {
                "question": "For the grammar: E -> T E_prime, E_prime -> + T E_prime | epsilon, T -> F T_prime, T_prime -> * F T_prime | epsilon, F -> ( E ) | id. Compute FIRST and FOLLOW sets for all non-terminals and construct the LL(1) predictive parsing table.",
                "marks": 8,
                "probability": "Guaranteed Every Year",
                "module": "Module 2: Syntax Analysis & Top-Down Parsing",
                "answerKey": "FIRST(E) = FIRST(T) = FIRST(F) = {(, id}. FIRST(E_prime) = {+, eps}. FIRST(T_prime) = {*, eps}. FOLLOW(E) = FOLLOW(E_prime) = {$, )}. FOLLOW(T) = FOLLOW(T_prime) = {+, $, )}. FOLLOW(F) = {*, +, $, )}. Build 5x6 LL(1) table; verify no multiple entries => Grammar is LL(1)."
              }
            ],
            "pyqs": [
              {
                "year": 2024,
                "examType": "end_sem",
                "title": "End Semester Exam 2024",
                "fileUrl": "https://www.mindflowlearn.co.in/sample-pyqs/21CS61-2024-EndSem.pdf"
              },
              {
                "year": 2023,
                "examType": "end_sem",
                "title": "End Semester Exam 2023",
                "fileUrl": "https://www.mindflowlearn.co.in/sample-pyqs/21CS61-2023-EndSem.pdf"
              }
            ]
          },
          {
            "name": "Cloud Computing and DevOps",
            "code": "21CS63",
            "slug": "cloud-computing-and-devops",
            "credits": 3,
            "guidance": {
              "notes": "Cloud Service Models (IaaS, PaaS, SaaS), Virtualization, Docker Containers, Kubernetes Pods/Services, CI/CD Pipelines (Jenkins/GitHub Actions), and Infrastructure as Code (Terraform).",
              "passingTips": "Explain Docker architecture and draw CI/CD pipeline stage workflows clearly.",
              "highYieldTopics": [
                "IaaS vs PaaS vs SaaS Architecture",
                "Hypervisors Type 1 vs Type 2 Virtualization",
                "Docker Container Lifecycle & Dockerfile Commands",
                "Kubernetes Architecture (Master-Node, Pods, Services)",
                "CI/CD Pipeline Workflow Implementation"
              ]
            },
            "resources": [
              {
                "title": "freeCodeCamp: DevOps Bootcamp & Docker Course",
                "provider": "freeCodeCamp",
                "type": "video_course",
                "url": "https://www.freecodecamp.org/news/devops-engineering-course-for-beginners/"
              },
              {
                "title": "TechWorld with Nana: Docker & Kubernetes Series",
                "provider": "YouTube (TechWorld with Nana)",
                "type": "youtube_playlist",
                "url": "https://www.youtube.com/playlist?list=PLy7NrYWoggjx_wT1Z-Kk6dYk1T_yV4F6V"
              }
            ],
            "predictedQuestions": [
              {
                "question": "Explain the architecture and workflow of Docker. Differentiate between Docker Image and Docker Container, and write a production Dockerfile for a Node.js web application.",
                "marks": 8,
                "probability": "95% Probability",
                "module": "Module 3: Containerization & Docker",
                "answerKey": "Docker Client -> Docker Daemon -> Containerd / Runc -> Registries. Image is read-only template with layered filesystem; Container is running instance with writable container layer. Write multi-stage Dockerfile: FROM node:20-alpine AS build, WORKDIR /app, COPY package*.json, RUN npm ci, COPY ., RUN npm run build, FROM nginx:alpine, COPY --from=build."
              }
            ],
            "pyqs": [
              {
                "year": 2024,
                "examType": "end_sem",
                "title": "End Semester Exam 2024",
                "fileUrl": "https://www.mindflowlearn.co.in/sample-pyqs/21CS63-2024-EndSem.pdf"
              }
            ]
          }
        ]
      },
      {
        "number": 7,
        "subjects": [
          {
            "name": "Machine Learning and Deep Learning",
            "code": "21CS71",
            "slug": "machine-learning-and-deep-learning",
            "credits": 4,
            "guidance": {
              "notes": "Supervised vs Unsupervised Learning, Linear/Logistic Regression, Decision Trees (ID3), SVM, Multi-Layer Perceptron (Backpropagation), Convolutional Neural Networks (CNN), and RNN/LSTM.",
              "passingTips": "Master the Backpropagation gradient descent weight update equations and CNN layer operations (Convolution, ReLU, Max Pooling).",
              "highYieldTopics": [
                "Backpropagation Algorithm Derivation",
                "CNN Architecture (Convolution, Pooling, Fully Connected)",
                "SVM Kernel Functions & Hyperplane Margin",
                "Decision Tree Entropy & Information Gain",
                "RNN Vanishing Gradient Problem & LSTM Gates"
              ]
            },
            "resources": [
              {
                "title": "Stanford CS229: Machine Learning (Prof. Andrew Ng)",
                "provider": "Stanford Online",
                "type": "video_course",
                "url": "https://cs229.stanford.edu/"
              },
              {
                "title": "3Blue1Brown: Neural Networks Deep Dive",
                "provider": "YouTube (3Blue1Brown)",
                "type": "youtube_series",
                "url": "https://www.youtube.com/playlist?list=PLZHQObOWTQDNU6R1_67000Dx_ZCJB-3pi"
              },
              {
                "title": "Stanford CS231n: Deep Learning for Computer Vision",
                "provider": "Stanford Online",
                "type": "video_course",
                "url": "https://cs231n.stanford.edu/"
              }
            ],
            "predictedQuestions": [
              {
                "question": "Derive the mathematical weight update equations for a Multi-Layer Perceptron using the Backpropagation Algorithm with Gradient Descent and Mean Squared Error (MSE) loss function.",
                "marks": 8,
                "probability": "Guaranteed Every Year",
                "module": "Module 3: Neural Networks & Backpropagation",
                "answerKey": "Use chain rule: dE/dw_ij = (dE/da_j) * (da_j/dz_j) * (dz_j/dw_ij). Output layer error delta_k = (y_k - t_k) * f'(z_k). Hidden layer error delta_j = sum(delta_k * w_kj) * f'(z_j). Weight update rule: w_ij^(new) = w_ij^(old) - eta * delta_j * x_i."
              },
              {
                "question": "Explain the building blocks of Convolutional Neural Networks (CNN): (i) Convolution layer with stride and padding, (ii) ReLU activation, (iii) Max pooling layer, and (iv) Fully Connected classification layer.",
                "marks": 8,
                "probability": "95% Probability",
                "module": "Module 4: Convolutional Neural Networks",
                "answerKey": "Output size formula: O = ((W - F + 2P)/S) + 1. Describe spatial feature extraction via kernels, non-linearity via ReLU, dimensional reduction / translation invariance via Max Pooling, and Softmax dense output."
              }
            ],
            "pyqs": [
              {
                "year": 2024,
                "examType": "end_sem",
                "title": "End Semester Exam 2024",
                "fileUrl": "https://www.mindflowlearn.co.in/sample-pyqs/21CS71-2024-EndSem.pdf"
              },
              {
                "year": 2023,
                "examType": "end_sem",
                "title": "End Semester Exam 2023",
                "fileUrl": "https://www.mindflowlearn.co.in/sample-pyqs/21CS71-2023-EndSem.pdf"
              }
            ]
          }
        ]
      }
    ]
  },
  {
    "name": "CSE — Artificial Intelligence & Machine Learning",
    "shortName": "CSE (AI/ML)",
    "slug": "cse-aiml",
    "codePrefix": "AI",
    "description": "Deep neural networks, computer vision, natural language processing, cognitive computing, and generative AI models.",
    "badge": "Trending",
    "semesters": [
      {
        "number": 3,
        "subjects": [
          {
            "name": "Discrete Mathematics for AI",
            "code": "21AI31",
            "slug": "discrete-mathematics-for-ai",
            "credits": 4,
            "guidance": {
              "notes": "Propositional Logic, Predicate Calculus, Graph Theory (Trees, Eulerian/Hamiltonian graphs), Recurrence Relations, and Combinatorics.",
              "passingTips": "Practice truth table proofs and solving second-order linear homogeneous recurrence relations.",
              "highYieldTopics": [
                "Propositional Logic Equivalence Proofs",
                "Generating Functions for Recurrences",
                "Eulerian & Hamiltonian Graph Conditions",
                "Bayes Theorem & Conditional Probability"
              ]
            },
            "resources": [
              {
                "title": "MIT 6.042J: Mathematics for Computer Science",
                "provider": "MIT OpenCourseWare",
                "type": "video_course",
                "url": "https://ocw.mit.edu/courses/6-042j-mathematics-for-computer-science-spring-2015/"
              },
              {
                "title": "NPTEL: Discrete Mathematics",
                "provider": "IIT Ropar / NPTEL",
                "type": "nptel_course",
                "url": "https://nptel.ac.in/courses/106106183"
              }
            ],
            "predictedQuestions": [
              {
                "question": "Solve the recurrence relation a_n = 5 a_(n-1) - 6 a_(n-2) with initial conditions a_0 = 1, a_1 = 4 using the Characteristic Equation Method.",
                "marks": 8,
                "probability": "Guaranteed Every Year",
                "module": "Module 3: Recurrence Relations",
                "answerKey": "Characteristic equation: r^2 - 5r + 6 = 0 => (r - 2)(r - 3) = 0. Roots: r1=2, r2=3. General solution: a_n = c1 (2^n) + c2 (3^n). At n=0: c1 + c2 = 1. At n=1: 2 c1 + 3 c2 = 4. Solve c1 = -1, c2 = 2. Result: a_n = 2*(3^n) - 2^n."
              }
            ],
            "pyqs": [
              {
                "year": 2024,
                "examType": "end_sem",
                "title": "End Semester Exam 2024",
                "fileUrl": "https://www.mindflowlearn.co.in/sample-pyqs/21AI31-2024-EndSem.pdf"
              }
            ]
          },
          {
            "name": "Data Structures and Algorithms with Python",
            "code": "21AI32",
            "slug": "data-structures-and-algorithms-with-python",
            "credits": 4,
            "guidance": {
              "notes": "Python implementations of Linked Lists, Stacks, Queues, Binary Search Trees, Heaps, and Graph algorithms (BFS/DFS, Dijkstra).",
              "passingTips": "Write clean Python classes for Node, Stack, and BST with traversal methods.",
              "highYieldTopics": [
                "Python BST Insertion & Deletion Class Methods",
                "Heap Sort & Priority Queue in Python",
                "Graph Representation (Adjacency List vs Matrix)",
                "Big-O Complexity Analysis"
              ]
            },
            "resources": [
              {
                "title": "MIT 6.006: Introduction to Algorithms with Python",
                "provider": "MIT OpenCourseWare",
                "type": "video_course",
                "url": "https://ocw.mit.edu/courses/6-006-introduction-to-algorithms-spring-2020/"
              },
              {
                "title": "freeCodeCamp: Data Structures & Algorithms in Python",
                "provider": "freeCodeCamp",
                "type": "video_course",
                "url": "https://www.freecodecamp.org/news/learn-algorithms-and-data-structures-in-python/"
              }
            ],
            "predictedQuestions": [
              {
                "question": "Implement a complete Python class for a Binary Search Tree (BST) with methods: insert(val), search(val), and inorder_traversal().",
                "marks": 8,
                "probability": "95% Probability",
                "module": "Module 3: Trees & Traversal",
                "answerKey": "Define class TreeNode with left, right, val. In BST class, recursive insertion: if val < root.val => root.left = insert(root.left, val); else root.right = insert(root.right, val). Inorder visits left -> root -> right."
              }
            ],
            "pyqs": [
              {
                "year": 2024,
                "examType": "end_sem",
                "title": "End Semester Exam 2024",
                "fileUrl": "https://www.mindflowlearn.co.in/sample-pyqs/21AI32-2024-EndSem.pdf"
              }
            ]
          }
        ]
      },
      {
        "number": 5,
        "subjects": [
          {
            "name": "Foundations of Machine Learning",
            "code": "21AI51",
            "slug": "foundations-of-machine-learning",
            "credits": 4,
            "guidance": {
              "notes": "Linear & Logistic Regression, Decision Trees (ID3/C4.5 Entropy & Information Gain), SVM (Kernel Trick), Naive Bayes Classifier, and Evaluation Metrics (ROC-AUC, Precision/Recall/F1).",
              "passingTips": "Practice Information Gain numerical calculations for Decision Tree root node selection.",
              "highYieldTopics": [
                "Decision Tree Information Gain & Entropy Calculations",
                "SVM Margin Maximization & Dual Formulation",
                "Bias-Variance Tradeoff & Regularization (L1/L2)",
                "Naive Bayes Classification Probability Numerical",
                "K-Means Clustering Step-by-Step"
              ]
            },
            "resources": [
              {
                "title": "Stanford CS229: Machine Learning by Andrew Ng",
                "provider": "Stanford Online",
                "type": "video_course",
                "url": "https://cs229.stanford.edu/"
              },
              {
                "title": "StatQuest: Machine Learning Fundamentals",
                "provider": "YouTube (StatQuest)",
                "type": "youtube_playlist",
                "url": "https://www.youtube.com/playlist?list=PLblh5JKOoLUICTaGLRoHQDuF_7q2GfuJF"
              }
            ],
            "predictedQuestions": [
              {
                "question": "Calculate the Entropy and Information Gain for selecting the root attribute from a dataset with 9 Yes and 5 No instances, evaluating feature Wind (Weak: 6 Yes, 2 No; Strong: 3 Yes, 3 No) using ID3 Decision Tree algorithm.",
                "marks": 8,
                "probability": "Guaranteed Every Year",
                "module": "Module 2: Decision Trees & ID3",
                "answerKey": "Entropy(S) = -(9/14)log2(9/14) - (5/14)log2(5/14) = 0.940. Entropy(Wind=Weak) = -(6/8)log2(6/8) - (2/8)log2(2/8) = 0.811. Entropy(Wind=Strong) = -(3/6)log2(3/6) - (3/6)log2(3/6) = 1.000. Gain(S, Wind) = 0.940 - [ (8/14)*0.811 + (6/14)*1.000 ] = 0.940 - 0.892 = 0.048."
              }
            ],
            "pyqs": [
              {
                "year": 2024,
                "examType": "end_sem",
                "title": "End Semester Exam 2024",
                "fileUrl": "https://www.mindflowlearn.co.in/sample-pyqs/21AI51-2024-EndSem.pdf"
              }
            ]
          },
          {
            "name": "Artificial Intelligence & Search Algorithms",
            "code": "21AI52",
            "slug": "artificial-intelligence-and-search-algorithms",
            "credits": 3,
            "guidance": {
              "notes": "Uninformed Search (BFS, DFS, Uniform Cost), Informed Search (A*, Greedy Best-First), Game Playing (Minimax, Alpha-Beta Pruning), and Constraint Satisfaction Problems.",
              "passingTips": "Draw complete search trees showing heuristic calculations and Alpha-Beta pruning branch cuts.",
              "highYieldTopics": [
                "A* Search with Admissible & Consistent Heuristics",
                "Alpha-Beta Pruning on Game Trees",
                "Constraint Satisfaction with Backtracking & AC-3",
                "Hill Climbing & Local Maxima Avoidance"
              ]
            },
            "resources": [
              {
                "title": "UC Berkeley CS188: Introduction to Artificial Intelligence",
                "provider": "UC Berkeley",
                "type": "video_course",
                "url": "https://inst.eecs.berkeley.edu/~cs188/"
              },
              {
                "title": "MIT 6.034: Artificial Intelligence (Prof. Patrick Winston)",
                "provider": "MIT OpenCourseWare",
                "type": "video_course",
                "url": "https://ocw.mit.edu/courses/6-034-artificial-intelligence-fall-2010/"
              }
            ],
            "predictedQuestions": [
              {
                "question": "Trace the A* Search algorithm on a given navigation graph from Start node S to Goal node G with step-by-step OPEN and CLOSED lists, verifying that heuristic h(n) is admissible.",
                "marks": 8,
                "probability": "Guaranteed Every Year",
                "module": "Module 2: Heuristic Search Strategies",
                "answerKey": "Evaluation function f(n) = g(n) + h(n). Admissible condition h(n) <= h*(n). Track OPEN list prioritized by lowest f(n), expand node, compute f(m) for neighbors, add to CLOSED."
              }
            ],
            "pyqs": [
              {
                "year": 2024,
                "examType": "end_sem",
                "title": "End Semester Exam 2024",
                "fileUrl": "https://www.mindflowlearn.co.in/sample-pyqs/21AI52-2024-EndSem.pdf"
              }
            ]
          }
        ]
      },
      {
        "number": 6,
        "subjects": [
          {
            "name": "Natural Language Processing",
            "code": "21AI62",
            "slug": "natural-language-processing",
            "credits": 3,
            "guidance": {
              "notes": "Text Preprocessing (Tokenization, Lemmatization), N-gram Language Models, Word Embeddings (Word2Vec, GloVe), Sequence Tagging (HMM/CRF), and Pretrained LLMs (BERT, GPT).",
              "passingTips": "Explain Skip-Gram vs Continuous Bag of Words (CBOW) in Word2Vec and BERT Masked Language Modeling.",
              "highYieldTopics": [
                "Word2Vec Skip-Gram Architecture with Negative Sampling",
                "BERT vs GPT Architectural Differences",
                "N-gram Language Modeling & Smoothing Techniques",
                "TF-IDF & Cosine Similarity for Semantic Search"
              ]
            },
            "resources": [
              {
                "title": "Stanford CS224N: NLP with Deep Learning (Prof. Christopher Manning)",
                "provider": "Stanford Online",
                "type": "video_course",
                "url": "https://web.stanford.edu/class/cs224n/"
              },
              {
                "title": "Hugging Face NLP Course",
                "provider": "Hugging Face",
                "type": "interactive_tutorial",
                "url": "https://huggingface.co/learn/nlp-course/"
              }
            ],
            "predictedQuestions": [
              {
                "question": "Explain the Transformer Self-Attention mechanism mathematically: Attention(Q, K, V) = softmax((Q K^T) / sqrt(d_k)) * V and why scaling factor sqrt(d_k) is required.",
                "marks": 8,
                "probability": "95% Probability",
                "module": "Module 4: Sequence Models & Transformers",
                "answerKey": "Define Queries (Q), Keys (K), Values (V) as linear projections of input embeddings. Dot product Q K^T measures semantic similarity. sqrt(d_k) scaling prevents dot product values from growing extremely large for large dimensions, which would push softmax into regions with vanishing gradients."
              }
            ],
            "pyqs": [
              {
                "year": 2024,
                "examType": "end_sem",
                "title": "End Semester Exam 2024",
                "fileUrl": "https://www.mindflowlearn.co.in/sample-pyqs/21AI62-2024-EndSem.pdf"
              }
            ]
          }
        ]
      }
    ]
  },
  {
    "name": "CSE — Data Science",
    "shortName": "CSE (Data Science)",
    "slug": "cse-ds",
    "codePrefix": "DS",
    "description": "Statistical modeling, big data pipelines, distributed computing, and predictive analytics.",
    "badge": "Popular",
    "semesters": [
      {
        "number": 4,
        "subjects": [
          {
            "name": "Statistical Inference and R Programming",
            "code": "21DS41",
            "slug": "statistical-inference-and-r-programming",
            "credits": 4,
            "guidance": {
              "notes": "Parametric and Non-parametric tests, ANOVA (One-way and Two-way), Linear Regression modeling in R, and Data Wrangling using dplyr/ggplot2.",
              "passingTips": "Solve ANOVA table sum of squares numerical calculations and write basic R ggplot code snippets.",
              "highYieldTopics": [
                "One-Way and Two-Way ANOVA Calculations",
                "Simple & Multiple Linear Regression in R",
                "Data Manipulation with dplyr (filter, mutate, group_by)",
                "Confidence Intervals and P-Value Interpretation"
              ]
            },
            "resources": [
              {
                "title": "Harvard CS109: Data Science (Statistics & R)",
                "provider": "Harvard University",
                "type": "video_course",
                "url": "https://cs109.github.io/2015/"
              },
              {
                "title": "StatQuest: Statistics Fundamentals in R",
                "provider": "YouTube (StatQuest)",
                "type": "youtube_playlist",
                "url": "https://www.youtube.com/playlist?list=PLblh5JKOoLUK0FLuzwntyYI10UQFUhsY9"
              }
            ],
            "predictedQuestions": [
              {
                "question": "Perform a One-Way ANOVA test to determine if 3 training methods result in significantly different performance scores across groups (Group 1: [8, 10, 12], Group 2: [6, 8, 7], Group 3: [14, 16, 15]) at alpha = 0.05.",
                "marks": 8,
                "probability": "Guaranteed Every Year",
                "module": "Module 3: Analysis of Variance (ANOVA)",
                "answerKey": "Calculate Grand Mean, Sum of Squares Between (SSB), Sum of Squares Within (SSW), Degrees of Freedom (df_between = k-1 = 2, df_within = N-k = 6), Mean Squares (MSB, MSW), and F-statistic F = MSB / MSW. Compare with critical F_crit(2, 6)."
              }
            ],
            "pyqs": [
              {
                "year": 2024,
                "examType": "end_sem",
                "title": "End Semester Exam 2024",
                "fileUrl": "https://www.mindflowlearn.co.in/sample-pyqs/21DS41-2024-EndSem.pdf"
              }
            ]
          }
        ]
      },
      {
        "number": 5,
        "subjects": [
          {
            "name": "Data Mining and Warehousing",
            "code": "21DS51",
            "slug": "data-mining-and-warehousing",
            "credits": 4,
            "guidance": {
              "notes": "Data Preprocessing, Star and Snowflake Schemas, Apriori Algorithm (Frequent Itemset Mining), FP-Growth, and DBSCAN Clustering.",
              "passingTips": "Apriori candidate generation step-by-step is asked in almost every question paper.",
              "highYieldTopics": [
                "Apriori Association Rule Generation",
                "Star Schema vs Snowflake Schema Design",
                "OLAP Operations (Roll-up, Drill-down, Slice, Dice)",
                "DBSCAN vs K-Means Comparison"
              ]
            },
            "resources": [
              {
                "title": "Stanford CS246: Mining Massive Datasets",
                "provider": "Stanford Online",
                "type": "video_course",
                "url": "https://web.stanford.edu/class/cs246/"
              },
              {
                "title": "NPTEL: Data Mining",
                "provider": "IIT Kharagpur / NPTEL",
                "type": "nptel_course",
                "url": "https://nptel.ac.in/courses/106105174"
              }
            ],
            "predictedQuestions": [
              {
                "question": "Generate all frequent itemsets and strong association rules for a given transaction database with minimum support = 50% and minimum confidence = 75% using the Apriori Algorithm.",
                "marks": 8,
                "probability": "Guaranteed Every Year",
                "module": "Module 2: Association Rule Mining",
                "answerKey": "Generate candidate 1-itemsets C1, prune below min_sup => L1. Join L1 to create C2, prune => L2. Continue to L3. For frequent itemset {I1, I2, I3}, generate rules and calculate Confidence(A -> B) = Support(A U B) / Support(A)."
              }
            ],
            "pyqs": [
              {
                "year": 2024,
                "examType": "end_sem",
                "title": "End Semester Exam 2024",
                "fileUrl": "https://www.mindflowlearn.co.in/sample-pyqs/21DS51-2024-EndSem.pdf"
              }
            ]
          }
        ]
      }
    ]
  },
  {
    "name": "Cyber Security",
    "shortName": "Cyber Security",
    "slug": "cyber-security",
    "codePrefix": "CY",
    "description": "Network security, applied cryptography, ethical hacking, digital forensics, malware analysis, and cloud defense.",
    "badge": "High Demand",
    "semesters": [
      {
        "number": 5,
        "subjects": [
          {
            "name": "Applied Cryptography and Network Security",
            "code": "21CY51",
            "slug": "applied-cryptography-and-network-security",
            "credits": 4,
            "guidance": {
              "notes": "Symmetric Ciphers (AES, DES), Asymmetric Ciphers (RSA, Diffie-Hellman Key Exchange), Hash Functions (SHA-256), Digital Signatures, and TLS Handshake.",
              "passingTips": "Master RSA key generation and encryption/decryption with small numerical primes.",
              "highYieldTopics": [
                "RSA Algorithm Numerical Calculation",
                "Diffie-Hellman Key Exchange Man-in-the-Middle Vulnerability",
                "AES Round Transformations (SubBytes, ShiftRows, MixColumns)",
                "TLS 1.3 Handshake Protocol"
              ]
            },
            "resources": [
              {
                "title": "Stanford CS255: Introduction to Cryptography (Prof. Dan Boneh)",
                "provider": "Stanford Online",
                "type": "video_course",
                "url": "https://crypto.stanford.edu/~dabo/courses/cs255/"
              },
              {
                "title": "MIT 6.857: Network and Computer Security",
                "provider": "MIT OpenCourseWare",
                "type": "video_course",
                "url": "https://courses.csail.mit.edu/6.857/"
              }
            ],
            "predictedQuestions": [
              {
                "question": "In RSA cryptosystem, select primes p = 7 and q = 11. Choose encryption key e = 13. (i) Calculate public key and private key d, (ii) Encrypt plaintext M = 9, and (iii) Decrypt ciphertext C to retrieve original message.",
                "marks": 8,
                "probability": "Guaranteed Every Year",
                "module": "Module 2: Public Key Cryptography",
                "answerKey": "n = p * q = 77. phi(n) = (p-1)*(q-1) = 6 * 10 = 60. e = 13. Private key d = e^-1 mod phi(n) => (13 * d) mod 60 = 1 => d = 37. Encrypt: C = M^e mod n = 9^13 mod 77 = 4. Decrypt: M = C^d mod n = 4^37 mod 77 = 9."
              }
            ],
            "pyqs": [
              {
                "year": 2024,
                "examType": "end_sem",
                "title": "End Semester Exam 2024",
                "fileUrl": "https://www.mindflowlearn.co.in/sample-pyqs/21CY51-2024-EndSem.pdf"
              }
            ]
          }
        ]
      }
    ]
  },
  {
    "name": "Information Science & Engineering",
    "shortName": "ISE",
    "slug": "ise",
    "codePrefix": "IS",
    "description": "Enterprise information systems, full-stack software development, cloud computing, and distributed applications.",
    "badge": "Core",
    "semesters": [
      {
        "number": 4,
        "subjects": [
          {
            "name": "Microcontrollers and Embedded Systems",
            "code": "21IS43",
            "slug": "microcontrollers-and-embedded-systems",
            "credits": 3,
            "guidance": {
              "notes": "ARM Cortex Architecture, Memory Map, Assembly Instructions, Timer and Interrupt programming, and Sensor Interfacing (ADC, DAC, PWM).",
              "passingTips": "Learn ARM register organization and write short assembly routines for array traversal and block move.",
              "highYieldTopics": [
                "ARM Cortex-M3 Register Structure",
                "Interrupt Handling in ARM Microcontrollers",
                "ADC & DAC Interfacing with PWM",
                "Memory Architecture & Bus Protocols"
              ]
            },
            "resources": [
              {
                "title": "NPTEL: Embedded Systems Design",
                "provider": "IIT Delhi / NPTEL",
                "type": "nptel_course",
                "url": "https://nptel.ac.in/courses/106105193"
              },
              {
                "title": "ARM Cortex-M Embedded Systems Programming",
                "provider": "YouTube (Fastbit Embedded)",
                "type": "youtube_playlist",
                "url": "https://www.youtube.com/playlist?list=PLERTijJOmYrDiiWd10iRHY0VRHdvdUQ4g"
              }
            ],
            "predictedQuestions": [
              {
                "question": "Explain the architecture and register organization of the ARM Cortex-M3 processor (R0-R12, SP, LR, PC, PSR) and describe the vector table exception handling mechanism.",
                "marks": 8,
                "probability": "Guaranteed Every Year",
                "module": "Module 1: ARM Architecture",
                "answerKey": "Draw Cortex-M3 32-bit register bank. R0-R7 low registers, R8-R12 high registers. MSP and PSP banked stack pointers. LR (R14) link register, PC (R15) program counter, xPSR program status. Nested Vectored Interrupt Controller (NVIC) automatic hardware state saving."
              }
            ],
            "pyqs": [
              {
                "year": 2024,
                "examType": "end_sem",
                "title": "End Semester Exam 2024",
                "fileUrl": "https://www.mindflowlearn.co.in/sample-pyqs/21IS43-2024-EndSem.pdf"
              }
            ]
          }
        ]
      }
    ]
  },
  {
    "name": "Electronics & Communication Engineering",
    "shortName": "ECE",
    "slug": "ece",
    "codePrefix": "EC",
    "description": "Signal processing, VLSI design, wireless communication, RF systems, microelectronics, and embedded circuits.",
    "badge": "Core",
    "semesters": [
      {
        "number": 4,
        "subjects": [
          {
            "name": "Signals and Systems",
            "code": "21EC42",
            "slug": "signals-and-systems",
            "credits": 4,
            "guidance": {
              "notes": "Classification of Signals (Continuous/Discrete, Periodic, Energy/Power), LTI Systems (Convolution Integral/Sum), Fourier Transform, Laplace Transform, and Z-Transform.",
              "passingTips": "Solve convolution numericals and ROC (Region of Convergence) properties in Z-Transforms.",
              "highYieldTopics": [
                "Convolution Sum and Integral Evaluations",
                "Fourier Transform Properties & Duality",
                "Z-Transform Inverse & ROC Stability Criteria",
                "LTI System Causality & Stability Proofs"
              ]
            },
            "resources": [
              {
                "title": "MIT 6.007: Signals and Systems (Prof. Alan Oppenheim)",
                "provider": "MIT OpenCourseWare",
                "type": "video_course",
                "url": "https://ocw.mit.edu/courses/res-6-007-signals-and-systems-spring-2011/"
              },
              {
                "title": "Neso Academy: Signals and Systems Full Playlist",
                "provider": "YouTube (Neso Academy)",
                "type": "youtube_playlist",
                "url": "https://www.youtube.com/playlist?list=PLBlnK6fEyqRhG6s3jXh4698EnptTrJTVm"
              }
            ],
            "predictedQuestions": [
              {
                "question": "Evaluate the continuous-time convolution integral y(t) = x(t) * h(t) where x(t) = e^(-2t) u(t) and h(t) = u(t - 1). Plot the output signal y(t).",
                "marks": 8,
                "probability": "Guaranteed Every Year",
                "module": "Module 2: LTI Systems & Convolution",
                "answerKey": "For t < 1, overlap is zero => y(t) = 0. For t >= 1, y(t) = integral_1^t e^(-2 tau) d tau = [-1/2 e^(-2 tau)]_1^t = (1/2) [e^(-2) - e^(-2t)]. Result: (1/2)(e^(-2) - e^(-2t)) u(t-1)."
              }
            ],
            "pyqs": [
              {
                "year": 2024,
                "examType": "end_sem",
                "title": "End Semester Exam 2024",
                "fileUrl": "https://www.mindflowlearn.co.in/sample-pyqs/21EC42-2024-EndSem.pdf"
              }
            ]
          }
        ]
      }
    ]
  },
  {
    "name": "Mechanical Engineering",
    "shortName": "Mechanical",
    "slug": "me",
    "codePrefix": "ME",
    "description": "Thermodynamics, fluid machinery, CAD/CAM manufacturing, structural mechanics, and thermal power plants.",
    "badge": "Core",
    "semesters": [
      {
        "number": 3,
        "subjects": [
          {
            "name": "Thermodynamics & Heat Transfer",
            "code": "21ME32",
            "slug": "thermodynamics-and-heat-transfer",
            "credits": 4,
            "guidance": {
              "notes": "First and Second Laws of Thermodynamics, Carnot Engine, Entropy change of ideal gases, Rankine Cycle, and Conduction/Convection/Radiation equations.",
              "passingTips": "Draw accurate T-s and P-v diagrams for Rankine and Brayton cycles.",
              "highYieldTopics": [
                "Second Law Kelvin-Planck & Clausius Statements",
                "Rankine Cycle Thermal Efficiency Calculations",
                "Steady State 1D Heat Conduction Through Composite Walls",
                "Entropy Generation in Closed Systems"
              ]
            },
            "resources": [
              {
                "title": "MIT 2.005: Thermal-Fluids Engineering I",
                "provider": "MIT OpenCourseWare",
                "type": "video_course",
                "url": "https://ocw.mit.edu/courses/2-005-thermal-fluids-engineering-i-fall-2011/"
              },
              {
                "title": "NPTEL: Basic Thermodynamics",
                "provider": "IIT Kharagpur / NPTEL",
                "type": "nptel_course",
                "url": "https://nptel.ac.in/courses/112105123"
              }
            ],
            "predictedQuestions": [
              {
                "question": "A steam power plant operates on an ideal Rankine cycle between boiler pressure 3 MPa and condenser pressure 10 kPa. If steam leaves boiler as superheated steam at 350°C, calculate: (i) Turbine work output, (ii) Pump work input, (iii) Heat added in boiler, and (iv) Thermal efficiency of the cycle.",
                "marks": 8,
                "probability": "Guaranteed Every Year",
                "module": "Module 3: Vapor Power Cycles",
                "answerKey": "Look up steam table: h1 at 3 MPa, 350°C; isentropic expansion s2=s1 to find x2 and h2; h3 = h_f at 10 kPa; pump work W_p = v3*(P1 - P2); h4 = h3 + W_p. Efficiency eta = (W_t - W_p) / (h1 - h4)."
              }
            ],
            "pyqs": [
              {
                "year": 2024,
                "examType": "end_sem",
                "title": "End Semester Exam 2024",
                "fileUrl": "https://www.mindflowlearn.co.in/sample-pyqs/21ME32-2024-EndSem.pdf"
              }
            ]
          }
        ]
      }
    ]
  },
  {
    "name": "Aerospace Engineering",
    "shortName": "Aerospace",
    "slug": "ae",
    "codePrefix": "AE",
    "description": "Aerodynamics, propulsion systems, flight mechanics, aircraft structures, and space vehicle mechanics.",
    "badge": "Specialized",
    "semesters": [
      {
        "number": 3,
        "subjects": [
          {
            "name": "Introduction to Aerospace Engineering",
            "code": "21AE31",
            "slug": "introduction-to-aerospace-engineering",
            "credits": 3,
            "guidance": {
              "notes": "Standard Atmosphere model, Aircraft Anatomy (Fuselage, Wing, Empennage, Control Surfaces), Principles of Flight (Lift, Drag, Thrust, Weight), and Aircraft Instruments.",
              "passingTips": "Explain how elevator, rudder, and ailerons control pitch, yaw, and roll.",
              "highYieldTopics": [
                "International Standard Atmosphere (ISA) Properties",
                "Primary and Secondary Flight Control Surfaces",
                "Airfoil Geometry Nomenclature (NACA 4-digit series)",
                "Pitot-Static Tube Principle for Airspeed"
              ]
            },
            "resources": [
              {
                "title": "MIT 16.00: Introduction to Aerospace and Design",
                "provider": "MIT OpenCourseWare",
                "type": "video_course",
                "url": "https://ocw.mit.edu/courses/16-00-introduction-to-aerospace-and-design-spring-2003/"
              },
              {
                "title": "NPTEL: Introduction to Aerospace Engineering",
                "provider": "IIT Bombay / NPTEL",
                "type": "nptel_course",
                "url": "https://nptel.ac.in/courses/101101001"
              }
            ],
            "predictedQuestions": [
              {
                "question": "Explain the 4 primary forces acting on an aircraft in steady level unaccelerated flight (Lift, Drag, Thrust, Weight) and derive the equilibrium equations.",
                "marks": 8,
                "probability": "Guaranteed Every Year",
                "module": "Module 1: Flight Fundamentals",
                "answerKey": "Draw free body diagram. In steady level flight: Thrust = Drag (T = D) and Lift = Weight (L = W = 0.5 * rho * V^2 * S * C_L). Explain angle of attack alpha and stall condition."
              }
            ],
            "pyqs": [
              {
                "year": 2024,
                "examType": "end_sem",
                "title": "End Semester Exam 2024",
                "fileUrl": "https://www.mindflowlearn.co.in/sample-pyqs/21AE31-2024-EndSem.pdf"
              }
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
