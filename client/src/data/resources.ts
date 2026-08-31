export type StepResourceType = "university" | "video" | "book" | "docs" | "course" | "practice" | "alternative";

export interface StepResource { title: string; url: string; type: StepResourceType; isFree: boolean; }

export const stepResources: Record<string, StepResource[]> = {
  "api-foundations": [
    { title: "MDN: Introduction to APIs", url: "https://developer.mozilla.org/en-US/docs/Learn_web_development/Extensions/Server-side/First_steps/Introduction", type: "university", isFree: true },
    { title: "Postman API 101", url: "https://www.youtube.com/@postman", type: "video", isFree: true },
    { title: "Designing Web APIs", url: "https://www.manning.com/books/designing-web-apis", type: "book", isFree: false },
    { title: "MDN Web APIs", url: "https://developer.mozilla.org/en-US/docs/Web/API", type: "docs", isFree: true },
    { title: "freeCodeCamp APIs and Microservices", url: "https://www.freecodecamp.org/learn/back-end-development-and-apis/", type: "course", isFree: true },
    { title: "Postman Learning Center", url: "https://learning.postman.com/", type: "practice", isFree: true },
    { title: "REST API Tutorial", url: "https://restfulapi.net/", type: "alternative", isFree: true },
  ],
  "github-proof": [
    { title: "GitHub Skills", url: "https://skills.github.com/", type: "university", isFree: true },
    { title: "GitHub YouTube", url: "https://www.youtube.com/@GitHub", type: "video", isFree: true },
    { title: "Pro Git", url: "https://git-scm.com/book/en/v2", type: "book", isFree: true },
    { title: "GitHub Docs", url: "https://docs.github.com/en/get-started/start-your-journey", type: "docs", isFree: true },
    { title: "GitHub Skills Courses", url: "https://skills.github.com/", type: "course", isFree: true },
    { title: "First Contributions", url: "https://firstcontributions.github.io/", type: "practice", isFree: true },
    { title: "Good First Issue", url: "https://goodfirstissue.dev/", type: "alternative", isFree: true },
  ],
  "ai-first-project": [
    { title: "Harvard CS50 AI", url: "https://cs50.harvard.edu/ai/", type: "university", isFree: true },
    { title: "OpenAI Developers", url: "https://www.youtube.com/@OpenAIDevs", type: "video", isFree: true },
    { title: "Hands-On Large Language Models", url: "https://www.oreilly.com/library/view/hands-on-large-language/9781098150952/", type: "book", isFree: false },
    { title: "OpenAI API Documentation", url: "https://platform.openai.com/docs/overview", type: "docs", isFree: true },
    { title: "Hugging Face Course", url: "https://huggingface.co/learn/llm-course/chapter1/1", type: "course", isFree: true },
    { title: "Hugging Face Spaces", url: "https://huggingface.co/spaces", type: "practice", isFree: true },
    { title: "Google Machine Learning Crash Course", url: "https://developers.google.com/machine-learning/crash-course", type: "alternative", isFree: true },
  ],
  "cs-foundations": [
    { title: "Harvard CS50x", url: "https://cs50.harvard.edu/x/", type: "university", isFree: true },
    { title: "CS50 lectures", url: "https://www.youtube.com/@cs50", type: "video", isFree: true },
    { title: "Teach Yourself Computer Science", url: "https://teachyourselfcs.com/", type: "book", isFree: true },
    { title: "Python Tutorial", url: "https://docs.python.org/3/tutorial/", type: "docs", isFree: true },
    { title: "freeCodeCamp", url: "https://www.freecodecamp.org/learn/", type: "course", isFree: true },
    { title: "Exercism", url: "https://exercism.org/", type: "practice", isFree: true },
    { title: "MIT OpenCourseWare", url: "https://ocw.mit.edu/", type: "alternative", isFree: true },
  ],
  "data-structures-algorithms": [
    { title: "MIT 6.006 Introduction to Algorithms", url: "https://ocw.mit.edu/courses/6-006-introduction-to-algorithms-fall-2011/", type: "university", isFree: true },
    { title: "MIT 6.006 lectures", url: "https://www.youtube.com/@mitocw", type: "video", isFree: true },
    { title: "Open Data Structures", url: "https://opendatastructures.org/", type: "book", isFree: true },
    { title: "Python Data Structures", url: "https://docs.python.org/3/tutorial/datastructures.html", type: "docs", isFree: true },
    { title: "Khan Academy Algorithms", url: "https://www.khanacademy.org/computing/computer-science/algorithms", type: "course", isFree: true },
    { title: "HackerRank Data Structures", url: "https://www.hackerrank.com/domains/data-structures", type: "practice", isFree: true },
    { title: "VisuAlgo", url: "https://visualgo.net/en", type: "alternative", isFree: true },
  ],
  "product-building": [
    { title: "MDN Learn Web Development", url: "https://developer.mozilla.org/en-US/docs/Learn_web_development", type: "university", isFree: true },
    { title: "freeCodeCamp Web Development", url: "https://www.youtube.com/@freecodecamp", type: "video", isFree: true },
    { title: "Eloquent JavaScript", url: "https://eloquentjavascript.net/", type: "book", isFree: true },
    { title: "MDN Web APIs", url: "https://developer.mozilla.org/en-US/docs/Web/API", type: "docs", isFree: true },
    { title: "The Odin Project", url: "https://www.theodinproject.com/paths", type: "course", isFree: true },
    { title: "Frontend Mentor", url: "https://www.frontendmentor.io/", type: "practice", isFree: true },
    { title: "Full Stack Open", url: "https://fullstackopen.com/en/", type: "alternative", isFree: true },
  ],
  "engineering-systems": [
    { title: "MIT Missing Semester", url: "https://missing.csail.mit.edu/", type: "university", isFree: true },
    { title: "Docker", url: "https://www.youtube.com/@Docker", type: "video", isFree: true },
    { title: "Operating Systems: Three Easy Pieces", url: "https://pages.cs.wisc.edu/~remzi/OSTEP/", type: "book", isFree: true },
    { title: "PostgreSQL Documentation", url: "https://www.postgresql.org/docs/", type: "docs", isFree: true },
    { title: "Full Stack Open", url: "https://fullstackopen.com/en/", type: "course", isFree: true },
    { title: "Docker Get Started", url: "https://docs.docker.com/get-started/", type: "practice", isFree: true },
    { title: "roadmap.sh Backend", url: "https://roadmap.sh/backend", type: "alternative", isFree: true },
  ],
  "specialize": [
    { title: "Harvard CS Advising", url: "https://csadvising.seas.harvard.edu/concentration/requirements/", type: "university", isFree: true },
    { title: "GitHub", url: "https://www.youtube.com/@GitHub", type: "video", isFree: true },
    { title: "Pro Git", url: "https://git-scm.com/book/en/v2", type: "book", isFree: true },
    { title: "GitHub Docs", url: "https://docs.github.com/", type: "docs", isFree: true },
    { title: "GitHub Skills", url: "https://skills.github.com/", type: "course", isFree: true },
    { title: "Good First Issue", url: "https://goodfirstissue.dev/", type: "practice", isFree: true },
    { title: "First Contributions", url: "https://firstcontributions.github.io/", type: "alternative", isFree: true },
  ],
};

export function getStepResources(stepId: string): StepResource[] {
  return stepResources[stepId] ?? [];
}
