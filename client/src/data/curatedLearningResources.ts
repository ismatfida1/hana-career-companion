export type CuratedLink = { title: string; url: string };
const v = (title: string, url: string): CuratedLink => ({ title, url });
const b = (title: string, url: string): CuratedLink => ({ title, url });
export const curatedVideos: Record<string, CuratedLink> = {
  python: v("Python for Beginners — freeCodeCamp", "https://www.youtube.com/watch?v=rfscVS0vtbw"),
  javascript: v("Learn JavaScript — freeCodeCamp", "https://www.youtube.com/watch?v=PkZNo7MFNFg"),
  sql: v("SQL Tutorial — Full Database Course", "https://www.youtube.com/watch?v=HXV3zeQKqGY"),
  html: v("HTML Full Course — freeCodeCamp", "https://www.youtube.com/watch?v=pQN-pnXPaVg"),
  css: v("CSS Full Course — freeCodeCamp", "https://www.youtube.com/watch?v=1Rs2ND1ryYc"),
  react: v("React Course — freeCodeCamp", "https://www.youtube.com/watch?v=bMknfKXIFA8"),
  git: v("Git and GitHub for Beginners — freeCodeCamp", "https://www.youtube.com/watch?v=RGOj5yH7evk"),
};
export const curatedBooks: Record<string, CuratedLink> = {
  python: b("Automate the Boring Stuff with Python", "https://automatetheboringstuff.com/"),
  javascript: b("Eloquent JavaScript", "https://eloquentjavascript.net/"),
  git: b("Pro Git", "https://git-scm.com/book/en/v2"),
  rust: b("The Rust Programming Language", "https://doc.rust-lang.org/book/"),
  html: b("MDN Web Development Curriculum", "https://developer.mozilla.org/en-US/curriculum/"),
  css: b("MDN Web Development Curriculum", "https://developer.mozilla.org/en-US/curriculum/"),
  sql: b("SQL for Web Nerds", "https://philip.greenspun.com/sql/"),
  foundations: b("Teach Yourself Computer Science", "https://teachyourselfcs.com/"),
};
export function curatedVideo(skill: string): CuratedLink | undefined { const key = Object.keys(curatedVideos).find(k => skill.toLowerCase().includes(k)); return key ? curatedVideos[key] : undefined; }
export function curatedBook(skill: string): CuratedLink { const key = Object.keys(curatedBooks).find(k => skill.toLowerCase().includes(k)); return key ? curatedBooks[key] : curatedBooks.foundations; }
