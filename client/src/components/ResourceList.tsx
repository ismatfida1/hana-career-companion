import { BookOpen, ExternalLink, FileText, GraduationCap, Play, Wrench } from "lucide-react";
import { getStepResources, type StepResourceType } from "@/data/resources";

const labels: Record<StepResourceType, string> = {
  university: "University",
  video: "YouTube",
  book: "Book",
  docs: "Docs",
  course: "Course",
  practice: "Practice",
  alternative: "Alternative",
};

const icons: Record<StepResourceType, typeof BookOpen> = {
  university: GraduationCap,
  video: Play,
  book: BookOpen,
  docs: FileText,
  course: BookOpen,
  practice: Wrench,
  alternative: ExternalLink,
};

export function ResourceList({ stepId }: { stepId: string }) {
  const resources = getStepResources(stepId);
  if (!resources.length) return <p className="text-sm text-white/45">Resources for this quest are being curated.</p>;
  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {resources.map(resource => {
        const Icon = icons[resource.type];
        return (
          <a key={`${resource.type}-${resource.url}`} href={resource.url} target="_blank" rel="noopener noreferrer" className="group rounded-2xl border border-white/10 bg-[#132434]/80 p-4 transition hover:-translate-y-0.5 hover:border-[#f1c77b]/40">
            <div className="flex items-center justify-between gap-2 text-xs font-bold uppercase tracking-wide text-[#f1c77b]"><span className="flex items-center gap-2"><Icon className="h-4 w-4" />{labels[resource.type]}</span><span className="rounded-full border border-white/10 px-2 py-1 text-[10px] text-white/45">{resource.isFree ? "Free" : "Paid"}</span></div>
            <p className="mt-3 text-sm font-semibold text-white group-hover:text-[#f1c77b]">{resource.title}</p>
          </a>
        );
      })}
    </div>
  );
}
