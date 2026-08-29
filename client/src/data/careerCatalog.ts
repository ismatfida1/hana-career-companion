export type CareerPathId =
  | "computer-science"
  | "software-engineering"
  | "ai-ml"
  | "data-science"
  | "cybersecurity"
  | "web-fullstack"
  | "mobile"
  | "cloud-devops"
  | "systems-embedded"
  | "game-development"
  | "ui-ux-product"
  | "qa-testing";

export type CareerSkill = {
  name: string;
  summary: string;
  resources: { title: string; url: string }[];
};

export type CareerPath = {
  id: CareerPathId;
  title: string;
  shortTitle: string;
  description: string;
  roles: string[];
  stages: { world: string; title: string; outcome: string; skills: string[] }[];
  skills: CareerSkill[];
};

const docs = (name: string, url: string, altName: string, altUrl: string) => [
  { title: name, url },
  { title: altName, url: altUrl },
];

export const careerCatalog: CareerPath[] = [
  {
    id: "computer-science",
    title: "Computer Science",
    shortTitle: "CS",
    description: "Build the broad foundations that keep every technical door open.",
    roles: ["Software Engineer", "Systems Engineer", "Backend Engineer", "Research Engineer"],
    stages: [
      { world: "Origin Village", title: "CS Foundations", outcome: "Understand computation, code, Git, and problem solving.", skills: ["Programming", "Algorithms", "Computer systems"] },
      { world: "Code Forge", title: "Data Structures & Algorithms", outcome: "Turn problems into efficient, testable solutions.", skills: ["Data structures", "Algorithms", "Debugging"] },
      { world: "Weblands", title: "Product Building", outcome: "Ship a usable application from interface to API.", skills: ["HTML/CSS", "JavaScript", "REST APIs"] },
      { world: "Cloudspire", title: "Engineering Systems", outcome: "Work with databases, services, testing, and deployment.", skills: ["Databases", "Backend", "Cloud"] },
      { world: "Summit of Builders", title: "Specialize", outcome: "Choose a role and build portfolio evidence around it.", skills: ["Projects", "Open source", "Career evidence"] },
    ],
    skills: [
      { name: "Programming", summary: "Learn one main language deeply before collecting more.", resources: docs("freeCodeCamp", "https://www.freecodecamp.org/learn/", "Exercism", "https://exercism.org/") },
      { name: "Python", summary: "A practical first language for automation, data, and AI.", resources: docs("Python Tutorial", "https://docs.python.org/3/tutorial/", "Exercism Python", "https://exercism.org/tracks/python/") },
      { name: "C/C++", summary: "Useful for systems, performance, embedded, and competitive programming.", resources: docs("LearnCpp", "https://www.learncpp.com/", "GNU C Manual", "https://www.gnu.org/software/gnu-c-manual/") },
      { name: "Java", summary: "Strong general-purpose ecosystem for backend and enterprise systems.", resources: docs("Dev.java Learn", "https://dev.java/learn/", "Oracle Java Docs", "https://docs.oracle.com/en/java/") },
      { name: "Algorithms", summary: "Reason about correctness, complexity, and trade-offs.", resources: docs("VisuAlgo", "https://visualgo.net/en", "HackerRank", "https://www.hackerrank.com/") },
      { name: "Git & GitHub", summary: "Track work, collaborate, and create visible evidence.", resources: docs("Git Book", "https://git-scm.com/book/en/v2", "GitHub Skills", "https://skills.github.com/") },
      { name: "Operating Systems", summary: "Processes, memory, filesystems, concurrency, and system interfaces.", resources: docs("OSTEP", "https://pages.cs.wisc.edu/~remzi/OSTEP/", "MIT OCW", "https://ocw.mit.edu/search/?d=Electrical%20Engineering%20and%20Computer%20Science") },
      { name: "Databases", summary: "Model data and query it reliably.", resources: docs("SQLBolt", "https://sqlbolt.com/", "PostgreSQL Docs", "https://www.postgresql.org/docs/") },
    ],
  },
  {
    id: "software-engineering", title: "Software Engineering", shortTitle: "SWE",
    description: "Design, build, test, ship, and maintain production software.", roles: ["Software Engineer", "Backend Engineer", "Frontend Engineer", "Platform Engineer"],
    stages: [
      { world: "Origin Village", title: "Engineering Foundations", outcome: "Code cleanly and use version control.", skills: ["Programming", "Git", "Testing"] },
      { world: "Code Forge", title: "Application Architecture", outcome: "Break systems into maintainable components.", skills: ["OOP", "APIs", "Design patterns"] },
      { world: "Weblands", title: "Client + Server", outcome: "Build complete applications.", skills: ["React", "Node.js", "REST"] },
      { world: "Cloudspire", title: "Production", outcome: "Deploy reliable applications.", skills: ["Databases", "Docker", "Cloud"] },
      { world: "Summit of Builders", title: "Professional Engineering", outcome: "Show quality through tests, reviews, and real projects.", skills: ["Code review", "CI/CD", "Open source"] },
    ],
    skills: [
      { name: "TypeScript", summary: "Safer large-scale JavaScript development.", resources: docs("TypeScript Handbook", "https://www.typescriptlang.org/docs/handbook/", "TypeScript Playground", "https://www.typescriptlang.org/play/") },
      { name: "React", summary: "Build interactive web interfaces with components.", resources: docs("React Learn", "https://react.dev/learn", "Full Stack Open", "https://fullstackopen.com/en/") },
      { name: "Node.js", summary: "Build server-side JavaScript services.", resources: docs("Node.js Learn", "https://nodejs.org/en/learn", "Node API", "https://nodejs.org/api/") },
      { name: "REST APIs", summary: "Design and consume web APIs.", resources: docs("MDN HTTP", "https://developer.mozilla.org/en-US/docs/Web/HTTP", "Postman Learning", "https://learning.postman.com/") },
      { name: "Testing", summary: "Prove behavior and reduce regressions.", resources: docs("Vitest", "https://vitest.dev/", "Testing Library", "https://testing-library.com/docs/") },
      { name: "Docker", summary: "Package applications consistently across environments.", resources: docs("Docker Docs", "https://docs.docker.com/", "Docker Get Started", "https://docs.docker.com/get-started/") },
      { name: "Code Review", summary: "Improve correctness, readability, and maintainability with peers.", resources: docs("GitHub Pull Requests", "https://docs.github.com/en/pull-requests", "Google Engineering Practices", "https://google.github.io/eng-practices/review/") },
    ],
  },
  {
    id: "ai-ml", title: "AI & Machine Learning", shortTitle: "AI/ML",
    description: "Learn the mathematics, data, models, and engineering needed to build AI systems.", roles: ["ML Engineer", "AI Engineer", "Applied Scientist", "LLM Engineer"],
    stages: [
      { world: "Origin Village", title: "AI Foundations", outcome: "Build Python, math, and data fluency.", skills: ["Python", "Linear algebra", "Statistics"] },
      { world: "Code Forge", title: "Machine Learning", outcome: "Train and evaluate practical models.", skills: ["Supervised learning", "Evaluation", "Feature engineering"] },
      { world: "Weblands", title: "Deep Learning", outcome: "Work with neural networks and modern frameworks.", skills: ["PyTorch", "TensorFlow", "Neural networks"] },
      { world: "Cloudspire", title: "AI Engineering", outcome: "Serve models and integrate AI into products.", skills: ["LLM APIs", "RAG", "Agents"] },
      { world: "Summit of Builders", title: "AI Portfolio", outcome: "Ship an evidence-backed AI product.", skills: ["Evaluation", "MLOps", "Responsible AI"] },
    ],
    skills: [
      { name: "Python for AI", summary: "The core programming language for data and ML workflows.", resources: docs("Python Tutorial", "https://docs.python.org/3/tutorial/", "Kaggle Learn", "https://www.kaggle.com/learn") },
      { name: "Statistics", summary: "Understand uncertainty, distributions, and evaluation.", resources: docs("Khan Academy Statistics", "https://www.khanacademy.org/math/statistics-probability", "OpenIntro", "https://www.openintro.org/") },
      { name: "Machine Learning", summary: "Learn models, validation, and trade-offs.", resources: docs("scikit-learn", "https://scikit-learn.org/stable/user_guide.html", "Google ML Crash Course", "https://developers.google.com/machine-learning/crash-course") },
      { name: "Deep Learning", summary: "Learn neural networks and representation learning.", resources: docs("PyTorch Tutorials", "https://pytorch.org/tutorials/", "TensorFlow Tutorials", "https://www.tensorflow.org/tutorials") },
      { name: "LLM Engineering", summary: "Use models through APIs, structured outputs, evaluation, and safety practices.", resources: docs("Hugging Face Learn", "https://huggingface.co/learn", "OpenAI Developers", "https://developers.openai.com/") },
      { name: "AI Agents", summary: "Build tool-using systems with clear boundaries and evaluation.", resources: docs("Hugging Face Agents", "https://huggingface.co/learn/agents-course/", "LlamaIndex", "https://docs.llamaindex.ai/") },
      { name: "Prompt Engineering", summary: "Design prompts systematically instead of relying on guesswork.", resources: docs("OpenAI Prompt Engineering", "https://platform.openai.com/docs/guides/prompt-engineering", "Anthropic Prompting", "https://docs.anthropic.com/en/docs/build-with-claude/prompt-engineering/overview") },
    ],
  },
  {
    id: "data-science", title: "Data Science", shortTitle: "Data",
    description: "Turn messy data into analysis, experiments, and decisions.", roles: ["Data Scientist", "Data Analyst", "Analytics Engineer", "Research Analyst"],
    stages: [
      { world: "Origin Village", title: "Data Foundations", outcome: "Become fluent with Python, SQL, and statistics.", skills: ["Python", "SQL", "Statistics"] },
      { world: "Code Forge", title: "Analysis", outcome: "Clean, explore, and communicate data.", skills: ["Pandas", "Visualization", "EDA"] },
      { world: "Weblands", title: "Modeling", outcome: "Build predictive models responsibly.", skills: ["ML", "Feature engineering", "Evaluation"] },
      { world: "Cloudspire", title: "Data Systems", outcome: "Build reliable data workflows.", skills: ["Pipelines", "Warehousing", "APIs"] },
      { world: "Summit of Builders", title: "Decision Impact", outcome: "Show clear evidence and business or research impact.", skills: ["Experiments", "Communication", "Portfolio"] },
    ],
    skills: [
      { name: "SQL", summary: "Query, join, aggregate, and reason about relational data.", resources: docs("SQLBolt", "https://sqlbolt.com/", "SQLZoo", "https://sqlzoo.net/") },
      { name: "Pandas", summary: "Transform and analyze tabular data in Python.", resources: docs("Pandas Docs", "https://pandas.pydata.org/docs/", "Kaggle Learn", "https://www.kaggle.com/learn") },
      { name: "NumPy", summary: "Work efficiently with numerical arrays.", resources: docs("NumPy Docs", "https://numpy.org/doc/", "NumPy Learn", "https://numpy.org/learn/") },
      { name: "Data Visualization", summary: "Communicate patterns honestly and clearly.", resources: docs("Matplotlib", "https://matplotlib.org/stable/", "Datawrapper Academy", "https://academy.datawrapper.de/") },
      { name: "Statistics", summary: "Make sound inferences from limited data.", resources: docs("OpenIntro", "https://www.openintro.org/", "Khan Academy", "https://www.khanacademy.org/math/statistics-probability") },
      { name: "Machine Learning", summary: "Move from descriptive analysis to prediction.", resources: docs("scikit-learn", "https://scikit-learn.org/stable/user_guide.html", "Google ML Crash Course", "https://developers.google.com/machine-learning/crash-course") },
    ],
  },
  {
    id: "cybersecurity", title: "Cybersecurity", shortTitle: "Cyber",
    description: "Learn how systems fail, how attacks work, and how to build safer software.", roles: ["Security Analyst", "Application Security Engineer", "Security Engineer", "Blue Team Analyst"],
    stages: [
      { world: "Origin Village", title: "Security Foundations", outcome: "Learn Linux, networking, and security concepts.", skills: ["Linux", "Networking", "Security basics"] },
      { world: "Code Forge", title: "Defensive Thinking", outcome: "Understand vulnerabilities and hardening.", skills: ["Threat modeling", "OWASP", "Authentication"] },
      { world: "Weblands", title: "Application Security", outcome: "Find and fix common web vulnerabilities in legal labs.", skills: ["Web security", "API security", "Secure coding"] },
      { world: "Cloudspire", title: "Infrastructure Security", outcome: "Secure cloud and networked systems.", skills: ["Cloud security", "IAM", "Logging"] },
      { world: "Summit of Builders", title: "Security Portfolio", outcome: "Document safe lab work, findings, and fixes.", skills: ["Reports", "Detection", "Incident response"] },
    ],
    skills: [
      { name: "Linux", summary: "Operate and troubleshoot systems from the command line.", resources: docs("Linux Journey", "https://linuxjourney.com/", "Linux Docs", "https://docs.kernel.org/") },
      { name: "Networking", summary: "Understand protocols, addressing, routing, and traffic.", resources: docs("Cisco Networking Academy", "https://www.netacad.com/", "Cloudflare Learning", "https://www.cloudflare.com/learning/") },
      { name: "OWASP", summary: "Learn common application risks and secure design.", resources: docs("OWASP Top 10", "https://owasp.org/www-project-top-ten/", "OWASP", "https://owasp.org/") },
      { name: "Web Security", summary: "Practice only in intentionally vulnerable training environments.", resources: docs("PortSwigger Academy", "https://portswigger.net/web-security", "OWASP Web Testing", "https://owasp.org/www-project-web-security-testing-guide/") },
      { name: "Cloud Security", summary: "Protect identities, networks, data, and workloads in cloud systems.", resources: docs("NIST Cybersecurity", "https://www.nist.gov/cybersecurity", "Cloud Security Alliance", "https://cloudsecurityalliance.org/") },
      { name: "Detection & Response", summary: "Understand logs, alerts, triage, and incident workflows.", resources: docs("MITRE ATT&CK", "https://attack.mitre.org/", "NIST Incident Response", "https://csrc.nist.gov/publications/detail/sp/800-61/rev-2/final") },
    ],
  },
  {
    id: "web-fullstack", title: "Web & Full-Stack Development", shortTitle: "Web",
    description: "Go from browser fundamentals to full-stack products.", roles: ["Frontend Engineer", "Full-Stack Engineer", "Backend Engineer", "Web Developer"],
    stages: [
      { world: "Origin Village", title: "Web Foundations", outcome: "Create accessible, responsive pages.", skills: ["HTML", "CSS", "JavaScript"] },
      { world: "Code Forge", title: "Frontend Engineering", outcome: "Build interactive interfaces.", skills: ["TypeScript", "React", "Accessibility"] },
      { world: "Weblands", title: "Backend & APIs", outcome: "Connect apps to real services and data.", skills: ["Node.js", "REST", "Databases"] },
      { world: "Cloudspire", title: "Full-Stack Delivery", outcome: "Deploy a complete product.", skills: ["Auth", "Testing", "Deployment"] },
      { world: "Summit of Builders", title: "Production Web", outcome: "Polish performance and portfolio evidence.", skills: ["Performance", "SEO", "Open source"] },
    ],
    skills: [
      { name: "HTML", summary: "Structure accessible web content.", resources: docs("MDN Learn HTML", "https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Structuring_content", "HTML Standard", "https://html.spec.whatwg.org/") },
      { name: "CSS", summary: "Build responsive layouts and visual systems.", resources: docs("MDN CSS", "https://developer.mozilla.org/en-US/docs/Web/CSS", "Flexbox Froggy", "https://flexboxfroggy.com/") },
      { name: "JavaScript", summary: "Add behavior and interactivity in the browser.", resources: docs("JavaScript.info", "https://javascript.info/", "MDN JavaScript", "https://developer.mozilla.org/en-US/docs/Web/JavaScript") },
      { name: "React", summary: "Build component-driven frontends.", resources: docs("React Learn", "https://react.dev/learn", "Full Stack Open", "https://fullstackopen.com/en/") },
      { name: "APIs", summary: "Design and consume service interfaces.", resources: docs("MDN HTTP", "https://developer.mozilla.org/en-US/docs/Web/HTTP", "OpenAPI", "https://spec.openapis.org/oas/latest.html") },
      { name: "Databases", summary: "Persist application state reliably.", resources: docs("SQLBolt", "https://sqlbolt.com/", "MongoDB Docs", "https://www.mongodb.com/docs/") },
      { name: "Accessibility", summary: "Make interfaces usable by more people.", resources: docs("MDN Accessibility", "https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Accessibility", "WAI", "https://www.w3.org/WAI/") },
    ],
  },
  {
    id: "mobile", title: "Mobile Development", shortTitle: "Mobile",
    description: "Build Android and iOS apps with native or cross-platform tools.", roles: ["Android Developer", "iOS Developer", "Flutter Developer", "Mobile Engineer"],
    stages: [
      { world: "Origin Village", title: "Mobile Foundations", outcome: "Understand app lifecycle and UI basics.", skills: ["Kotlin/Swift", "UI", "Git"] },
      { world: "Code Forge", title: "App Architecture", outcome: "Build navigation, state, and data flows.", skills: ["Architecture", "State", "Networking"] },
      { world: "Weblands", title: "Cross-Platform", outcome: "Ship one codebase across platforms when appropriate.", skills: ["Flutter", "React Native", "Expo"] },
      { world: "Cloudspire", title: "Mobile Backends", outcome: "Connect apps to auth, APIs, and storage.", skills: ["APIs", "Auth", "Databases"] },
      { world: "Summit of Builders", title: "Release", outcome: "Test, optimize, and prepare for real distribution.", skills: ["Testing", "Performance", "App stores"] },
    ],
    skills: [
      { name: "Kotlin", summary: "Modern Android development language.", resources: docs("Kotlin Tour", "https://kotlinlang.org/docs/kotlin-tour-welcome.html", "Kotlin Docs", "https://kotlinlang.org/docs/home.html") },
      { name: "Swift", summary: "Primary language for Apple platform development.", resources: docs("Swift Book", "https://docs.swift.org/swift-book/documentation/the-swift-programming-language/", "Apple Developer", "https://developer.apple.com/") },
      { name: "Flutter", summary: "Cross-platform apps with Dart.", resources: docs("Flutter Learn", "https://docs.flutter.dev/get-started/learn-flutter", "Dart Docs", "https://dart.dev/guides") },
      { name: "React Native", summary: "React-based cross-platform app development.", resources: docs("React Native", "https://reactnative.dev/docs/getting-started", "Expo", "https://docs.expo.dev/") },
    ],
  },
  {
    id: "cloud-devops", title: "Cloud, DevOps & SRE", shortTitle: "Cloud",
    description: "Make software deployable, observable, scalable, and reliable.", roles: ["DevOps Engineer", "Cloud Engineer", "SRE", "Platform Engineer"],
    stages: [
      { world: "Origin Village", title: "Linux & Networking", outcome: "Operate the systems underneath applications.", skills: ["Linux", "Shell", "Networking"] },
      { world: "Code Forge", title: "Automation", outcome: "Automate repeatable infrastructure work.", skills: ["Git", "CI/CD", "Scripting"] },
      { world: "Weblands", title: "Containers & Services", outcome: "Package and connect application services.", skills: ["Docker", "APIs", "Orchestration"] },
      { world: "Cloudspire", title: "Cloud Infrastructure", outcome: "Provision and secure cloud environments.", skills: ["AWS/Azure/GCP", "Terraform", "IAM"] },
      { world: "Summit of Builders", title: "Reliability", outcome: "Measure and improve production reliability.", skills: ["Observability", "Incident response", "SLOs"] },
    ],
    skills: [
      { name: "Linux", summary: "The operational foundation for servers and containers.", resources: docs("Linux Journey", "https://linuxjourney.com/", "Kernel Docs", "https://docs.kernel.org/") },
      { name: "Docker", summary: "Package and run applications consistently.", resources: docs("Docker Docs", "https://docs.docker.com/", "Docker Get Started", "https://docs.docker.com/get-started/") },
      { name: "Kubernetes", summary: "Orchestrate containerized workloads.", resources: docs("Kubernetes Basics", "https://kubernetes.io/docs/tutorials/kubernetes-basics/", "Kubernetes Docs", "https://kubernetes.io/docs/home/") },
      { name: "AWS", summary: "Learn a major cloud platform through small deployed systems.", resources: docs("AWS Skill Builder", "https://skillbuilder.aws/", "AWS Docs", "https://docs.aws.amazon.com/") },
      { name: "Terraform", summary: "Define infrastructure as code.", resources: docs("Terraform Learn", "https://developer.hashicorp.com/terraform/tutorials", "Terraform Docs", "https://developer.hashicorp.com/terraform/docs") },
    ],
  },
  {
    id: "systems-embedded", title: "Systems & Embedded", shortTitle: "Systems",
    description: "Work close to hardware, operating systems, performance, and real-time constraints.", roles: ["Systems Engineer", "Embedded Engineer", "Firmware Engineer", "Performance Engineer"],
    stages: [
      { world: "Origin Village", title: "C & Computer Architecture", outcome: "Understand memory, data representation, and hardware basics.", skills: ["C", "Pointers", "Architecture"] },
      { world: "Code Forge", title: "Systems Programming", outcome: "Build efficient native programs.", skills: ["C++", "Rust", "Concurrency"] },
      { world: "Weblands", title: "Operating Systems", outcome: "Understand processes, memory, and I/O.", skills: ["OS", "Networking", "Filesystems"] },
      { world: "Cloudspire", title: "Embedded Systems", outcome: "Build software for constrained devices.", skills: ["Microcontrollers", "RTOS", "Debugging"] },
      { world: "Summit of Builders", title: "Performance", outcome: "Measure and optimize real systems.", skills: ["Profiling", "Concurrency", "Optimization"] },
    ],
    skills: [
      { name: "C", summary: "Core low-level language for systems and embedded work.", resources: docs("GNU C Manual", "https://www.gnu.org/software/gnu-c-manual/", "Learn C", "https://www.learn-c.org/") },
      { name: "C++", summary: "High-performance systems language with rich abstractions.", resources: docs("LearnCpp", "https://www.learncpp.com/", "C++ Core Guidelines", "https://isocpp.github.io/CppCoreGuidelines/CppCoreGuidelines/") },
      { name: "Rust", summary: "Memory-safe systems programming.", resources: docs("The Rust Book", "https://doc.rust-lang.org/book/", "Rust By Example", "https://doc.rust-lang.org/rust-by-example/") },
      { name: "Computer Architecture", summary: "Understand CPU, memory, storage, and buses.", resources: docs("Nand2Tetris", "https://www.nand2tetris.org/", "CS:APP", "https://csapp.cs.cmu.edu/") },
      { name: "Embedded", summary: "Program devices with hardware-aware constraints.", resources: docs("Arduino Learn", "https://docs.arduino.cc/learn/", "ARM Developer", "https://developer.arm.com/documentation") },
    ],
  },
  {
    id: "game-development", title: "Game Development", shortTitle: "Games",
    description: "Combine programming, graphics, gameplay, tools, and interactive design.", roles: ["Gameplay Programmer", "Engine Programmer", "Technical Designer", "Tools Programmer"],
    stages: [
      { world: "Origin Village", title: "Programming Foundations", outcome: "Write small programs and reason about state.", skills: ["C++/C#", "Math", "Git"] },
      { world: "Code Forge", title: "Game Loops", outcome: "Build movement, input, and state systems.", skills: ["Game loop", "Physics", "Input"] },
      { world: "Weblands", title: "Engine Skills", outcome: "Build a complete small game.", skills: ["Unity", "Godot", "Unreal"] },
      { world: "Cloudspire", title: "Systems & Tools", outcome: "Work with assets, performance, and multiplayer basics.", skills: ["Optimization", "Networking", "Tools"] },
      { world: "Summit of Builders", title: "Release a Portfolio Game", outcome: "Publish a polished, documented game project.", skills: ["Polish", "Playtesting", "Portfolio"] },
    ],
    skills: [
      { name: "C#", summary: "Common language for Unity game development.", resources: docs("C# Docs", "https://learn.microsoft.com/dotnet/csharp/", ".NET Docs", "https://learn.microsoft.com/dotnet/") },
      { name: "C++", summary: "Key language for Unreal and engine programming.", resources: docs("LearnCpp", "https://www.learncpp.com/", "Microsoft C++", "https://learn.microsoft.com/cpp/") },
      { name: "Godot", summary: "Open-source engine with a gentle learning curve.", resources: docs("Godot Docs", "https://docs.godotengine.org/en/stable/", "Godot Learn", "https://godotengine.org/learn/") },
      { name: "Unity", summary: "Popular engine for 2D, 3D, and cross-platform development.", resources: docs("Unity Learn", "https://learn.unity.com/", "Unity Manual", "https://docs.unity3d.com/Manual/index.html") },
      { name: "Unreal", summary: "High-end engine and tooling for 3D projects.", resources: docs("Unreal Learning", "https://dev.epicgames.com/community/unreal-engine/learning", "Unreal Docs", "https://dev.epicgames.com/documentation/en-us/unreal-engine") },
    ],
  },
  {
    id: "ui-ux-product", title: "UI/UX & Product Engineering", shortTitle: "Design",
    description: "Design usable products and bridge design with frontend implementation.", roles: ["Product Designer", "UX Engineer", "UI Designer", "Design Technologist"],
    stages: [
      { world: "Origin Village", title: "Design Foundations", outcome: "Understand users, interfaces, and visual hierarchy.", skills: ["UX", "Visual design", "Research"] },
      { world: "Code Forge", title: "Interaction", outcome: "Design flows, states, and prototypes.", skills: ["Prototyping", "Information architecture", "Usability"] },
      { world: "Weblands", title: "Design Systems", outcome: "Create consistent reusable interfaces.", skills: ["Components", "Accessibility", "Tokens"] },
      { world: "Cloudspire", title: "Design + Code", outcome: "Implement designs and validate them in real products.", skills: ["HTML/CSS", "React", "Testing"] },
      { world: "Summit of Builders", title: "Product Impact", outcome: "Show decisions, evidence, and product outcomes.", skills: ["Case studies", "Analytics", "Communication"] },
    ],
    skills: [
      { name: "UX Research", summary: "Learn to frame problems and gather user evidence.", resources: docs("Nielsen Norman Group", "https://www.nngroup.com/articles/", "Interaction Design Foundation", "https://www.interaction-design.org/literature") },
      { name: "Design Systems", summary: "Build reusable visual and interaction patterns.", resources: docs("Material Design", "https://m3.material.io/", "Apple HIG", "https://developer.apple.com/design/human-interface-guidelines/") },
      { name: "Accessibility", summary: "Design and build inclusive interfaces.", resources: docs("WAI", "https://www.w3.org/WAI/", "WebAIM", "https://webaim.org/") },
      { name: "Frontend Basics", summary: "Learn enough code to collaborate and build real prototypes.", resources: docs("MDN Learn", "https://developer.mozilla.org/en-US/docs/Learn_web_development", "freeCodeCamp", "https://www.freecodecamp.org/learn/") },
    ],
  },
  {
    id: "qa-testing", title: "QA, Testing & Reliability", shortTitle: "QA",
    description: "Build confidence in software through test design, automation, and quality practices.", roles: ["QA Engineer", "Test Automation Engineer", "SDET", "Quality Engineer"],
    stages: [
      { world: "Origin Village", title: "Quality Foundations", outcome: "Understand requirements, risks, and testable behavior.", skills: ["Test design", "Bug reports", "Git"] },
      { world: "Code Forge", title: "Automated Tests", outcome: "Write repeatable unit and integration tests.", skills: ["Unit testing", "Mocks", "Assertions"] },
      { world: "Weblands", title: "UI & API Testing", outcome: "Test complete user journeys and service contracts.", skills: ["Browser testing", "API testing", "Accessibility"] },
      { world: "Cloudspire", title: "CI Quality Gates", outcome: "Run tests continuously and report useful failures.", skills: ["CI", "Coverage", "Flaky tests"] },
      { world: "Summit of Builders", title: "Reliability Practice", outcome: "Use evidence to improve product quality.", skills: ["Regression", "Performance", "Observability"] },
    ],
    skills: [
      { name: "Test Design", summary: "Turn behavior and risk into useful test cases.", resources: docs("ISTQB", "https://www.istqb.org/", "Google Testing Blog", "https://testing.googleblog.com/") },
      { name: "Unit Testing", summary: "Test small pieces of logic quickly.", resources: docs("Vitest", "https://vitest.dev/", "Jest", "https://jestjs.io/docs/getting-started") },
      { name: "API Testing", summary: "Verify service behavior and contracts.", resources: docs("Postman Learning", "https://learning.postman.com/", "OpenAPI", "https://spec.openapis.org/oas/latest.html") },
      { name: "Browser Testing", summary: "Validate real user flows in a browser.", resources: docs("Playwright", "https://playwright.dev/docs/intro", "Cypress", "https://docs.cypress.io/") },
    ],
  },
];

export const defaultCareerPath: CareerPathId = "computer-science";

export function getCareerPath(id: CareerPathId | string | null | undefined): CareerPath {
  return careerCatalog.find(path => path.id === id) ?? careerCatalog[0];
}

export function searchCareerSkills(query: string): { career: CareerPath; skill: CareerSkill }[] {
  const needle = query.trim().toLowerCase();
  if (!needle) return [];
  const result: { career: CareerPath; skill: CareerSkill }[] = [];
  for (const career of careerCatalog) {
    for (const skill of career.skills) {
      if (`${skill.name} ${skill.summary}`.toLowerCase().includes(needle)) result.push({ career, skill });
    }
  }
  return result;
}
