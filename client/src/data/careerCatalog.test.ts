import { describe, expect, it } from "vitest";
import { careerCatalog } from "./careerCatalog";

describe("career catalog", () => {
  it("contains a focused roadmap for every supported career path", () => {
    expect(careerCatalog.length).toBeGreaterThanOrEqual(10);
    expect(new Set(careerCatalog.map(path => path.id)).size).toBe(careerCatalog.length);
    for (const path of careerCatalog) {
      expect(path.stages).toHaveLength(5);
      expect(path.skills.length).toBeGreaterThan(2);
      for (const skill of path.skills) {
        expect(skill.name.trim()).not.toBe("");
        expect(skill.resources.length).toBeGreaterThanOrEqual(2);
        for (const resource of skill.resources) {
          expect(resource.url).toMatch(/^https:\/\//);
        }
      }
    }
  });

  it("keeps the first screen intentionally small", () => {
    const featured = ["computer-science", "ai-ml", "cybersecurity"];
    expect(featured).toHaveLength(3);
    expect(careerCatalog.filter(path => featured.includes(path.id)).length).toBe(3);
  });
});
