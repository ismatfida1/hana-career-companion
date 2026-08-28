export type ResourceRole = "primary" | "documentation" | "practice" | "project" | "evidence" | "advanced";

export type ResourceItem = {
  title: string;
  url: string;
  role: ResourceRole;
};

const r = (title: string, url: string, role: ResourceRole = "documentation"): ResourceItem => ({ title, url, role });

/**
 * User-provided master library. Keep this catalog replaceable: the UI should surface
 * only the focused selections below, not every link for every mission.
 */
export const masterResourceLibrary: Record<string, ResourceItem[]> = {
  foundations: [r("Computer Science Roadmap", "https://roadmap.sh/computer-science/", "primary"), r("Teach Yourself Computer Science", "https://teachyourselfcs.com/", "advanced"), r("OSSU Computer Science", "https://github.com/ossu/computer-science", "project"), r("Harvard CS50", "https://cs50.harvard.edu/x/", "primary"), r("MIT OpenCourseWare", "https://ocw.mit.edu/", "documentation"), r("MIT Computer Science", "https://ocw.mit.edu/search/?d=Electrical%20Engineering%20and%20Computer%20Science", "advanced"), r("freeCodeCamp", "https://www.freecodecamp.org/", "practice")],
  programming: [r("freeCodeCamp Learn", "https://www.freecodecamp.org/learn/", "primary"), r("W3Schools", "https://www.w3schools.com/", "documentation"), r("Programiz", "https://www.programiz.com/", "documentation"), r("GeeksforGeeks", "https://www.geeksforgeeks.org/", "documentation"), r("Exercism", "https://exercism.org/", "practice"), r("HackerRank", "https://www.hackerrank.com/", "practice")],
  c: [r("GNU C Manual", "https://www.gnu.org/software/gnu-c-manual/", "primary"), r("Learn C", "https://www.learn-c.org/", "practice"), r("Programiz C", "https://www.programiz.com/c-programming", "documentation"), r("GeeksforGeeks C", "https://www.geeksforgeeks.org/c/c-programming-language/", "project")],
  cpp: [r("LearnCpp", "https://www.learncpp.com/", "primary"), r("C++ Reference", "https://en.cppreference.com/w/", "documentation"), r("C++ Core Guidelines", "https://isocpp.github.io/CppCoreGuidelines/CppCoreGuidelines/", "advanced"), r("Microsoft C++ Docs", "https://learn.microsoft.com/cpp/", "documentation")],
  java: [r("Oracle Java Docs", "https://docs.oracle.com/en/java/", "documentation"), r("Dev.java Learn", "https://dev.java/learn/", "primary"), r("Java Tutorials", "https://docs.oracle.com/javase/tutorial/", "practice"), r("Baeldung", "https://www.baeldung.com/", "advanced")],
  python: [r("Python Tutorial", "https://docs.python.org/3/tutorial/", "primary"), r("Python Docs", "https://docs.python.org/3/", "documentation"), r("Real Python", "https://realpython.com/", "advanced"), r("freeCodeCamp Python", "https://www.freecodecamp.org/learn/python-v9/", "project"), r("Exercism Python", "https://exercism.org/tracks/python/", "practice")],
  javascript: [r("MDN JavaScript", "https://developer.mozilla.org/en-US/docs/Web/JavaScript", "documentation"), r("JavaScript.info", "https://javascript.info/", "primary"), r("freeCodeCamp JavaScript", "https://www.freecodecamp.org/learn/javascript-v9/", "practice"), r("MDN JavaScript Guide", "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/", "documentation")],
  typescript: [r("TypeScript Handbook", "https://www.typescriptlang.org/docs/handbook/", "primary"), r("TypeScript Docs", "https://www.typescriptlang.org/docs/", "documentation"), r("TypeScript Playground", "https://www.typescriptlang.org/play/", "practice")],
  html: [r("MDN HTML", "https://developer.mozilla.org/en-US/docs/Web/HTML", "documentation"), r("MDN Learn HTML", "https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Structuring_content", "primary"), r("freeCodeCamp Responsive Web Design", "https://www.freecodecamp.org/learn/2022/responsive-web-design/", "project"), r("HTML Standard", "https://html.spec.whatwg.org/", "advanced")],
  css: [r("MDN CSS", "https://developer.mozilla.org/en-US/docs/Web/CSS", "documentation"), r("MDN CSS Layout", "https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/CSS_layout", "primary"), r("CSS-Tricks", "https://css-tricks.com/", "documentation"), r("web.dev CSS", "https://web.dev/learn/css/", "advanced"), r("Flexbox Froggy", "https://flexboxfroggy.com/", "practice"), r("Grid Garden", "https://cssgridgarden.com/", "practice")],
  web: [r("MDN Learn", "https://developer.mozilla.org/en-US/docs/Learn_web_development", "primary"), r("MDN Curriculum", "https://developer.mozilla.org/en-US/curriculum/", "documentation"), r("web.dev", "https://web.dev/", "documentation"), r("freeCodeCamp", "https://www.freecodecamp.org/", "practice"), r("The Odin Project", "https://www.theodinproject.com/", "project"), r("Full Stack Open", "https://fullstackopen.com/en/", "advanced")],
  git: [r("Git Docs", "https://git-scm.com/doc", "documentation"), r("Git Book", "https://git-scm.com/book/en/v2", "primary"), r("Learn Git Branching", "https://learngitbranching.js.org/", "practice"), r("GitHub Skills", "https://skills.github.com/", "project")],
  github: [r("GitHub Docs", "https://docs.github.com/", "documentation"), r("GitHub Skills", "https://skills.github.com/", "practice"), r("GitHub Explore", "https://github.com/explore", "evidence"), r("Student Developer Pack", "https://education.github.com/pack", "advanced")],
  react: [r("React Docs", "https://react.dev/", "documentation"), r("React Learn", "https://react.dev/learn", "primary"), r("MDN React", "https://developer.mozilla.org/en-US/docs/Learn_web_development/Extensions/Client-side_frameworks/React_getting_started", "documentation"), r("Full Stack Open React", "https://fullstackopen.com/en/", "project")],
  node: [r("Node.js Docs", "https://nodejs.org/docs/latest/", "documentation"), r("Node.js Learn", "https://nodejs.org/en/learn", "primary"), r("Node.js API", "https://nodejs.org/api/", "advanced")],
  express: [r("Express Docs", "https://expressjs.com/", "primary"), r("Express API", "https://expressjs.com/en/4x/api.html", "documentation")],
  rest: [r("MDN HTTP", "https://developer.mozilla.org/en-US/docs/Web/HTTP", "documentation"), r("MDN HTTP Overview", "https://developer.mozilla.org/en-US/docs/Web/HTTP/Overview", "primary"), r("REST API Tutorial", "https://restfulapi.net/", "documentation"), r("Postman Learning", "https://learning.postman.com/", "practice"), r("OpenAPI", "https://spec.openapis.org/oas/latest.html", "advanced")],
  graphql: [r("GraphQL Learn", "https://graphql.org/learn/", "primary"), r("GraphQL Spec", "https://spec.graphql.org/", "documentation"), r("Apollo Docs", "https://www.apollographql.com/docs/", "project")],
  databases: [r("SQLBolt", "https://sqlbolt.com/", "primary"), r("SQLZoo", "https://sqlzoo.net/", "practice"), r("PostgreSQL", "https://www.postgresql.org/docs/", "documentation"), r("MySQL", "https://dev.mysql.com/doc/", "documentation"), r("freeCodeCamp SQL", "https://www.freecodecamp.org/learn/relational-databases/", "project")],
  mongodb: [r("MongoDB Docs", "https://www.mongodb.com/docs/", "documentation"), r("MongoDB University", "https://learn.mongodb.com/", "primary"), r("MongoDB Courses", "https://learn.mongodb.com/catalog", "practice")],
  redis: [r("Redis Docs", "https://redis.io/docs/", "documentation"), r("Redis University", "https://university.redis.io/", "primary")],
  spring: [r("Spring Guides", "https://spring.io/guides", "primary"), r("Spring Boot Docs", "https://docs.spring.io/spring-boot/", "documentation"), r("Spring Academy", "https://spring.academy/", "practice")],
  dotnet: [r(".NET Docs", "https://learn.microsoft.com/dotnet/", "documentation"), r("C# Docs", "https://learn.microsoft.com/dotnet/csharp/", "primary"), r("ASP.NET Core", "https://learn.microsoft.com/aspnet/core/", "project"), r("Microsoft Learn", "https://learn.microsoft.com/training/", "practice")],
  php: [r("PHP Docs", "https://www.php.net/docs.php", "primary"), r("PHP Manual", "https://www.php.net/manual/en/", "documentation")],
  laravel: [r("Laravel Docs", "https://laravel.com/docs", "documentation"), r("Laravel Learn", "https://laravel.com/learn", "primary")],
  django: [r("Django Docs", "https://docs.djangoproject.com/", "documentation"), r("Django Tutorial", "https://docs.djangoproject.com/en/stable/intro/tutorial/", "primary")],
  ruby: [r("Ruby Docs", "https://www.ruby-lang.org/en/documentation/", "documentation"), r("Ruby Guides", "https://www.rubyguides.com/", "primary")],
  rails: [r("Rails Guides", "https://guides.rubyonrails.org/", "primary"), r("Rails", "https://rubyonrails.org/", "documentation")],
  go: [r("Go Docs", "https://go.dev/doc/", "documentation"), r("A Tour of Go", "https://go.dev/tour/", "primary"), r("Go by Example", "https://gobyexample.com/", "practice")],
  rust: [r("The Rust Book", "https://doc.rust-lang.org/book/", "primary"), r("Rust By Example", "https://doc.rust-lang.org/rust-by-example/", "practice"), r("Rust Learn", "https://www.rust-lang.org/learn", "documentation")],
  kotlin: [r("Kotlin Docs", "https://kotlinlang.org/docs/home.html", "documentation"), r("Kotlin Tour", "https://kotlinlang.org/docs/kotlin-tour-welcome.html", "primary")],
  swift: [r("Swift Docs", "https://www.swift.org/documentation/", "documentation"), r("Swift Book", "https://docs.swift.org/swift-book/documentation/the-swift-programming-language/", "primary"), r("Apple Developer", "https://developer.apple.com/", "project")],
  flutter: [r("Flutter Docs", "https://docs.flutter.dev/", "documentation"), r("Flutter Learn", "https://docs.flutter.dev/get-started/learn-flutter", "primary"), r("Dart Docs", "https://dart.dev/guides", "practice")],
  reactNative: [r("React Native", "https://reactnative.dev/docs/getting-started", "primary"), r("Expo", "https://docs.expo.dev/", "documentation")],
  tensorflow: [r("TensorFlow Tutorials", "https://www.tensorflow.org/tutorials", "primary"), r("TensorFlow Docs", "https://www.tensorflow.org/", "documentation")],
  dataScience: [r("Kaggle", "https://www.kaggle.com/", "project"), r("Kaggle Learn", "https://www.kaggle.com/learn", "primary"), r("Pandas", "https://pandas.pydata.org/docs/", "documentation"), r("NumPy", "https://numpy.org/doc/", "documentation"), r("Matplotlib", "https://matplotlib.org/stable/", "practice")],
  aiEngineering: [r("Hugging Face", "https://huggingface.co/", "project"), r("Hugging Face Learn", "https://huggingface.co/learn", "primary"), r("OpenAI Developers", "https://developers.openai.com/", "documentation"), r("Google AI Developers", "https://ai.google.dev/", "documentation"), r("Anthropic Docs", "https://docs.anthropic.com/", "documentation")],
  agents: [r("Hugging Face Agents", "https://huggingface.co/learn/agents-course/", "primary"), r("LangChain", "https://python.langchain.com/docs/", "documentation"), r("LlamaIndex", "https://docs.llamaindex.ai/", "project"), r("Microsoft AI", "https://learn.microsoft.com/azure/ai-services/", "documentation")],
  prompting: [r("OpenAI Prompt Engineering", "https://platform.openai.com/docs/guides/prompt-engineering", "primary"), r("Anthropic Prompt Engineering", "https://docs.anthropic.com/en/docs/build-with-claude/prompt-engineering/overview", "documentation"), r("Google Prompt Design", "https://ai.google.dev/gemini-api/docs/prompting-intro", "practice")],
  cybersecurity: [r("OWASP", "https://owasp.org/", "documentation"), r("OWASP Top 10", "https://owasp.org/www-project-top-ten/", "primary"), r("PortSwigger Web Security Academy", "https://portswigger.net/web-security", "practice"), r("NIST Cybersecurity", "https://www.nist.gov/cybersecurity", "documentation"), r("Cisco Networking Academy", "https://www.netacad.com/", "project")],
  elasticsearch: [r("Elastic Docs", "https://www.elastic.co/docs", "documentation"), r("Elastic Training", "https://www.elastic.co/training/", "primary")],
  wordpress: [r("WordPress Developer Resources", "https://developer.wordpress.org/", "primary"), r("WordPress Learn", "https://learn.wordpress.org/", "practice")],
  design: [r("Material Design", "https://m3.material.io/", "primary"), r("Apple HIG", "https://developer.apple.com/design/human-interface-guidelines/", "documentation"), r("web.dev", "https://web.dev/", "practice"), r("MDN Design for Developers", "https://developer.mozilla.org/en-US/docs/Learn_web_development/Getting_started/Soft_skills/Design_for_developers", "documentation")],
  accessibility: [r("MDN Accessibility", "https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Accessibility", "primary"), r("WAI", "https://www.w3.org/WAI/", "documentation"), r("WebAIM", "https://webaim.org/", "practice")],
  performance: [r("web.dev", "https://web.dev/", "primary"), r("Chrome DevTools", "https://developer.chrome.com/docs/devtools/", "practice"), r("MDN Performance", "https://developer.mozilla.org/en-US/docs/Web/Performance", "documentation")],
  openSource: [r("GitHub Explore", "https://github.com/explore", "evidence"), r("GitHub Topics", "https://github.com/topics", "evidence"), r("Good First Issue", "https://goodfirstissue.dev/", "project"), r("First Contributions", "https://firstcontributions.github.io/", "practice"), r("Up For Grabs", "https://up-for-grabs.net/", "project")],
  projectPractice: [r("Frontend Mentor", "https://www.frontendmentor.io/", "project"), r("The Odin Project", "https://www.theodinproject.com/", "primary"), r("Full Stack Open", "https://fullstackopen.com/", "advanced"), r("freeCodeCamp", "https://www.freecodecamp.org/learn/", "practice"), r("roadmap.sh", "https://roadmap.sh/", "documentation")],
  codingPractice: [r("LeetCode", "https://leetcode.com/", "practice"), r("HackerRank", "https://www.hackerrank.com/", "practice"), r("Codewars", "https://www.codewars.com/", "practice"), r("Exercism", "https://exercism.org/", "practice"), r("Codeforces", "https://codeforces.com/", "advanced"), r("AtCoder", "https://atcoder.jp/", "advanced")],
  hackathons: [r("Devpost", "https://devpost.com/", "project"), r("MLH", "https://mlh.io/", "primary"), r("MLH Events", "https://events.mlh.io/", "project"), r("Hack Club", "https://hackclub.com/", "project")],
  documentation: [r("MDN", "https://developer.mozilla.org/", "primary"), r("GitHub", "https://github.com/", "evidence"), r("Stack Overflow", "https://stackoverflow.com/", "practice"), r("Google", "https://www.google.com/", "documentation")],
  career: [r("GitHub", "https://github.com/", "evidence"), r("LinkedIn", "https://www.linkedin.com/", "evidence"), r("GitHub Student Developer Pack", "https://education.github.com/pack", "advanced"), r("roadmap.sh", "https://roadmap.sh/", "primary"), r("Frontend Mentor", "https://www.frontendmentor.io/", "project")],
  communication: [r("British Council", "https://learnenglish.britishcouncil.org/", "primary"), r("Cambridge English", "https://www.cambridgeenglish.org/learning-english/", "documentation"), r("freeCodeCamp", "https://www.freecodecamp.org/", "practice")],
  masterRoadmaps: [r("roadmap.sh", "https://roadmap.sh/", "primary"), r("Computer Science", "https://roadmap.sh/computer-science/", "documentation"), r("Frontend", "https://roadmap.sh/frontend/", "documentation"), r("Backend", "https://roadmap.sh/backend/", "documentation"), r("DevOps", "https://roadmap.sh/devops/", "documentation"), r("AI/Data Science", "https://roadmap.sh/ai-data-scientist/", "documentation"), r("Cyber Security", "https://roadmap.sh/cyber-security/", "documentation"), r("Software Architect", "https://roadmap.sh/software-architect/", "advanced"), r("GitHub", "https://github.com/", "evidence")],
};

const pick = (keys: string[], topic: string): ResourceItem[] => {
  const items = keys.flatMap(key => masterResourceLibrary[key] ?? []);
  const first = (role: ResourceRole) => items.find(item => item.role === role);
  const selected = [first("primary"), first("practice"), first("project")].filter((item): item is ResourceItem => Boolean(item));
  return selected.length ? selected : items.slice(0, 3);
};

/** Focused sets shown by the active fantasy Roadmap worlds. */
export const roadmapResourceSelections = {
  spark: pick(["foundations", "programming", "python", "git"], "foundations"),
  logic: pick(["javascript", "typescript", "git"], "programming"),
  loop: pick(["codingPractice", "programming", "python"], "practice"),
  algorithm: pick(["rest", "web", "node", "express"], "web"),
};
